import json

from server.database import (
    DataDatabase,
    GroupDatabase,
    PinDatabase,
    TemplateDatabase,
)
from server.service.utils import get_new_id
from shared.schema.template import (
    AddQuickfillTemplateReq_QuickfillTemplate,
    AddTemplateReq_BaseTemplate,
    BaseTemplate,
    QuickfillTemplate,
)


# template
def get_template_count() -> int:
    with TemplateDatabase.read_conn() as conn:
        return TemplateDatabase.get_total_templates(conn)


def get_template_by_id(id: str) -> BaseTemplate:
    with TemplateDatabase.read_conn() as conn:
        data = TemplateDatabase.get_template_by_id(
            conn, id, ["id", "title", "description", "template", "param"]
        )

        if data is None:
            raise ValueError(f"Prompt data not found, id: {id}")

        return {
            "id": data[0],
            "title": data[1],
            "description": data[2],
            "template": data[3],
            "param": json.loads(data[4]),
        }


def get_templates_by_ids(ids: list[str]) -> list[BaseTemplate]:
    with TemplateDatabase.read_conn() as conn:
        data = TemplateDatabase.get_templates_by_ids(
            conn, ids, ["id", "title", "description", "template", "param"]
        )

        return [
            {
                "id": row[0],
                "title": row[1],
                "description": row[2],
                "template": row[3],
                "param": json.loads(row[4]),
            }
            for row in data
        ]


def get_templates_by_page(page: int, pageSize: int) -> list[BaseTemplate]:
    with TemplateDatabase.read_conn() as conn:
        data = TemplateDatabase.get_templates_by_page(
            conn,
            page,
            pageSize,
            ["id", "title", "description", "template", "param"],
        )

        return [
            {
                "id": row[0],
                "title": row[1],
                "description": row[2],
                "template": row[3],
                "param": json.loads(row[4]),
            }
            for row in data
        ]


def insert_template(data: AddTemplateReq_BaseTemplate) -> str:
    new_id = get_new_id()
    insert_data: BaseTemplate = {
        "id": new_id,
        "title": data.get("title"),
        "description": data.get("description"),
        "template": data.get("template"),
        "param": data.get("param"),
    }

    with TemplateDatabase.transaction_conn() as conn:
        TemplateDatabase.insert_template_data(conn, insert_data)

    return new_id


def delete_template(id: str):
    with DataDatabase.transaction_conn() as conn:
        deleted_count = TemplateDatabase.delete_template_data_by_id(conn, id)
        if deleted_count != 1:
            raise ValueError(
                f"Template delete failed, id: {id}, with deleted_count: {deleted_count}"
            )
        PinDatabase.delete_pin_template(conn, id)
        GroupDatabase.delete_group_template_by_templateid(conn, id)


# quickfill-template
def get_quickfill_template_count() -> int:
    with TemplateDatabase.read_conn() as conn:
        return TemplateDatabase.get_total_quickfill_templates(conn)


def get_quickfill_template_by_id(id: str) -> QuickfillTemplate:
    with TemplateDatabase.read_conn() as conn:
        data = TemplateDatabase.get_quickfill_template_by_id(
            conn, id, ["id", "title", "description", "template", "param"]
        )

        if data is None:
            raise ValueError(f"Prompt data not found, id: {id}")

        return {
            "id": data[0],
            "title": data[1],
            "description": data[2],
            "template": data[3],
            "param": json.loads(data[4]),
        }


def get_quickfill_templates_by_ids(ids: list[str]) -> list[QuickfillTemplate]:
    with TemplateDatabase.read_conn() as conn:
        data = TemplateDatabase.get_quickfill_templates_by_ids(
            conn, ids, ["id", "title", "description", "template", "param"]
        )

        return [
            {
                "id": row[0],
                "title": row[1],
                "description": row[2],
                "template": row[3],
                "param": json.loads(row[4]),
            }
            for row in data
        ]


def get_quickfill_templates_by_page(
    page: int, pageSize: int
) -> list[QuickfillTemplate]:
    with TemplateDatabase.read_conn() as conn:
        data = TemplateDatabase.get_quickfill_templates_by_page(
            conn,
            page,
            pageSize,
            ["id", "title", "description", "template", "param"],
        )

        return [
            {
                "id": row[0],
                "title": row[1],
                "description": row[2],
                "template": row[3],
                "param": json.loads(row[4]),
            }
            for row in data
        ]


def insert_quickfill_template(
    data: AddQuickfillTemplateReq_QuickfillTemplate,
) -> str:
    new_id = get_new_id()
    insert_data: BaseTemplate = {
        "id": new_id,
        "title": data.get("title"),
        "description": data.get("description"),
        "template": data.get("template"),
        "param": data.get("param"),
    }

    with TemplateDatabase.transaction_conn() as conn:
        TemplateDatabase.insert_quickfill_template_data(conn, insert_data)

    return new_id


def delete_quickfill_template(id: str):
    with DataDatabase.transaction_conn() as conn:
        deleted_count = TemplateDatabase.delete_quickfill_template_data_by_id(
            conn, id
        )
        if deleted_count != 1:
            raise ValueError(
                f"Quickfill Template delete failed, id: {id}, with deleted_count: {deleted_count}"
            )
        PinDatabase.delete_pin_template(conn, id)
        GroupDatabase.delete_group_template_by_templateid(conn, id)
