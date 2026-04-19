import { AppendAppDataResp, ExpoprAppDataResp, ExportAppData } from '@/types';

declare global {
  interface Window {
    pywebview: {
      api: {
        resizeMinWindow: (width: number, height: number) => Promise<boolean>;
        setAlwaysOnTop: (onTop: boolean) => Promise<boolean>;
        readClipboardText: () => Promise<string>;
        writeClipboardText: (text: string) => Promise<void>;
        appendAppData: () => Promise<AppendAppDataResp>;
        exportAppData: (data: ExportAppData) => Promise<ExpoprAppDataResp>;
        clearAppData: () => Promise<void>;
        openProjectLink: () => Promise<void>;
      };
    };
  }
}

export class PywebviewApi {
  static async setAlwaysOnTop(onTop: boolean): Promise<boolean> {
    try {
      await window.pywebview.api.setAlwaysOnTop(onTop);
    } catch (error) {
      return false;
    }
    return true;
  }

  static async resizeMinWindow(
    width: number,
    height: number,
  ): Promise<boolean> {
    try {
      await window.pywebview.api.resizeMinWindow(width, height);
    } catch (error) {
      return false;
    }
    return true;
  }

  static async pasteText(): Promise<string> {
    const text = await window.pywebview.api.readClipboardText();
    return text;
  }

  static async copyText(text: string) {
    await window.pywebview.api.writeClipboardText(text);
  }

  static async appendAppData() {
    return await window.pywebview.api.appendAppData();
  }

  static async exportAppData(data: ExportAppData) {
    return await window.pywebview.api.exportAppData(data);
  }

  static async clearAppData() {
    await window.pywebview.api.clearAppData();
  }

  static async openProjectLink() {
    await window.pywebview.api.openProjectLink();
  }
}
