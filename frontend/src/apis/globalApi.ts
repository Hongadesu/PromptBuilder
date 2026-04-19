import { ApiSuccess, ApiError, GlobalConfig, AppTheme } from '@/types';
import { BASE_URL } from './port';

export class GlobalApi {
  static async getDefaultConfig(): Promise<
    (ApiSuccess & { config: GlobalConfig }) | ApiError
  > {
    try {
      const resp = await fetch(`${BASE_URL}/global`);

      if (!resp.ok) {
        throw new Error(`getDefaultConfig 請求失敗，狀態碼: ${resp.status}`);
      }

      const responseData = await resp.json();
      if (responseData.status !== 'success') {
        throw new Error(
          `getDefaultConfig status 失敗， status: ${responseData.status}`,
        );
      }

      return {
        status: 'success',
        config: responseData.config,
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

  static async updateTheme(theme: AppTheme): Promise<ApiSuccess | ApiError> {
    try {
      const resp = await fetch(`${BASE_URL}/global/theme`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ theme }),
      });

      if (!resp.ok) {
        throw new Error(`updateTheme 請求失敗，狀態碼: ${resp.status}`);
      }

      const responseData = await resp.json();
      if (responseData.status !== 'success') {
        throw new Error(
          `updateTheme status 失敗， status: ${responseData.status}`,
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

  static async updateLastRoute(
    lastRoute: string,
  ): Promise<ApiSuccess | ApiError> {
    try {
      const resp = await fetch(`${BASE_URL}/global/last-route`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lastRoute }),
      });

      if (!resp.ok) {
        throw new Error(`updateLastRoute 請求失敗，狀態碼: ${resp.status}`);
      }

      const responseData = await resp.json();
      if (responseData.status !== 'success') {
        throw new Error(
          `updateLastRoute status 失敗， status: ${responseData.status}`,
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
