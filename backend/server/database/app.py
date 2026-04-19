import sqlite3
from contextlib import contextmanager
from sqlite3 import Connection

from info import BASE_DIR
from log import Logger
from shared.schema.local import AppTheme

from .sql.app import *

logger = Logger.get_logger()
DATABASE_PATH = BASE_DIR / "app.db"


class AppDatabase:
    @classmethod
    def get_db(cls):
        return sqlite3.connect(DATABASE_PATH)

    @classmethod
    def init(cls):
        conn = cls.get_db()
        cursor = conn.cursor()

        if not cls.table_exists("AppGlobal"):
            cursor.execute(INIT_APPGLOBAL_TABLE[0])
            cursor.execute(INIT_APPGLOBAL_TABLE[1])

        conn.commit()
        conn.close()

    @classmethod
    def table_exists(cls, table_name: str) -> bool:
        conn = cls.get_db()
        cursor = conn.cursor()
        cursor.execute(CHECK_TABLE_EXIST, (table_name,))
        result = cursor.fetchone()
        conn.close()
        return result is not None

    @classmethod
    @contextmanager
    def transaction_conn(cls):
        """
        insert, delete, update 可以配合使用
        """
        conn = sqlite3.connect(DATABASE_PATH)
        try:
            conn.execute("BEGIN")
            yield conn
            conn.commit()
        except Exception:
            conn.rollback()
            raise
        finally:
            conn.close()

    @classmethod
    @contextmanager
    def read_conn(cls):
        """
        select 可以配合使用
        """
        conn = sqlite3.connect(DATABASE_PATH, check_same_thread=False)
        try:
            yield conn
        except Exception:
            raise
        finally:
            conn.close()

    @classmethod
    def get_global_config(cls, conn: Connection):
        cursor = conn.cursor()
        cursor.execute(GET_APPGLOBAL_ALL)
        return cursor.fetchone()

    @classmethod
    def update_last_route(cls, conn: Connection, route: str):
        cursor = conn.cursor()
        cursor.execute(UPDATE_LAST_ROUTE, (route,))

    @classmethod
    def update_always_on_top(cls, conn: Connection, always_on_top: bool):
        cursor = conn.cursor()
        cursor.execute(UPDATE_ALWAYS_ON_TOP, (1 if always_on_top else 0,))

    @classmethod
    def update_theme(cls, conn: Connection, theme: AppTheme):
        cursor = conn.cursor()
        cursor.execute(UPDATE_THEME, (theme,))
