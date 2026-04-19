from server.database import (
    DataDatabase,
    GroupDatabase,
    PinDatabase,
    TemplateDatabase,
)


def clear_app_data():
    with DataDatabase.transaction_conn() as conn:
        PinDatabase.delete_all_pin_templates(conn)
        GroupDatabase.delete_all_group_templates(conn)
        GroupDatabase.delete_all_groups(conn)
        TemplateDatabase.delete_all_templates(conn)
        TemplateDatabase.delete_all_quickfill_templates(conn)
