import json

from server.database import DataDatabase, GroupDatabase, TemplateDatabase
from server.service.utils import get_new_id
from shared.schema.group import (
    AddGroupReq_GroupMeta,
    AddGroupReq_GroupTemplatesItem,
    GroupMeta,
    GroupTemplate,
    GroupTemplatesItem,
)
from shared.schema.template import TemplateType


def get_group_count() -> int:
    with GroupDatabase.read_conn() as conn:
        return GroupDatabase.get_total_groups(conn)


def get_groups_by_page(page: int, pageSize: int) -> list[GroupMeta]:
    with GroupDatabase.read_conn() as conn:
        groups = GroupDatabase.get_groups_by_page(conn, page, pageSize)
        return [
            {
                "groupId": group[0],
                "group": group[1],
                "description": group[2],
            }
            for group in groups
        ]


def get_groups() -> list[GroupMeta]:
    with GroupDatabase.read_conn() as conn:
        groups = GroupDatabase.get_groups(conn)
        return [
            {
                "groupId": group[0],
                "group": group[1],
                "description": group[2],
            }
            for group in groups
        ]


def get_groups_by_templateid(templateId: str) -> list[GroupMeta]:
    with GroupDatabase.read_conn() as conn:
        group_templates: list[tuple[str, str, TemplateType]] = (
            GroupDatabase.get_group_templates_by_templateid(conn, templateId)
        )
        group_ids = [gt[1] for gt in group_templates]
        groups = GroupDatabase.get_groups_by_groupids(conn, group_ids)
        return [
            {
                "groupId": group[0],
                "group": group[1],
                "description": group[2],
            }
            for group in groups
        ]


def get_group_detail(groupId: str) -> GroupMeta:
    with GroupDatabase.read_conn() as conn:
        group_detail = GroupDatabase.get_group_detail(conn, groupId)
        if group_detail is None:
            raise ValueError(f"Group detail not found, id: {groupId}")

        return {
            "groupId": group_detail[0],
            "group": group_detail[1],
            "description": group_detail[2],
        }


def insert_group(
    groupItem: AddGroupReq_GroupMeta,
    groupTemplateItems: list[AddGroupReq_GroupTemplatesItem],
):
    group_id = get_new_id()
    groupData: GroupMeta = {
        "groupId": group_id,
        "group": groupItem.get("group"),
        "description": groupItem.get("description"),
    }
    groupTemplateDataList: list[GroupTemplatesItem] = [
        {
            "templateId": item.get("templateId"),
            "groupId": group_id,
            "type": item.get("type"),
        }
        for item in groupTemplateItems
    ]
    with GroupDatabase.transaction_conn() as conn:
        GroupDatabase.insert_group(conn, groupData)
        if groupTemplateDataList:
            GroupDatabase.insert_group_templates(conn, groupTemplateDataList)


def delete_group(groupId: str):
    with GroupDatabase.transaction_conn() as conn:
        GroupDatabase.delete_group(conn, groupId)
        GroupDatabase.delete_all_group_template_by_groupid(conn, groupId)


def update_group():
    raise NotImplementedError


def get_templates_by_groupid(groupId: str) -> list[GroupTemplate]:
    with DataDatabase.read_conn() as conn:
        groupTemplates: list[tuple[str, str, TemplateType]] = (
            GroupDatabase.get_group_templates_by_groupid(conn, groupId)
        )
        default_ids = [gt[0] for gt in groupTemplates if gt[2] == "default"]
        quickfill_ids = [gt[0] for gt in groupTemplates if gt[2] == "quickfill"]

        default_map = {}
        quickfill_map = {}
        if default_ids:
            default_templates = TemplateDatabase.get_templates_by_ids(
                conn,
                default_ids,
                ["id", "title", "description", "template", "param"],
            )
            default_map = {row[0]: row for row in default_templates}

        if quickfill_ids:
            quickfill_templates = (
                TemplateDatabase.get_quickfill_templates_by_ids(
                    conn,
                    quickfill_ids,
                    ["id", "title", "description", "template", "param"],
                )
            )
            quickfill_map = {row[0]: row for row in quickfill_templates}

        result = [None] * len(groupTemplates)
        for i, (templateId, _, type) in enumerate(groupTemplates):
            if type == "default":
                template = default_map[templateId]
            else:
                template = quickfill_map[templateId]

            result[i] = {
                "id": templateId,
                "type": type,
                "title": template[1],
                "description": template[2],
                "template": template[3],
                "param": json.loads(template[4]),
            }

        return result


def insert_group_template(groupTemplateData: GroupTemplatesItem):
    with GroupDatabase.transaction_conn() as conn:
        GroupDatabase.insert_group_template(conn, groupTemplateData)


def delete_group_template(templateId: str, groupId: str):
    with GroupDatabase.transaction_conn() as conn:
        GroupDatabase.delete_group_template(conn, templateId, groupId)


def delete_all_group_templates():
    with GroupDatabase.transaction_conn() as conn:
        GroupDatabase.delete_all_group_templates(conn)


def delete_all_groups():
    with GroupDatabase.transaction_conn() as conn:
        GroupDatabase.delete_all_groups(conn)
