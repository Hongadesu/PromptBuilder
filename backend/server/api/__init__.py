from server.api.group import group_router
from server.api.local import local_router
from server.api.pin import pin_router
from server.api.templates import templates_router

__all__ = ["group_router", "local_router", "pin_router", "templates_router"]
