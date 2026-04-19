from server.database.app import AppDatabase
from server.database.group import GroupDatabase
from server.database.local import DataDatabase
from server.database.pin import PinDatabase
from server.database.template import TemplateDatabase


def init_databases():
    # app.db
    AppDatabase.init()

    # data.db
    with DataDatabase.transaction_conn() as conn:
        TemplateDatabase.init(conn)
        GroupDatabase.init(conn)
        PinDatabase.init(conn)
