import os
import sys
from pathlib import Path
from typing import TypedDict

# Environment
IS_DEV = os.getenv("PROMPT_BUILDER_ENV", None) == "dev"


# Program Path
if getattr(sys, "frozen", False):
    # Running in a bundle
    BASE_DIR = Path(sys._MEIPASS)
else:
    # Running in a normal Python environment
    BASE_DIR = Path(os.path.dirname(os.path.abspath(__file__)))


# Global Variables
class GlobalParamType(TypedDict):
    pass


class Global:
    __var: GlobalParamType = {}

    @staticmethod
    def get(key):
        return Global.__var.get(key)

    @staticmethod
    def set(key, value):
        Global.__var[key] = value
