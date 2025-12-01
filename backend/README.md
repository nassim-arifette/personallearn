# PersonalLearn Backend (FastAPI)

This backend mirrors the Streamlit logic as a reusable API surface.

## Setup
- Create and activate a virtualenv.
- Install dependencies: `pip install -r backend/requirements.txt`
- Add your Gemini key in `.env`: `GEMINI_API_KEY=...` (auto-loaded via `python-dotenv`)

## Run
- Start the API from the repo root: `uvicorn backend.main:app --reload`
- Swagger docs: `http://localhost:8000/docs`

## Endpoints
- `GET /health` — liveness probe.
- `GET /quiz` — returns the calibration questions.
- `POST /profile` — body: `{"score": int, "duration_seconds": float}`; returns level/units/efficiency.
- `POST /course` — form-data with `course_title`, `level`, `units`, `include_pdf` (bool), plus either `file` (PDF upload) or `pdf_text` (raw string). Returns the generated course JSON and optional PDF as base64.
- `POST /course/pdf` — same form fields as `/course`; streams back a ready-to-download PDF file.
