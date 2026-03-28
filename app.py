"""
FastAPI application entry point.
This file serves as the main entry point for deployment platforms.
"""
import sys
from pathlib import Path

# Add the project root and backend directory to sys.path
project_root = Path(__file__).parent
sys.path.insert(0, str(project_root))
sys.path.insert(0, str(project_root / "backend"))

from backend.main import app

__all__ = ["app"]
