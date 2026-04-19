### data Database
# Create Tables
# - param: Record<string, string>
CREATE_TEMPLATE_TABLE = """
CREATE TABLE Template (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT NOT NULL DEFAULT 'None',
    template TEXT NOT NULL,
    param JSON NOT NULL CHECK (json_valid(param)),
    createdTime TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);
"""

CREATE_QUICKFILL_TEMPLATE_TABLE = """
CREATE TABLE QuickfillTemplate (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT NOT NULL DEFAULT 'None',
    template TEXT NOT NULL,
    param JSON NOT NULL CHECK (json_valid(param)),
    createdTime TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);
"""

# prompt Table
GET_TEMPLATE_COUNT = "SELECT COUNT(Template.id) FROM Template;"
GET_RANGE_TEMPLATE = """
SELECT {select_clause} FROM Template 
ORDER BY createdTime DESC 
LIMIT ? OFFSET ?;
"""
GET_TEMPLATE_BY_ID = "SELECT {select_clause} FROM Template WHERE id = ?;"
GET_TEMPLATE_BY_IDS = (
    "SELECT {select_clause} FROM Template WHERE id IN ({ids_placeholder});"
)
INSERT_TEMPLATE_DATA = "INSERT INTO Template (id, title, description, template, param) VALUES (?, ?, ?, ?, ?);"
DELETE_TEMPLATE_BY_ID = "DELETE FROM Template WHERE id = ?;"
# UPDATE_PROMPT_DATA_BY_ID = "UPDATE Template SET {set_clause} WHERE id = ?"
CLEAR_TEMPLATES = "DELETE FROM Template;"

# quickfill prompt Table
GET_QUICKFILL_TEMPLATE_COUNT = (
    "SELECT COUNT(QuickfillTemplate.id) FROM QuickfillTemplate;"
)
GET_QUICKFILL_TEMPLATE_BY_ID = (
    "SELECT {select_clause} FROM QuickfillTemplate WHERE id = ?;"
)
GET_QUICKFILL_TEMPLATE_BY_IDS = "SELECT {select_clause} FROM QuickfillTemplate WHERE id IN ({ids_placeholder});"
GET_QUICKFILL_RANGE_TEMPLATE = """
SELECT {select_clause} FROM QuickfillTemplate 
ORDER BY createdTime DESC 
LIMIT ? OFFSET ?;
"""
INSERT_QUICKFILL_TEMPLATE_DATA = "INSERT INTO QuickfillTemplate (id, title, description, template, param) VALUES (?, ?, ?, ?, ?);"
DELETE_QUICKFILL_TEMPLATE_BY_ID = "DELETE FROM QuickfillTemplate WHERE id = ?;"
CLEAR_QUICKFILLS = "DELETE FROM QuickfillTemplate;"
