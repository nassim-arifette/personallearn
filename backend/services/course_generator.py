import json

import google.generativeai as genai

from ..config import MODEL_NAME, configure_genai


def clean_json_string(text: str) -> str:
    """Strip Markdown fences often returned by LLMs."""
    cleaned = text.strip()
    if cleaned.startswith("```json"):
        cleaned = cleaned[7:]
    if cleaned.startswith("```"):
        cleaned = cleaned[3:]
    if cleaned.endswith("```"):
        cleaned = cleaned[:-3]
    return cleaned.strip()


def generate_course_from_pdf(pdf_text: str, course_title: str, level: str, n_units: int):
    """Call Gemini to produce a structured course JSON from PDF text."""
    configure_genai()
    system_prompt = """
You are PersonalLearn, an adaptive AI. Detect the language. Output ONLY valid JSON.
JSON structure:
{
  "title": "String",
  "level": "String",
  "description": "String",
  "language": "fr" or "en",
  "units": [
    {
      "title": "String",
      "content": "String (Detailed, comprehensive educational content adapted to the level. Must be long enough to study.)",
      "objectives": ["String", "String"],
      "quiz_questions": [
        {
          "question": "String",
          "choices": ["A","B","C","D"],
          "correct_choice": 0,
          "explanation": "String"
        }
      ]
    }
  ]
}
Constraints:
- EXACTLY n_units units.
- Content must be physically adapted (simplified or deepened) based on 'level'.
"""
    user_prompt = f"""
Title: {course_title}
Level: {level}
Units: {n_units}
Content:
{pdf_text[:25000]}
"""
    response = genai.GenerativeModel(MODEL_NAME).generate_content(
        [{"role": "user", "parts": [system_prompt + "\n" + user_prompt]}]
    )
    raw = response.text or ""
    try:
        return json.loads(clean_json_string(raw))
    except json.JSONDecodeError as exc:
        raise ValueError("Gemini response was not valid JSON") from exc
