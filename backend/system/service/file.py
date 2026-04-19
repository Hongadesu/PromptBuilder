import json
from pathlib import Path

import webview

import server.service.data_export as DataExportService
import server.service.data_import as DataImportService
from shared.constants import (
    EXPORT_ALL_DEFAULT_FILENAME,
    EXPORT_TEMPLATES_DEFAULT_FILENAME,
    PROMPT_BUILDER_FILE_DESCRIPTION,
)
from shared.schema.file import (
    AppendAppDataResp,
    ExportAppData,
    ExportAppDataResp,
    FileFormat,
)


def create_open_dialog() -> Path:
    window: webview.Window = webview.active_window()
    result = window.create_file_dialog(
        webview.FileDialog.OPEN,
        allow_multiple=False,
        file_types=(PROMPT_BUILDER_FILE_DESCRIPTION,),
    )

    # windows
    if isinstance(result, (list, tuple)):
        if len(result) > 0 and isinstance(result[0], str):
            return Path(result[0])
        else:
            return None

    # mac
    if isinstance(result, str):
        return Path(str(result))

    return None


def create_save_dialog(save_name: str) -> Path:
    window: webview.Window = webview.active_window()
    result = window.create_file_dialog(
        webview.FileDialog.SAVE,
        save_filename=save_name,
        file_types=(PROMPT_BUILDER_FILE_DESCRIPTION,),
    )

    # windows
    if isinstance(result, (list, tuple)):
        if len(result) > 0 and isinstance(result[0], str):
            return Path(result[0])
        else:
            return None

    # mac
    if isinstance(result, str):
        return Path(str(result))

    return None


def save_app_file(file_path: Path, content: dict):
    with open(file_path, "w", encoding="utf-8") as f:
        json.dump(content, f, indent=2, ensure_ascii=False)


def load_app_data(file_path: Path) -> FileFormat | None:
    data: FileFormat | None = None
    with open(file_path, "r", encoding="utf-8") as f:
        data = json.load(f)
    return data


def export_app_data(data: ExportAppData) -> ExportAppDataResp:
    export_type = data.get("type")

    # create file save dialog
    match export_type:
        case "all":
            save_name = EXPORT_ALL_DEFAULT_FILENAME
        case "template-or-quickfill":
            save_name = EXPORT_TEMPLATES_DEFAULT_FILENAME
        case _:
            raise ValueError(f"Unknown export type: {export_type}")

    file_path = create_save_dialog(save_name)
    if file_path is None:
        return {"status": "canceled"}

    # prepare file data
    try:
        export = dict()
        match export_type:
            case "all":
                export = DataExportService.get_export_all_templates()
            case "template-or-quickfill":
                export = DataExportService.get_export_templates(
                    data.get("items")
                )
            case _:
                raise ValueError(f"Unknown export type: {export_type}")

        save_app_file(file_path, export)

    except Exception as e:
        return {"status": "failed", "msg": str(e)}

    return {"status": "success", "file_path": str(file_path)}


def append_app_data() -> AppendAppDataResp:
    file_path = create_open_dialog()
    if file_path is None:
        return {"status": "canceled"}

    # Load app data
    data = load_app_data(file_path)
    if data is None:
        return {"status": "failed", "msg": "Invalid file format"}
    ret = DataImportService.set_import_templates(data)

    return {
        "status": "success",
        "template": ret.get("template", []),
        "quickfill": ret.get("quickfill", []),
    }
