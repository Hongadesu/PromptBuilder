import threading
from typing import TypedDict

import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from server.api import group_router, local_router, pin_router, templates_router


def run_api(app: FastAPI):
    uvicorn.run(
        app, host="127.0.0.1", port=11203, reload=False, log_config=None
    )


class InitServerReturn(TypedDict):
    app: FastAPI
    url: str


def init_server() -> InitServerReturn:
    # fastapi
    # 設定 API
    app = FastAPI()
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],  # 允許所有來源
        allow_credentials=True,
        allow_methods=["*"],  # 允許所有請求方法 (GET, POST, PUT, DELETE 等)
        allow_headers=["*"],  # 允許所有請求標頭
    )

    @app.get("/")
    def root():
        return {"message": "Hello from FastAPI!"}

    app.include_router(local_router, tags=["local"])
    app.include_router(templates_router, tags=["templates"])
    app.include_router(pin_router, tags=["pin"])
    app.include_router(group_router, tags=["group"])

    api_thread = threading.Thread(target=run_api, args=(app,), daemon=True)
    api_thread.start()

    return {"app": app, "url": "http://127.0.0.1:11203"}
