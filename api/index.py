import sys
import os
from pathlib import Path

# Add the project root to sys.path
root_path = Path(__file__).parent.parent
sys.path.insert(0, str(root_path))
sys.path.insert(0, str(root_path / "backend"))

from backend.main import app

# Vercel needs the app variable to be exposed
__all__ = ["app"]
