import sqlite3
from sqlite3 import Connection
from typing import Literal

from shared.schema.group import GroupMeta, GroupTemplatesItem
from shared.schema.public import AlreadyExistsError

from .local import DataDatabase
from .sql.group import *

GroupMetaColumn = Literal["groupId", "name", "description"]


class GroupDatabase(DataDatabase):
    @classmethod
    def init(cls, conn: Connection):
        cursor = conn.cursor()

        if not cls.table_exists("Groups"):
            cursor.execute(CREATE_GROUP_TABLE)

        if not cls.table_exists("GroupTemplates"):
            cursor.execute(CREATE_GROUP_TEMPLATES_TABLE)

    # Groups table
    @classmethod
    def get_total_groups(cls, conn: Connection) -> int:
        cursor = conn.cursor()
        cursor.execute(GET_GROUP_COUNT)
        return cursor.fetchone()[0]

    @classmethod
    def get_groups_by_page(
        cls,
        conn: Connection,
        page: int,
        num_per_page: int,
        columns: list[GroupMetaColumn] | None = None,
    ):
        if columns and isinstance(columns, list):
            select_clause = ", ".join(columns)
        else:
            select_clause = "*"

        offset = (page - 1) * num_per_page
        sql = GET_RANGE_GROUPS.format(select_clause=select_clause)
        cursor = conn.cursor()
        cursor.execute(sql, (num_per_page, offset))
        return cursor.fetchall()

    @classmethod
    def get_groups(cls, conn: Connection):
        cursor = conn.cursor()
        cursor.execute(GET_GROUPS)
        return cursor.fetchall()

    @classmethod
    def get_groups_by_groupids(cls, conn: Connection, ids: list[str]):
        placeholder = ", ".join(["?"] * len(ids))
        sql = GET_GROUPS_BY_GROUPIDS.format(ids_placeholder=placeholder)
        cursor = conn.cursor()
        cursor.execute(sql, ids)
        return cursor.fetchall()

    @classmethod
    def get_group_detail(cls, conn: Connection, groupId: str):
        cursor = conn.cursor()
        cursor.execute(GET_GROUP_DETAIL, (groupId,))
        return cursor.fetchone()

    @classmethod
    def insert_group(cls, conn: Connection, groupData: GroupMeta):
        cursor = conn.cursor()
        cursor.execute(
            INSERT_GROUP,
            (
                groupData.get("groupId"),
                groupData.get("group"),
                groupData.get("description"),
            ),
        )

    @classmethod
    def delete_group(cls, conn: Connection, groupId: str):
        cursor = conn.cursor()
        cursor.execute(DELETE_GROUP, (groupId,))

    # GroupTemplate table
    @classmethod
    def get_group_templates_by_templateid(
        cls, conn: Connection, templateId: str
    ):
        cursor = conn.cursor()
        cursor.execute(GET_GROUP_TEMPLATES_BY_TEMPLATE_ID, (templateId,))
        return cursor.fetchall()

    @classmethod
    def get_group_templates_by_groupid(cls, conn: Connection, groupId: str):
        cursor = conn.cursor()
        cursor.execute(GET_GROUP_TEMPLATES_BY_GROUP_ID, (groupId,))
        return cursor.fetchall()

    @classmethod
    def insert_group_template(
        cls, conn: Connection, groupTemplateData: GroupTemplatesItem
    ):
        try:
            cursor = conn.cursor()
            cursor.execute(
                INSERT_GROUP_TEMPLATE,
                (
                    groupTemplateData.get("templateId"),
                    groupTemplateData.get("groupId"),
                    groupTemplateData.get("type"),
                ),
            )

        except sqlite3.IntegrityError as e:
            raise AlreadyExistsError(str(e))

        except Exception as e:
            raise e

    @classmethod
    def insert_group_templates(
        cls, conn: Connection, groupTemplateDataList: list[GroupTemplatesItem]
    ):
        try:
            cursor = conn.cursor()
            cursor.executemany(
                INSERT_GROUP_TEMPLATE,
                [
                    (
                        gt.get("templateId"),
                        gt.get("groupId"),
                        gt.get("type"),
                    )
                    for gt in groupTemplateDataList
                ],
            )

        except sqlite3.IntegrityError as e:
            raise AlreadyExistsError(str(e))

        except Exception as e:
            raise e

    @classmethod
    def delete_group_template(
        cls, conn: Connection, templateId: str, groupId: str
    ):
        cursor = conn.cursor()
        cursor.execute(DELETE_GROUP_TEMPLATE, (templateId, groupId))

    @classmethod
    def delete_group_template_by_templateid(
        cls, conn: Connection, templateId: str
    ):
        cursor = conn.cursor()
        cursor.execute(DELETE_ALL_GROUP_TEMPLATES_BY_TEMPLATE_ID, (templateId,))

    @classmethod
    def delete_all_group_template_by_groupid(
        cls, conn: Connection, groupId: str
    ):
        cursor = conn.cursor()
        cursor.execute(DELETE_ALL_GROUP_TEMPLATES_BY_GROUP_ID, (groupId,))

    @classmethod
    def delete_all_group_templates(cls, conn: Connection):
        cursor = conn.cursor()
        cursor.execute(CLEAR_GROUP_TEMPLATES)

    @classmethod
    def delete_all_groups(cls, conn: Connection):
        cursor = conn.cursor()
        cursor.execute(CLEAR_GROUPS)
