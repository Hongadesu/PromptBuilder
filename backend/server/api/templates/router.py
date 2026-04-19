from fastapi import status
from fastapi.responses import JSONResponse
from fastapi.routing import APIRouter

import server.service.template as TemplateService
from log import Logger
from shared.schema.public import Failed, Success
from shared.schema.template import (
    AddQuickfillTemplateReq,
    AddQuickfillTemplateResp,
    AddTemplateReq,
    AddTemplateResp,
    BaseTemplateResp,
    BaseTemplatesResp,
    GetTemplateCountResp,
    QuickfillTemplateResp,
    QuickfillTemplatesResp,
)

templates_router = APIRouter()
logger = Logger.get_logger()


@templates_router.get(
    "/template/count",
    responses={200: {"model": GetTemplateCountResp}, 500: {"model": Failed}},
)
async def get_template_count():
    try:
        count = TemplateService.get_template_count()

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


@templates_router.post(
    "/template",
    responses={200: {"model": AddTemplateResp}, 500: {"model": Failed}},
)
async def add_template(req: AddTemplateReq):
    try:
        id = TemplateService.insert_template(req.data)

    except Exception as e:
        err_msg = str(e)
        logger.error(err_msg)
        return JSONResponse(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            content={"status": "error", "msg": err_msg},
        )

    return JSONResponse(
        status_code=status.HTTP_200_OK,
        content={"status": "success", "id": id},
    )


@templates_router.delete(
    "/template/{template_id}",
    responses={200: {"model": Success}, 500: {"model": Failed}},
)
async def delete_template(template_id: str):
    try:
        TemplateService.delete_template(template_id)

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


@templates_router.get(
    "/template/{template_id}",
    responses={200: {"model": BaseTemplateResp}, 500: {"model": Failed}},
)
async def get_template_data(template_id: str):
    try:
        data = TemplateService.get_template_by_id(template_id)

    except Exception as e:
        err_msg = str(e)
        logger.error(err_msg)
        return JSONResponse(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            content={"status": "error", "msg": err_msg},
        )

    return JSONResponse(
        status_code=status.HTTP_200_OK,
        content={"status": "success", "template": data},
    )


@templates_router.get(
    "/templates",
    responses={200: {"model": BaseTemplatesResp}, 500: {"model": Failed}},
)
async def get_templates(page: int, pageSize: int):
    try:
        data = TemplateService.get_templates_by_page(page, pageSize)

    except Exception as e:
        err_msg = str(e)
        logger.error(err_msg)
        return JSONResponse(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            content={"status": "error", "msg": err_msg},
        )

    return JSONResponse(
        status_code=status.HTTP_200_OK,
        content={"status": "success", "templates": data},
    )


# Quickfill templates
@templates_router.get(
    "/quickfill-template/count",
    responses={200: {"model": GetTemplateCountResp}, 500: {"model": Failed}},
)
async def get_quickfill_template_count():
    try:
        count = TemplateService.get_quickfill_template_count()

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


@templates_router.post(
    "/quickfill-template",
    responses={
        200: {"model": AddQuickfillTemplateResp},
        500: {"model": Failed},
    },
)
async def add_quickfill_template(req: AddQuickfillTemplateReq):
    try:
        id = TemplateService.insert_quickfill_template(req.data)

    except Exception as e:
        err_msg = str(e)
        logger.error(err_msg)
        return JSONResponse(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            content={"status": "error", "msg": err_msg},
        )

    return JSONResponse(
        status_code=status.HTTP_200_OK,
        content={"status": "success", "id": id},
    )


@templates_router.delete(
    "/quickfill-template/{template_id}",
    responses={200: {"model": Success}, 500: {"model": Failed}},
)
async def delete_quickfill_template(template_id: str):
    try:
        TemplateService.delete_quickfill_template(template_id)

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


@templates_router.get(
    "/quickfill-template/{template_id}",
    responses={200: {"model": QuickfillTemplateResp}, 500: {"model": Failed}},
)
async def get_quickfill_template_data(template_id: str):
    try:
        data = TemplateService.get_quickfill_template_by_id(template_id)

    except Exception as e:
        err_msg = str(e)
        logger.error(err_msg)
        return JSONResponse(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            content={"status": "error", "msg": err_msg},
        )

    return JSONResponse(
        status_code=status.HTTP_200_OK,
        content={"status": "success", "template": data},
    )


@templates_router.get(
    "/quickfill-templates",
    responses={200: {"model": QuickfillTemplatesResp}, 500: {"model": Failed}},
)
async def get_quickfill_templates(page: int, pageSize: int):
    try:
        data = TemplateService.get_quickfill_templates_by_page(page, pageSize)

    except Exception as e:
        err_msg = str(e)
        logger.error(err_msg)
        return JSONResponse(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            content={"status": "error", "msg": err_msg},
        )

    return JSONResponse(
        status_code=status.HTTP_200_OK,
        content={"status": "success", "templates": data},
    )
