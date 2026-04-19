import {
  ApiSuccess,
  ApiError,
  PinTemplateItemData,
  TemplateType,
} from '@/types';
import { BASE_URL } from './port';

export class PinApi {
  static async getPinTemplates(): Promise<
    (ApiSuccess & { templates: PinTemplateItemData[] }) | ApiError
  > {
    try {
      const response = await fetch(`${BASE_URL}/pin`, {
        method: 'GET',
      });
      if (!response.ok) {
        throw new Error(`getPinTemplates 請求失敗，狀態碼: ${response.status}`);
      }
      const responseData = await response.json();
      if (responseData.status !== 'success') {
        throw new Error(
          `getPinTemplates status 失敗， status: ${responseData.status}`,
        );
      }
      return {
        status: 'success',
        templates: responseData.templates,
      };
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : '請求失敗';
      console.error(errorMsg);
      return {
        status: 'error',
        msg: errorMsg,
      };
    }
  }

  static async addPinTemplate(
    templateId: string,
    type: TemplateType,
  ): Promise<ApiSuccess | ApiError> {
    try {
      const response = await fetch(`${BASE_URL}/pin`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          templateId,
          type,
        }),
      });
      const responseData = await response.json();
      if (!response.ok || responseData.status !== 'success') {
        return {
          status: responseData.status ?? 'error',
          msg: responseData.msg ?? '未知錯誤',
        };
      }
      return {
        status: 'success',
      };
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : '請求失敗';
      console.error(errorMsg);
      return {
        status: 'error',
        msg: errorMsg,
      };
    }
  }

  static async deletePinTemplate(
    templateId: string,
  ): Promise<ApiSuccess | ApiError> {
    try {
      const response = await fetch(`${BASE_URL}/pin/${templateId}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error(
          `deletePinTemplate 請求失敗，狀態碼: ${response.status}`,
        );
      }
      const responseData = await response.json();
      if (responseData.status !== 'success') {
        throw new Error(
          `deletePinTemplate status 失敗， status: ${responseData.status}`,
        );
      }
      return {
        status: 'success',
      };
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : '請求失敗';
      console.error(errorMsg);
      return {
        status: 'error',
        msg: errorMsg,
      };
    }
  }
}
