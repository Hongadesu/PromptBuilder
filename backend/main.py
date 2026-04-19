import webview

import server.database as Database
import server.service.local as LocalService
from file_server import init_file_server
from info import BASE_DIR, IS_DEV
from log import Logger
from server import init_server
from system.api import WebviewApi


def test():
    Logger.init_log()
    Database.init_databases()
    ret = init_server()


def main():
    Logger.init_log()
    Database.init_databases()
    config = LocalService.get_global_config()
    server = init_server()
    file_server = None

    if IS_DEV:
        # Main page path (Dev)
        url_path = "http://localhost:5173"
        debug = True
    else:
        # Main page path (Bundled)
        file_server = init_file_server(BASE_DIR / "./pages")
        url_path = file_server.get("url")
        debug = False

    wv_api = WebviewApi()
    window = webview.create_window(
        "PromptBuilder",  # Page title
        url=url_path,
        width=1048,
        height=652,
        min_size=(420, 450),
        resizable=True,
        fullscreen=False,
        hidden=False,
        frameless=False,
        easy_drag=True,
        focus=True,
        minimized=False,
        maximized=False,
        on_top=config.get("alwaysOnTop"),
        confirm_close=False,
        background_color="#FFFFFF",
        transparent=False,
        text_select=True,
        zoomable=False,
        draggable=False,
        js_api=wv_api,
    )
    webview.start(args=window, debug=debug)


if __name__ == "__main__":
    main()
