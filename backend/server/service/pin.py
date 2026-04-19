import json

from server.database import DataDatabase, PinDatabase, TemplateDatabase
from shared.schema.pin import PinTemplate
from shared.schema.template import TemplateType


# pin
def get_all_pin_templates() -> list[PinTemplate]:
    with DataDatabase.read_conn() as conn:
        pins: list[tuple[str, TemplateType]] = PinDatabase.get_all_pins(conn)
        default_ids = [tid for tid, t in pins if t == "default"]
        quickfill_ids = [tid for tid, t in pins if t == "quickfill"]

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

        result = [None] * len(pins)
        for i, (templateId, type) in enumerate(pins):
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


def insert_pin_template(templateId: str, type: TemplateType):
    with PinDatabase.transaction_conn() as conn:
        PinDatabase.insert_pin_template(conn, templateId, type)


def delete_pin_template(templateId: str):
    with PinDatabase.transaction_conn() as conn:
        PinDatabase.delete_pin_template(conn, templateId)


def delete_all_pin_templates():
    with PinDatabase.transaction_conn() as conn:
        PinDatabase.delete_all_pin_templates(conn)
