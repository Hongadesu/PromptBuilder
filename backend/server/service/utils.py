import uuid
from datetime import datetime, timezone


def get_new_id():
    timestamp_str = datetime.now(timezone.utc).strftime("%Y-%m-%d")
    return str(uuid.uuid4())[:8] + timestamp_str
