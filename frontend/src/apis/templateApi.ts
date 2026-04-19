import {
  ApiSuccess,
  ApiError,
  TemplateItem,
  BaseItemData,
  QuickfillItemData,
  AppendTemplateReq,
  AppendQuickfillTemplateReq,
} from '@/types';
import { BASE_URL } from './port';

export class TemplateApi {
  // template
  static async getTemplateTotal(): Promise<
    (ApiSuccess & { total: number }) | ApiError
  > {
    try {
      const response = await fetch(`${BASE_URL}/template/count`, {
        method: 'GET',
      });
      if (!response.ok) {
        throw new Error(
          `getTemplateTotal 請求失敗，狀態碼: ${response.status}`,
        );
      }
      const responseData = await response.json();
      if (responseData.status !== 'success') {
        throw new Error(
          `getTemplateTotal status 失敗， status: ${responseData.status}`,
        );
      }
      return {
        status: 'success',
        total: responseData.count,
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

  static async getTemplates({
    page,
    pageSize,
  }: {
    page: number;
    pageSize: number;
  }): Promise<(ApiSuccess & { templates: BaseItemData[] }) | ApiError> {
    try {
      const response = await fetch(
        `${BASE_URL}/templates?page=${page}&pageSize=${pageSize}`,
        {
          method: 'GET',
        },
      );

      if (!response.ok) {
        throw new Error(`getTemplate 請求失敗，狀態碼: ${response.status}`);
      }

      const responseData = await response.json();
      if (responseData.status !== 'success') {
        throw new Error(
          `getTemplate status 失敗， status: ${responseData.status}`,
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

  static async getTemplate({
    templateId,
  }: {
    templateId: string;
  }): Promise<(ApiSuccess & { template: BaseItemData }) | ApiError> {
    try {
      const response = await fetch(`${BASE_URL}/template/${templateId}`, {
        method: 'GET',
      });

      if (!response.ok) {
        throw new Error(`getTemplate 請求失敗，狀態碼: ${response.status}`);
      }

      const responseData = await response.json();
      if (responseData.status !== 'success') {
        throw new Error(
          `getTemplate status 失敗， status: ${responseData.status}`,
        );
      }

      return {
        status: 'success',
        template: responseData.template,
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

  static async appendTemplate({
    item,
  }: {
    item: AppendTemplateReq;
  }): Promise<(ApiSuccess & { id: string }) | ApiError> {
    try {
      const response = await fetch(`${BASE_URL}/template`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ data: item }),
      });

      if (!response.ok) {
        throw new Error(`appendTemplate 請求失敗，狀態碼: ${response.status}`);
      }

      const responseData = await response.json();
      if (responseData.status !== 'success') {
        throw new Error(
          `appendTemplate status 失敗， status: ${responseData.status}`,
        );
      }

      return {
        status: 'success',
        id: responseData.id,
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

  /**
   * TODO
   */
  static async updateTemplate({
    templateId,
    item,
  }: {
    templateId: string;
    item: Partial<TemplateItem>;
  }): Promise<(ApiSuccess & {}) | ApiError> {
    try {
      const response = await fetch(`${BASE_URL}/template/${templateId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(item),
      });

      if (!response.ok) {
        throw new Error(`updateTemplate 請求失敗，狀態碼: ${response.status}`);
      }

      const responseData = await response.json();
      if (responseData.status !== 'success') {
        throw new Error(
          `updateTemplate status 失敗， status: ${responseData.status}`,
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

  static async deleteTemplate({
    templateId,
  }: {
    templateId: string;
  }): Promise<ApiSuccess | ApiError> {
    try {
      const response = await fetch(`${BASE_URL}/template/${templateId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error(`deleteTemplate 請求失敗，狀態碼: ${response.status}`);
      }

      const responseData = await response.json();
      if (responseData.status !== 'success') {
        throw new Error(
          `deleteTemplate status 失敗， status: ${responseData.status}`,
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

  // quickfill template
  static async getQuickfillTemplateTotal(): Promise<
    (ApiSuccess & { total: number }) | ApiError
  > {
    try {
      const response = await fetch(`${BASE_URL}/quickfill-template/count`, {
        method: 'GET',
      });
      if (!response.ok) {
        throw new Error(
          `getQuickfillTemplateTotal 請求失敗，狀態碼: ${response.status}`,
        );
      }
      const responseData = await response.json();
      if (responseData.status !== 'success') {
        throw new Error(
          `getQuickfillTemplateTotal status 失敗， status: ${responseData.status}`,
        );
      }
      return {
        status: 'success',
        total: responseData.count,
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

  static async getQuickfillTemplates({
    page,
    pageSize,
  }: {
    page: number;
    pageSize: number;
  }): Promise<(ApiSuccess & { templates: QuickfillItemData[] }) | ApiError> {
    try {
      const response = await fetch(
        `${BASE_URL}/quickfill-templates?page=${page}&pageSize=${pageSize}`,
        {
          method: 'GET',
        },
      );

      if (!response.ok) {
        throw new Error(
          `getQuickfillTemplates 請求失敗，狀態碼: ${response.status}`,
        );
      }

      const responseData = await response.json();
      if (responseData.status !== 'success') {
        throw new Error(
          `getQuickfillTemplates status 失敗， status: ${responseData.status}`,
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

  static async getQuickfillTemplate({
    templateId,
  }: {
    templateId: string;
  }): Promise<(ApiSuccess & { template: QuickfillItemData }) | ApiError> {
    try {
      const response = await fetch(
        `${BASE_URL}/quickfill-template/${templateId}`,
        {
          method: 'GET',
        },
      );

      if (!response.ok) {
        throw new Error(
          `getQuickfillTemplate 請求失敗，狀態碼: ${response.status}`,
        );
      }

      const responseData = await response.json();
      if (responseData.status !== 'success') {
        throw new Error(
          `getQuickfillTemplate status 失敗， status: ${responseData.status}`,
        );
      }

      return {
        status: 'success',
        template: responseData.template,
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

  static async appendQuickfillTemplate({
    item,
  }: {
    item: AppendQuickfillTemplateReq;
  }): Promise<(ApiSuccess & { id: string }) | ApiError> {
    try {
      const response = await fetch(`${BASE_URL}/quickfill-template`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ data: item }),
      });

      if (!response.ok) {
        throw new Error(`appendTemplate 請求失敗，狀態碼: ${response.status}`);
      }

      const responseData = await response.json();
      if (responseData.status !== 'success') {
        throw new Error(
          `appendTemplate status 失敗， status: ${responseData.status}`,
        );
      }

      return {
        status: 'success',
        id: responseData.id,
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

  static async deleteQuickfillTemplate({
    templateId,
  }: {
    templateId: string;
  }): Promise<ApiSuccess | ApiError> {
    try {
      const response = await fetch(
        `${BASE_URL}/quickfill-template/${templateId}`,
        {
          method: 'DELETE',
        },
      );

      if (!response.ok) {
        throw new Error(
          `deleteQuickfillTemplate 請求失敗，狀態碼: ${response.status}`,
        );
      }

      const responseData = await response.json();
      if (responseData.status !== 'success') {
        throw new Error(
          `deleteQuickfillTemplate status 失敗， status: ${responseData.status}`,
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
