from typing import Literal, TypedDict

from pydantic import BaseModel

from shared.schema.public import Success

AppTheme = Literal["light", "dark"]


class GlobalConfig(TypedDict):
    lastRoute: str
    alwaysOnTop: bool
    theme: AppTheme


class GetGlobalConfigResp(Success):
    """DTO"""

    config: GlobalConfig


class UpdateGlobalThemeReq(BaseModel):
    """DTO"""

    theme: AppTheme


class UpdateGlobalLastRouteReq(BaseModel):
    """DTO"""

    lastRoute: str
