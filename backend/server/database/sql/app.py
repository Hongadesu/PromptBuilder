### app Database
# Create Tables
INIT_APPGLOBAL_TABLE = (
    """
CREATE TABLE AppGlobal (
    id INTEGER PRIMARY KEY CHECK (id = 1),
    lastRoute TEXT NOT NULL DEFAULT '/home',
    alwaysOnTop INTEGER NOT NULL DEFAULT 0,
    theme TEXT NOT NULL DEFAULT 'light' CHECK (theme IN ('light', 'dark', 'system'))
)
""",
    "INSERT INTO AppGlobal (id, lastRoute) VALUES (1, '/home');",
)


# Check Tables
CHECK_TABLE_EXIST = """
SELECT name FROM sqlite_master 
WHERE type = 'table' AND name = ?;
"""

# CRUD
GET_APPGLOBAL_ALL = "SELECT * FROM AppGlobal WHERE id = 1;"
UPDATE_LAST_ROUTE = "UPDATE AppGlobal SET lastRoute = ? WHERE id = 1;"
UPDATE_ALWAYS_ON_TOP = "UPDATE AppGlobal SET alwaysOnTop = ? WHERE id = 1;"
UPDATE_THEME = "UPDATE AppGlobal SET theme = ? WHERE id = 1;"
