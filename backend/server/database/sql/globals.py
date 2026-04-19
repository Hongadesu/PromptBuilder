# Check Tables
CHECK_TABLE_EXIST = """
SELECT name FROM sqlite_master 
WHERE type = 'table' AND name = ?;
"""
