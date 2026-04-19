from fastapi import status
from fastapi.responses import JSONResponse
from fastapi.routing import APIRouter

import server.service.local as LocalService
from log import Logger
from shared.schema.local import (
    GetGlobalConfigResp,
    UpdateGlobalLastRouteReq,
    UpdateGlobalThemeReq,
)
from shared.schema.public import Failed, Success

local_router = APIRouter()
logger = Logger.get_logger()


@local_router.get(
    "/global",
    responses={200: {"model": GetGlobalConfigResp}, 500: {"model": Failed}},
)
async def get_global_config():
    try:
        config = LocalService.get_global_config()

    except Exception as e:
        err_msg = str(e)
        logger.error(err_msg)
        return JSONResponse(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            content={"status": "error", "msg": err_msg},
        )

    return JSONResponse(
        status_code=status.HTTP_200_OK,
        content={"status": "success", "config": config},
    )


@local_router.put(
    "/global/theme",
    responses={200: {"model": Success}, 500: {"model": Failed}},
)
async def update_global_theme(req: UpdateGlobalThemeReq):
    try:
        LocalService.update_theme(req.theme)

    except Exception as e:
        err_msg = str(e)
        logger.error(err_msg)
        return JSONResponse(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            content={"status": "error", "msg": err_msg},
        )

    return JSONResponse(
        status_code=status.HTTP_200_OK,
        content={"status": "success"},
    )


@local_router.put(
    "/global/last-route",
    responses={200: {"model": Success}, 500: {"model": Failed}},
)
async def update_global_last_route(req: UpdateGlobalLastRouteReq):
    try:
        LocalService.update_last_route(req.lastRoute)

    except Exception as e:
        err_msg = str(e)
        logger.error(err_msg)
        return JSONResponse(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            content={"status": "error", "msg": err_msg},
        )

    return JSONResponse(
        status_code=status.HTTP_200_OK,
        content={"status": "success"},
    )
