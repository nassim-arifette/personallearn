import os
import sys


def _ensure_app_path():
    base_dir = os.path.dirname(__file__)
    app_dir = os.path.join(base_dir, "streamlit")
    if app_dir not in sys.path:
        sys.path.insert(0, app_dir)


_ensure_app_path()

from app import main


if __name__ == "__main__":
    main()
