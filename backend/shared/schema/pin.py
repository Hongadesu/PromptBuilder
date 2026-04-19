from typing import TypedDict

from pydantic import BaseModel

from shared.schema.public import Success
from shared.schema.template import TemplateType


class PinTemplate(TypedDict):
    id: str
    title: str
    description: str
    template: str
    param: dict[str, str]
    type: TemplateType


class GetAllPinTemplatesResp(Success):
    """DTO"""

    templates: list[PinTemplate]


class AddPinTemplateReq(BaseModel):
    """DTO"""

    templateId: str
    type: TemplateType
