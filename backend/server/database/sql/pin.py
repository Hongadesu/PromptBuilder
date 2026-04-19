# Pin Table
CREATE_PIN_TABLE = """
CREATE TABLE Pin (
    templateId TEXT PRIMARY KEY,
    type TEXT NOT NULL 
      CHECK (type IN (
        'default', 'quickfill'
      ))
);
"""

GET_ALL_PIN = "SELECT * FROM Pin;"
INSERT_PIN_TEMPLATE = "INSERT INTO Pin (templateId, type) VALUES (?, ?);"
DELETE_PIN_TEMPLATE = "DELETE FROM Pin WHERE templateId = ?;"

CLEAR_PIN = "DELETE FROM Pin;"
