import sqlite3
from sqlite3 import Connection

from shared.schema.public import AlreadyExistsError
from shared.schema.template import TemplateType

from .local import DataDatabase
from .sql.pin import *


class PinDatabase(DataDatabase):
    @classmethod
    def init(cls, conn: Connection):
        cursor = conn.cursor()
        if not cls.table_exists("Pin"):
            cursor.execute(CREATE_PIN_TABLE)

    # Pin template table
    @classmethod
    def get_all_pins(cls, conn: Connection):
        cursor = conn.cursor()
        cursor.execute(GET_ALL_PIN)
        return cursor.fetchall()

    @classmethod
    def insert_pin_template(cls, conn: Connection, id: str, type: TemplateType):
        try:
            cursor = conn.cursor()
            cursor.execute(INSERT_PIN_TEMPLATE, (id, type))

        except sqlite3.IntegrityError as e:
            raise AlreadyExistsError(str(e))

        except Exception as e:
            raise e

    @classmethod
    def delete_pin_template(cls, conn: Connection, id: str):
        cursor = conn.cursor()
        cursor.execute(DELETE_PIN_TEMPLATE, (id,))

    @classmethod
    def delete_all_pin_templates(cls, conn: Connection):
        cursor = conn.cursor()
        cursor.execute(CLEAR_PIN)
