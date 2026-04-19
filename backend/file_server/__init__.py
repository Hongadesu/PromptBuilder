import threading
from pathlib import Path
from typing import TypedDict

import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles


def run_api(app: FastAPI):
    uvicorn.run(
        app, host="127.0.0.1", port=11202, reload=False, log_config=None
    )


class InitServerReturn(TypedDict):
    app: FastAPI
    url: str


def init_file_server(frontend_dist: Path) -> InitServerReturn:
    """
    frontend_dist:
        The directory path containing the frontend build files (index.html and assets).

    - Note: The index.html file must be present in this directory for the file server to work correctly.
    """
    app = FastAPI()
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],  # 允許所有來源
        allow_credentials=True,
        allow_methods=["*"],  # 允許所有請求方法 (GET, POST, PUT, DELETE 等)
        allow_headers=["*"],  # 允許所有請求標頭
    )

    print("frontend_dist:", frontend_dist.resolve())

    # serve static assets
    app.mount(
        "/",
        StaticFiles(directory=str(frontend_dist.resolve()), html=True),
        name="frontend",
    )

    api_thread = threading.Thread(target=run_api, args=(app,), daemon=True)
    api_thread.start()

    return {"app": app, "url": "http://127.0.0.1:11202"}
