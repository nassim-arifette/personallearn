import json

import google.generativeai as genai

from config import MODEL_NAME, configure_genai


def clean_json_string(text):
    text = text.strip()
    if text.startswith("```json"):
        text = text[7:]
    if text.startswith("```"):
        text = text[3:]
    if text.endswith("```"):
        text = text[:-3]
    return text


def generate_course_from_pdf(pdf_text, course_title, level, n_units):
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
    return json.loads(clean_json_string(response.text))
