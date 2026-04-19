from typing import Literal, TypedDict


class Success(TypedDict):
    status: Literal["success"]


class Failed(TypedDict):
    status: Literal[
        "failed", "invalid", "error", "not_found", "unauthorized", "conflict"
    ]
    msg: str


class AlreadyExistsError(Exception):
    pass
