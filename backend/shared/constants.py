from shared.schema.file import FileFormat

# App Project Link
PROJECT_LINK = "https://github.com/Hongadesu/PromptBuilder"

# App File Format
DEFAULT_FILE_FORMAT: FileFormat = {
    "name": "prompt-builder",
    "version": 1,
    "template": [],
    "quickfill": [],
}

PROMPT_BUILDER_FILE_EXT = "promptbuilder.json"
PROMPT_BUILDER_FILE_EXT_NAME = "Prompt Builder Files"

# like 'JSON Files (*.json)', 'Prompt Builder Files (*.promptbuilder.json)'
PROMPT_BUILDER_FILE_DESCRIPTION = (
    f"{PROMPT_BUILDER_FILE_EXT_NAME} (*.{PROMPT_BUILDER_FILE_EXT})"
)

EXPORT_ALL_DEFAULT_FILENAME = "app.promptbuilder.json"
EXPORT_TEMPLATES_DEFAULT_FILENAME = "templates.promptbuilder.json"
