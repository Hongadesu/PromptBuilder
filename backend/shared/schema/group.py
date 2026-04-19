from typing import TypedDict

from pydantic import BaseModel

from shared.schema.public import Success
from shared.schema.template import TemplateType


class GroupMeta(TypedDict):
    groupId: str
    group: str
    description: str


class GroupTemplatesItem(TypedDict):
    templateId: str
    groupId: str
    type: TemplateType


class GroupTemplate(TypedDict):
    id: str
    title: str
    description: str
    template: str
    param: dict[str, str]
    type: TemplateType


class GetGroupCountResp(Success):
    """DTO"""

    count: int


class GetGroupsResp(Success):
    """DTO"""

    groups: list[GroupMeta]


class GetGroupDetailResp(Success):
    """DTO"""

    group: GroupMeta


class AddGroupReq_GroupMeta(TypedDict):
    group: str
    description: str


class AddGroupReq_GroupTemplatesItem(TypedDict):
    templateId: str
    type: TemplateType


class AddGroupReq(BaseModel):
    """DTO"""

    group: AddGroupReq_GroupMeta
    groupTemplates: list[AddGroupReq_GroupTemplatesItem] | None = None


class GetTemplatesByGroupidResp(Success):
    """DTO"""

    templates: list[GroupTemplate]


class AddGroupTemplateReq(BaseModel):
    """DTO"""

    groupTemplate: GroupTemplatesItem
