import base64
import io
import re
from typing import Optional

from fastapi import FastAPI, File, Form, HTTPException, UploadFile
from fastapi.responses import StreamingResponse
from fastapi.middleware.cors import CORSMiddleware

from .data import QUESTIONS
from .schemas import CourseResponse, ProfileRequest, ProfileResponse
from .services.course_generator import generate_course_from_pdf
from .services.pdf_io import read_pdf, render_course_pdf_to_bytes

app = FastAPI(
    title="PersonalLearn Backend",
    description="API surface that mirrors the Streamlit backend features.",
    version="0.1.0",
)

# Allow browser preflight requests from any origin (adjust as needed for production).
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def compute_profile(score: int, duration_seconds: float) -> ProfileResponse:
    """Replicate the Streamlit efficiency logic to infer a learning profile."""
    efficiency = (score / (duration_seconds + 1)) * 100

    if efficiency > 12:
        profile = {"level": "Advanced", "units": 4, "desc": "High Density"}
    elif efficiency > 6:
        profile = {"level": "Intermediate", "units": 7, "desc": "Balanced"}
    else:
        profile = {"level": "Beginner", "units": 10, "desc": "Micro-Learning"}

    return ProfileResponse(efficiency=efficiency, **profile)


@app.get("/health")
def healthcheck():
    return {"status": "ok"}


@app.get("/quiz")
def get_quiz():
    """Expose the calibration questions so the frontend can stay in sync."""
    return {"questions": QUESTIONS}


@app.post("/profile", response_model=ProfileResponse)
def get_profile(payload: ProfileRequest):
    return compute_profile(payload.score, payload.duration_seconds)


async def _build_course_from_input(
    file: Optional[UploadFile],
    pdf_text: Optional[str],
    course_title: str,
    level: str,
    units: int,
):
    if not file and not pdf_text:
        raise HTTPException(
            status_code=400, detail="Provide either a PDF upload or a pdf_text string."
        )

    if file:
        file_bytes = await file.read()
        if not file_bytes:
            raise HTTPException(status_code=400, detail="Uploaded PDF was empty.")
        parsed_pdf_text = read_pdf(io.BytesIO(file_bytes))
    else:
        parsed_pdf_text = pdf_text or ""

    try:
        return generate_course_from_pdf(parsed_pdf_text, course_title, level, units)
    except RuntimeError as exc:
        raise HTTPException(status_code=500, detail=str(exc)) from exc
    except ValueError as exc:
        raise HTTPException(status_code=502, detail=str(exc)) from exc


@app.post("/course", response_model=CourseResponse)
async def create_course(
    course_title: str = Form(...),
    level: str = Form(...),
    units: int = Form(...),
    include_pdf: bool = Form(False),
    file: Optional[UploadFile] = File(None),
    pdf_text: Optional[str] = Form(None),
):
    course = await _build_course_from_input(file, pdf_text, course_title, level, units)
    response = {"course": course}

    if include_pdf:
        pdf_bytes = render_course_pdf_to_bytes(course)
        response["course_pdf_base64"] = base64.b64encode(pdf_bytes).decode("utf-8")

    return response


@app.post("/course/pdf")
async def create_course_pdf(
    course_title: str = Form(...),
    level: str = Form(...),
    units: int = Form(...),
    file: Optional[UploadFile] = File(None),
    pdf_text: Optional[str] = Form(None),
):
    course = await _build_course_from_input(file, pdf_text, course_title, level, units)
    pdf_bytes = render_course_pdf_to_bytes(course)
    safe_title = re.sub(r"[^A-Za-z0-9_.-]+", "_", course.get("title", course_title))
    headers = {"Content-Disposition": f'attachment; filename="{safe_title or "course"}.pdf"'}
    return StreamingResponse(
        io.BytesIO(pdf_bytes), media_type="application/pdf", headers=headers
    )
