import pyperclip
import webview
from webview import Window

import server.service.data_reset as DataResetService
import server.service.local as LocalService
import system.service.file as AppFileService
import system.service.link as AppLinkService
from shared.schema.file import ExportAppData


class WebviewApi:
    def setAlwaysOnTop(self, on_top: bool):
        window: Window = webview.active_window()
        LocalService.update_always_on_top(on_top)
        window.on_top = on_top

    def resizeMinWindow(self, w: int, h: int):
        window: Window = webview.active_window()
        resizeW = max(window.width, w)
        resizeH = max(window.height, h)
        window.resize(resizeW, resizeH)

    def readClipboardText(self):
        return pyperclip.paste()

    def writeClipboardText(self, text: str):
        pyperclip.copy(text)

    def appendAppData(self):
        return AppFileService.append_app_data()

    def exportAppData(self, data: ExportAppData):
        return AppFileService.export_app_data(data)

    def clearAppData(self):
        DataResetService.clear_app_data()

    def openProjectLink(self):
        AppLinkService.open_project_link()
