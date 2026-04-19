import json
from sqlite3 import Connection
from typing import Literal

from shared.schema.template import BaseTemplate

from .local import DataDatabase
from .sql.template import *

BaseTemplateColumn = Literal[
    "id", "title", "description", "template", "param", "createdTime"
]

QuickfillTemplateColumn = Literal[
    "id", "title", "description", "template", "param", "createdTime"
]


class TemplateDatabase(DataDatabase):
    @classmethod
    def init(cls, conn: Connection):
        cursor = conn.cursor()

        if not cls.table_exists("Template"):
            cursor.execute(CREATE_TEMPLATE_TABLE)

        if not cls.table_exists("QuickfillTemplate"):
            cursor.execute(CREATE_QUICKFILL_TEMPLATE_TABLE)

    # template
    @classmethod
    def get_template_by_id(
        cls,
        conn: Connection,
        id: str,
        columns: list[BaseTemplateColumn] | None = None,
    ):
        if columns and isinstance(columns, list):
            select_clause = ", ".join(columns)
        else:
            select_clause = "*"

        cursor = conn.cursor()
        sql = GET_TEMPLATE_BY_ID.format(select_clause=select_clause)
        cursor.execute(sql, (id,))
        return cursor.fetchone()

    @classmethod
    def get_templates_by_ids(
        cls,
        conn: Connection,
        ids: list[str],
        columns: list[BaseTemplateColumn] | None = None,
    ):
        if columns and isinstance(columns, list):
            select_clause = ", ".join(columns)
        else:
            select_clause = "*"

        placeholder = ", ".join(["?"] * len(ids))
        sql = GET_TEMPLATE_BY_IDS.format(
            select_clause=select_clause, ids_placeholder=placeholder
        )
        cursor = conn.cursor()
        cursor.execute(sql, ids)
        return cursor.fetchall()

    @classmethod
    def get_templates_by_page(
        cls,
        conn: Connection,
        page: int,
        num_per_page: int,
        columns: list[BaseTemplateColumn] | None = None,
    ):
        if columns and isinstance(columns, list):
            select_clause = ", ".join(columns)
        else:
            select_clause = "*"

        offset = (page - 1) * num_per_page
        sql = GET_RANGE_TEMPLATE.format(select_clause=select_clause)
        cursor = conn.cursor()
        cursor.execute(sql, (num_per_page, offset))
        return cursor.fetchall()

    @classmethod
    def get_total_templates(cls, conn: Connection):
        cursor = conn.cursor()
        cursor.execute(GET_TEMPLATE_COUNT)
        return cursor.fetchone()[0]

    @classmethod
    def insert_template_data(cls, conn: Connection, data: BaseTemplate):
        cursor = conn.cursor()
        cursor.execute(
            INSERT_TEMPLATE_DATA,
            (
                data.get("id"),
                data.get("title"),
                data.get("description"),
                data.get("template"),
                json.dumps(data.get("param")),
            ),
        )

    @classmethod
    def delete_template_data_by_id(cls, conn: Connection, id: str):
        cursor = conn.cursor()
        cursor.execute(DELETE_TEMPLATE_BY_ID, (id,))
        return cursor.rowcount

    @classmethod
    def delete_all_templates(cls, conn: Connection):
        cursor = conn.cursor()
        cursor.execute(CLEAR_TEMPLATES)

    # quickfill-template
    @classmethod
    def get_quickfill_template_by_id(
        cls,
        conn: Connection,
        id: str,
        columns: list[QuickfillTemplateColumn] | None = None,
    ):
        if columns and isinstance(columns, list):
            select_clause = ", ".join(columns)
        else:
            select_clause = "*"

        cursor = conn.cursor()
        sql = GET_QUICKFILL_TEMPLATE_BY_ID.format(select_clause=select_clause)
        cursor.execute(sql, (id,))
        return cursor.fetchone()

    @classmethod
    def get_quickfill_templates_by_ids(
        cls,
        conn: Connection,
        ids: list[str],
        columns: list[QuickfillTemplateColumn] | None = None,
    ):
        if columns and isinstance(columns, list):
            select_clause = ", ".join(columns)
        else:
            select_clause = "*"

        placeholder = ", ".join(["?"] * len(ids))
        sql = GET_QUICKFILL_TEMPLATE_BY_IDS.format(
            select_clause=select_clause, ids_placeholder=placeholder
        )
        cursor = conn.cursor()
        cursor.execute(sql, ids)
        return cursor.fetchall()

    @classmethod
    def get_quickfill_templates_by_page(
        cls,
        conn: Connection,
        page: int,
        num_per_page: int,
        columns: list[QuickfillTemplateColumn] | None = None,
    ):
        if columns and isinstance(columns, list):
            select_clause = ", ".join(columns)
        else:
            select_clause = "*"

        offset = (page - 1) * num_per_page
        sql = GET_QUICKFILL_RANGE_TEMPLATE.format(select_clause=select_clause)
        cursor = conn.cursor()
        cursor.execute(sql, (num_per_page, offset))
        return cursor.fetchall()

    @classmethod
    def get_total_quickfill_templates(cls, conn: Connection):
        cursor = conn.cursor()
        cursor.execute(GET_QUICKFILL_TEMPLATE_COUNT)
        return cursor.fetchone()[0]

    @classmethod
    def insert_quickfill_template_data(
        cls, conn: Connection, data: BaseTemplate
    ):
        cursor = conn.cursor()
        cursor.execute(
            INSERT_QUICKFILL_TEMPLATE_DATA,
            (
                data.get("id"),
                data.get("title"),
                data.get("description"),
                data.get("template"),
                json.dumps(data.get("param")),
            ),
        )

    @classmethod
    def delete_quickfill_template_data_by_id(cls, conn: Connection, id: str):
        cursor = conn.cursor()
        cursor.execute(DELETE_QUICKFILL_TEMPLATE_BY_ID, (id,))
        return cursor.rowcount

    @classmethod
    def delete_all_quickfill_templates(cls, conn: Connection):
        cursor = conn.cursor()
        cursor.execute(CLEAR_QUICKFILLS)
