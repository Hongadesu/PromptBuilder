import copy

import server.service.template as TemplateService
from shared.constants import DEFAULT_FILE_FORMAT
from shared.schema.file import FileFormat, SelectedTemplate


def get_export_templates(items: list[SelectedTemplate]) -> FileFormat:
    export = copy.copy(DEFAULT_FILE_FORMAT)

    default_ids = [t.get("id") for t in items if t.get("type") == "default"]
    quickfill_ids = [t.get("id") for t in items if t.get("type") == "quickfill"]
    if default_ids:
        export["template"] = TemplateService.get_templates_by_ids(default_ids)
    if quickfill_ids:
        export["quickfill"] = TemplateService.get_quickfill_templates_by_ids(
            quickfill_ids
        )

    return export


def get_export_all_templates() -> FileFormat:
    export = copy.copy(DEFAULT_FILE_FORMAT)

    pageSize = 20
    default_templates = []
    quickfill_templates = []

    template_num = TemplateService.get_template_count()
    for page in range((template_num + pageSize - 1) // pageSize):
        default_templates.extend(
            TemplateService.get_templates_by_page(page + 1, pageSize)
        )

    quickfill_num = TemplateService.get_quickfill_template_count()
    for page in range((quickfill_num + pageSize - 1) // pageSize):
        quickfill_templates.extend(
            TemplateService.get_quickfill_templates_by_page(page + 1, pageSize)
        )

    export["template"] = default_templates
    export["quickfill"] = quickfill_templates

    return export
