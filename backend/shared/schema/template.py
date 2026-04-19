from typing import Literal, TypedDict

from pydantic import BaseModel

from shared.schema.public import Success

TemplateType = Literal["default", "quickfill"]


class BaseTemplate(TypedDict):
    id: str
    title: str
    description: str
    template: str
    param: dict[str, str]


class QuickfillTemplate(TypedDict):
    id: str
    title: str
    description: str
    template: str
    param: dict[str, str]


class AddTemplateReq_BaseTemplate(TypedDict):
    """DTO"""

    title: str
    description: str
    template: str
    param: dict[str, str]


class AddTemplateReq(BaseModel):
    """DTO"""

    data: AddTemplateReq_BaseTemplate


class AddTemplateResp(Success):
    """DTO"""

    id: str


class GetTemplateCountResp(Success):
    """DTO"""

    count: int


class BaseTemplateResp(Success):
    """DTO"""

    template: BaseTemplate


class BaseTemplatesResp(Success):
    """DTO"""

    templates: list[BaseTemplate]


class QuickfillTemplateResp(Success):
    """DTO"""

    template: QuickfillTemplate


class QuickfillTemplatesResp(Success):
    """DTO"""

    templates: list[QuickfillTemplate]


class AddQuickfillTemplateReq_QuickfillTemplate(TypedDict):
    """DTO"""

    title: str
    description: str
    template: str
    param: dict[str, str]


class AddQuickfillTemplateReq(BaseModel):
    """DTO"""

    data: AddQuickfillTemplateReq_QuickfillTemplate


class AddQuickfillTemplateResp(Success):
    """DTO"""

    id: str
