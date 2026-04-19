from typing import Literal, TypedDict

from shared.schema.template import TemplateType


class FileTemplateItem(TypedDict):
    id: str
    title: str
    description: str
    template: str
    param: dict


class FileQuickfillItem(TypedDict):
    id: str
    title: str
    description: str
    template: str
    param: dict


class FileFormat(TypedDict):
    name: Literal["prompt-builder"]
    version: int
    template: list[FileTemplateItem]
    quickfill: list[FileQuickfillItem]


class TemplateImportResult(TypedDict):
    id: str
    title: str


class FileFormatSetReturn(TypedDict):
    template: list[TemplateImportResult]
    quickfill: list[TemplateImportResult]


class AppendAppDataRespSuccess(TypedDict, FileFormatSetReturn):
    status: Literal["success"]


class AppendAppDataRespFailed(TypedDict):
    status: Literal["failed"]
    msg: str


class AppendAppDataRespCanceled(TypedDict):
    status: Literal["canceled"]


AppendAppDataResp = (
    AppendAppDataRespSuccess
    | AppendAppDataRespFailed
    | AppendAppDataRespCanceled
)


class SelectedTemplate(TypedDict):
    id: str
    type: TemplateType


class ExportAppTemplatesData(TypedDict):
    type: Literal["template-or-quickfill"]
    items: list[SelectedTemplate]


class ExportAppAllData(TypedDict):
    type: Literal["all"]
    items: None


ExportAppDataType = Literal["all", "template-or-quickfill"]
ExportAppData = ExportAppTemplatesData | ExportAppAllData


class ExportAppDataRespSuccess(TypedDict):
    status: Literal["success"]
    file_path: str


class ExportAppDataRespFailed(TypedDict):
    status: Literal["failed"]
    msg: str


class ExportAppDataRespCanceled(TypedDict):
    status: Literal["canceled"]


ExportAppDataResp = (
    ExportAppDataRespSuccess
    | ExportAppDataRespFailed
    | ExportAppDataRespCanceled
)
