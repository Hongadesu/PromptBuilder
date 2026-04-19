# Groups Table
CREATE_GROUP_TABLE = """
CREATE TABLE Groups (
    groupId TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT NOT NULL DEFAULT '',
    createdTime TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);
"""

GET_GROUP_COUNT = "SELECT COUNT(Groups.groupId) FROM Groups;"
GET_RANGE_GROUPS = """
SELECT {select_clause} FROM Groups 
ORDER BY createdTime DESC  
LIMIT ? OFFSET ?;
"""
GET_GROUPS = "SELECT * FROM Groups;"
GET_GROUPS_BY_GROUPIDS = (
    "SELECT * FROM Groups WHERE groupId IN ({ids_placeholder});"
)
GET_GROUP_DETAIL = "SELECT * FROM Groups WHERE groupId = ?;"
INSERT_GROUP = (
    "INSERT INTO Groups (groupId, name, description) VALUES (?, ?, ?);"
)
DELETE_GROUP = "DELETE FROM Groups WHERE groupId = ?;"
# UPDATE_GROUP = "UPDATE Groups SET name = ?, description = ? WHERE groupId = ?;"

# GroupTemplates Table
CREATE_GROUP_TEMPLATES_TABLE = """
CREATE TABLE GroupTemplates (
    templateId TEXT,
    groupId TEXT,
    type TEXT NOT NULL 
      CHECK (type IN (
        'default', 'quickfill'
      )),
    PRIMARY KEY (templateId, groupId)
);
"""

GET_GROUP_TEMPLATES_BY_GROUP_ID = (
    "SELECT * FROM GroupTemplates WHERE groupId = ?;"
)
GET_GROUP_TEMPLATES_BY_TEMPLATE_ID = (
    "SELECT * FROM GroupTemplates WHERE templateId = ?;"
)
INSERT_GROUP_TEMPLATE = (
    "INSERT INTO GroupTemplates (templateId, groupId, type) VALUES (?, ?, ?);"
)
DELETE_GROUP_TEMPLATE = (
    "DELETE FROM GroupTemplates WHERE templateId = ? AND groupId = ?;"
)
DELETE_ALL_GROUP_TEMPLATES_BY_TEMPLATE_ID = (
    "DELETE FROM GroupTemplates WHERE templateId = ?;"
)
DELETE_ALL_GROUP_TEMPLATES_BY_GROUP_ID = (
    "DELETE FROM GroupTemplates WHERE groupId = ?;"
)

CLEAR_GROUP_TEMPLATES = "DELETE FROM GroupTemplates;"
CLEAR_GROUPS = "DELETE FROM Groups;"
