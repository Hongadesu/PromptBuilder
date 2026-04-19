import server.service.template as TemplateService
from shared.schema.file import (
    FileFormat,
    FileFormatSetReturn,
    TemplateImportResult,
)


def set_import_templates(file_data: FileFormat) -> FileFormatSetReturn:
    # Import Templates
    templates = file_data.get("template", [])
    t_len = len(templates)
    template_titles: list[TemplateImportResult] = [None] * t_len
    for i, t in enumerate(reversed(templates)):
        id = TemplateService.insert_template({
            "title": t.get("title"),
            "description": t.get("description"),
            "template": t.get("template"),
            "param": t.get("param"),
        })
        template_titles[t_len - 1 - i] = {"id": id, "title": t.get("title")}

    # Import Quickfill Templates
    quickfills = file_data.get("quickfill", [])
    q_len = len(quickfills)
    quickfill_titles: list[TemplateImportResult] = [None] * q_len
    for i, q in enumerate(reversed(quickfills)):
        id = TemplateService.insert_quickfill_template({
            "title": q.get("title"),
            "description": q.get("description"),
            "template": q.get("template"),
            "param": q.get("param"),
        })
        quickfill_titles[q_len - 1 - i] = {"id": id, "title": q.get("title")}

    return {"template": template_titles, "quickfill": quickfill_titles}
