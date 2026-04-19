from fastapi import status
from fastapi.responses import JSONResponse
from fastapi.routing import APIRouter

import server.service.group as GroupService
from log import Logger
from shared.schema.group import (
    AddGroupReq,
    AddGroupTemplateReq,
    GetGroupCountResp,
    GetGroupDetailResp,
    GetGroupsResp,
    GetTemplatesByGroupidResp,
)
from shared.schema.public import AlreadyExistsError, Failed, Success

group_router = APIRouter()
logger = Logger.get_logger()


@group_router.get(
    "/groups",
    responses={200: {"model": GetGroupsResp}, 500: {"model": Failed}},
)
async def get_groups():
    try:
        groups = GroupService.get_groups()

    except Exception as e:
        err_msg = str(e)
        logger.error(err_msg)
        return JSONResponse(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            content={"status": "error", "msg": err_msg},
        )

    return JSONResponse(
        status_code=status.HTTP_200_OK,
        content={"status": "success", "groups": groups},
    )


@group_router.get(
    "/groups/page",
    responses={200: {"model": GetGroupsResp}, 500: {"model": Failed}},
)
async def get_groups_by_page(page: int, pageSize: int):
    """
    依照分頁的方式獲取 群組列表
    """
    try:
        groups = GroupService.get_groups_by_page(page, pageSize)

    except Exception as e:
        err_msg = str(e)
        logger.error(err_msg)
        return JSONResponse(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            content={"status": "error", "msg": err_msg},
        )

    return JSONResponse(
        status_code=status.HTTP_200_OK,
        content={"status": "success", "groups": groups},
    )


@group_router.get(
    "/groups/{template_id}",
    responses={200: {"model": GetGroupsResp}, 500: {"model": Failed}},
)
async def get_groups_by_templateid(template_id: str):
    """
    根據當前 templateId 獲取所有 關聯的群組
    """
    try:
        groups = GroupService.get_groups_by_templateid(template_id)

    except Exception as e:
        err_msg = str(e)
        logger.error(err_msg)
        return JSONResponse(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            content={"status": "error", "msg": err_msg},
        )

    return JSONResponse(
        status_code=status.HTTP_200_OK,
        content={"status": "success", "groups": groups},
    )


@group_router.get(
    "/group/count",
    responses={200: {"model": GetGroupCountResp}, 500: {"model": Failed}},
)
async def get_group_count():
    try:
        count = GroupService.get_group_count()

    except Exception as e:
        err_msg = str(e)
        logger.error(err_msg)
        return JSONResponse(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            content={"status": "error", "msg": err_msg},
        )

    return JSONResponse(
        status_code=status.HTTP_200_OK,
        content={"status": "success", "count": count},
    )


@group_router.post(
    "/group",
    responses={200: {"model": Success}, 500: {"model": Failed}},
)
async def add_group(req: AddGroupReq):
    try:
        gts = req.groupTemplates if req.groupTemplates is not None else []
        GroupService.insert_group(req.group, gts)

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


@group_router.get(
    "/group/{group_id}",
    responses={200: {"model": GetGroupDetailResp}, 500: {"model": Failed}},
)
async def get_group_detail(group_id: str):
    try:
        group = GroupService.get_group_detail(group_id)

    except Exception as e:
        err_msg = str(e)
        logger.error(err_msg)
        return JSONResponse(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            content={"status": "error", "msg": err_msg},
        )

    return JSONResponse(
        status_code=status.HTTP_200_OK,
        content={"status": "success", "group": group},
    )


@group_router.delete(
    "/group/{group_id}",
    responses={200: {"model": Success}, 500: {"model": Failed}},
)
async def delete_group(group_id: str):
    try:
        GroupService.delete_group(group_id)

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


@group_router.post(
    "/group/template",
    responses={200: {"model": Success}, 500: {"model": Failed}},
)
async def add_group_template(req: AddGroupTemplateReq):
    try:
        GroupService.insert_group_template(req.groupTemplate)

    except AlreadyExistsError as e:
        err_msg = str(e)
        logger.error(err_msg)
        return JSONResponse(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            content={"status": "conflict", "msg": err_msg},
        )

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


@group_router.delete(
    "/group/template/{group_id}/{template_id}",
    responses={200: {"model": Success}, 500: {"model": Failed}},
)
async def delete_group_template(template_id: str, group_id: str):
    try:
        GroupService.delete_group_template(template_id, group_id)

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


@group_router.get(
    "/group/templates/{group_id}",
    responses={
        200: {"model": GetTemplatesByGroupidResp},
        500: {"model": Failed},
    },
)
async def get_templates_by_groupid(group_id: str):
    try:
        templates = GroupService.get_templates_by_groupid(group_id)

    except Exception as e:
        err_msg = str(e)
        logger.error(err_msg)
        return JSONResponse(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            content={"status": "error", "msg": err_msg},
        )

    return JSONResponse(
        status_code=status.HTTP_200_OK,
        content={"status": "success", "templates": templates},
    )
