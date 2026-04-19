from fastapi import status
from fastapi.responses import JSONResponse
from fastapi.routing import APIRouter

import server.service.pin as PinService
from log import Logger
from shared.schema.pin import AddPinTemplateReq, GetAllPinTemplatesResp
from shared.schema.public import AlreadyExistsError, Failed, Success

pin_router = APIRouter()
logger = Logger.get_logger()


# pin templates
@pin_router.get(
    "/pin",
    responses={200: {"model": GetAllPinTemplatesResp}, 500: {"model": Failed}},
)
async def get_pin_templates():
    try:
        templates = PinService.get_all_pin_templates()

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


@pin_router.post(
    "/pin",
    responses={200: {"model": Success}, 500: {"model": Failed}},
)
async def add_pin_template(req: AddPinTemplateReq):
    try:
        PinService.insert_pin_template(req.templateId, req.type)

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


@pin_router.delete(
    "/pin/{template_id}",
    responses={200: {"model": Success}, 500: {"model": Failed}},
)
async def delete_pin_template(template_id: str):
    try:
        PinService.delete_pin_template(template_id)

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
