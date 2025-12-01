import os

import google.generativeai as genai
from dotenv import load_dotenv

# Load .env when the module is imported so local development picks up keys.
load_dotenv()

# Central place for Gemini settings so other modules can import without reconfiguring.
MODEL_NAME = "gemini-2.5-flash"


def configure_genai():
    """Configure the Gemini SDK with the API key from environment."""
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        raise RuntimeError("GEMINI_API_KEY environment variable is required.")
    genai.configure(api_key=api_key)
