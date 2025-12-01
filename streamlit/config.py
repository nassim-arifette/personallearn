import os

import google.generativeai as genai

# Central place for Gemini settings so other modules can import without reconfiguring.
MODEL_NAME = "gemini-2.5-flash"


def configure_genai():
    """Configure the Gemini SDK with the API key from environment."""
    genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
