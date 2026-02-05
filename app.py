"""
FastAPI application entry point.
This file serves as the main entry point for deployment platforms.
"""
import sys
from pathlib import Path

# Add the project root to sys.path to ensure backend module can be imported
project_root = Path(__file__).parent
sys.path.insert(0, str(project_root))

from backend.main import app

__all__ = ["app"]
