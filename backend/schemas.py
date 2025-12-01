from typing import Any, Dict, Optional

from pydantic import BaseModel, Field


class ProfileRequest(BaseModel):
    score: int = Field(..., ge=0, description="Number of correct quiz answers.")
    duration_seconds: float = Field(
        ..., ge=0, description="How long the quiz took in seconds."
    )


class ProfileResponse(BaseModel):
    level: str
    units: int
    desc: str
    efficiency: float


class CourseResponse(BaseModel):
    course: Dict[str, Any]
    course_pdf_base64: Optional[str] = None
