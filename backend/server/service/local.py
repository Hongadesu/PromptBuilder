from server.database import AppDatabase
from shared.schema.local import AppTheme, GlobalConfig


def get_global_config() -> GlobalConfig:
    with AppDatabase.read_conn() as conn:
        data = AppDatabase.get_global_config(conn)
        return {
            "lastRoute": data[1],
            "alwaysOnTop": bool(data[2]),
            "theme": data[3],
        }


def update_always_on_top(on_top: bool):
    with AppDatabase.transaction_conn() as conn:
        AppDatabase.update_always_on_top(conn, on_top)


def update_last_route(route: str):
    with AppDatabase.transaction_conn() as conn:
        AppDatabase.update_last_route(conn, route)


def update_theme(theme: AppTheme):
    with AppDatabase.transaction_conn() as conn:
        AppDatabase.update_theme(conn, theme)
