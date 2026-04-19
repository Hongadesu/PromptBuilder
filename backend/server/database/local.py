import sqlite3
from abc import ABC, abstractmethod
from contextlib import contextmanager
from sqlite3 import Connection

from info import BASE_DIR

from .sql.globals import *

LOCAL_DATABASE_PATH = BASE_DIR / "data.db"


class DataDatabase(ABC):
    @classmethod
    def get_db(cls):
        return sqlite3.connect(LOCAL_DATABASE_PATH)

    @classmethod
    @abstractmethod
    def init(cls, conn: Connection):
        raise NotImplementedError

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
        conn = sqlite3.connect(LOCAL_DATABASE_PATH)
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
        conn = sqlite3.connect(LOCAL_DATABASE_PATH, check_same_thread=False)
        try:
            yield conn
        except Exception:
            raise
        finally:
            conn.close()
