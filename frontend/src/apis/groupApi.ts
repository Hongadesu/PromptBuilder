import {
  ApiSuccess,
  ApiError,
  GroupData,
  GroupTemplateData,
  GroupTemplateItemData,
} from '@/types';
import { BASE_URL } from './port';

export class GroupApi {
  static async getAllGroups(): Promise<
    (ApiSuccess & { groups: GroupData[] }) | ApiError
  > {
    try {
      const response = await fetch(`${BASE_URL}/groups`, {
        method: 'GET',
      });
      if (!response.ok) {
        throw new Error(`getAllGroups 請求失敗，狀態碼: ${response.status}`);
      }
      const responseData = await response.json();
      if (responseData.status !== 'success') {
        throw new Error(
          `getAllGroups status 失敗， status: ${responseData.status}`,
        );
      }
      return {
        status: 'success',
        groups: responseData.groups,
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

  static async getGroupsByTemplateId(
    templateId: string,
  ): Promise<(ApiSuccess & { groups: GroupData[] }) | ApiError> {
    try {
      const response = await fetch(`${BASE_URL}/groups/${templateId}`, {
        method: 'GET',
      });
      if (!response.ok) {
        throw new Error(
          `getGroupsByTemplateId 請求失敗，狀態碼: ${response.status}`,
        );
      }
      const responseData = await response.json();
      if (responseData.status !== 'success') {
        throw new Error(
          `getGroupsByTemplateId status 失敗， status: ${responseData.status}`,
        );
      }
      return {
        status: 'success',
        groups: responseData.groups,
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

  static async getGroupTotal(): Promise<
    (ApiSuccess & { total: number }) | ApiError
  > {
    try {
      const response = await fetch(`${BASE_URL}/group/count`, {
        method: 'GET',
      });
      if (!response.ok) {
        throw new Error(`getGroupTotal 請求失敗，狀態碼: ${response.status}`);
      }
      const responseData = await response.json();
      if (responseData.status !== 'success') {
        throw new Error(
          `getGroupTotal status 失敗， status: ${responseData.status}`,
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

  static async getGroups({
    page,
    pageSize,
  }: {
    page: number;
    pageSize: number;
  }): Promise<(ApiSuccess & { groups: GroupData[] }) | ApiError> {
    try {
      const response = await fetch(
        `${BASE_URL}/groups/page?page=${page}&pageSize=${pageSize}`,
        {
          method: 'GET',
        },
      );
      if (!response.ok) {
        throw new Error(`getGroups 請求失敗，狀態碼: ${response.status}`);
      }
      const responseData = await response.json();
      if (responseData.status !== 'success') {
        throw new Error(
          `getGroups status 失敗， status: ${responseData.status}`,
        );
      }
      return {
        status: 'success',
        groups: responseData.groups,
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

  static async addGroup(
    group: Omit<GroupData, 'groupId'>,
    groupTemplates: Omit<GroupTemplateData, 'groupId'>[],
  ): Promise<ApiSuccess | ApiError> {
    try {
      const response = await fetch(`${BASE_URL}/group`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ group, groupTemplates }),
      });
      if (!response.ok) {
        throw new Error(`addGroup 請求失敗，狀態碼: ${response.status}`);
      }
      const responseData = await response.json();
      if (responseData.status !== 'success') {
        throw new Error(
          `addGroup status 失敗， status: ${responseData.status}`,
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

  static async deleteGroup(groupId: string): Promise<ApiSuccess | ApiError> {
    try {
      const response = await fetch(`${BASE_URL}/group/${groupId}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error(`deleteGroup 請求失敗，狀態碼: ${response.status}`);
      }
      const responseData = await response.json();
      if (responseData.status !== 'success') {
        throw new Error(
          `deleteGroup status 失敗， status: ${responseData.status}`,
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

  static async getGroup(
    groupId: string,
  ): Promise<(ApiSuccess & { group: GroupData }) | ApiError> {
    try {
      const response = await fetch(`${BASE_URL}/group/${groupId}`, {
        method: 'GET',
      });
      if (!response.ok) {
        throw new Error(`getGroup 請求失敗，狀態碼: ${response.status}`);
      }
      const responseData = await response.json();
      if (responseData.status !== 'success') {
        throw new Error(
          `getGroup status 失敗， status: ${responseData.status}`,
        );
      }
      return {
        status: 'success',
        group: responseData.group,
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

  // GroupTemplates
  static async addGroupTemplate(
    groupTemplate: GroupTemplateData,
  ): Promise<ApiSuccess | ApiError> {
    try {
      const response = await fetch(`${BASE_URL}/group/template`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ groupTemplate }),
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

  static async deleteGroupTemplate(
    templateId: string,
    groupId: string,
  ): Promise<ApiSuccess | ApiError> {
    try {
      const response = await fetch(
        `${BASE_URL}/group/template/${groupId}/${templateId}`,
        {
          method: 'DELETE',
        },
      );
      if (!response.ok) {
        throw new Error(
          `deleteGroupTemplate 請求失敗，狀態碼: ${response.status}`,
        );
      }
      const responseData = await response.json();
      if (responseData.status !== 'success') {
        throw new Error(
          `deleteGroupTemplate status 失敗， status: ${responseData.status}`,
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

  static async getTemplatesByGroupId(
    groupId: string,
  ): Promise<(ApiSuccess & { templates: GroupTemplateItemData[] }) | ApiError> {
    try {
      const response = await fetch(`${BASE_URL}/group/templates/${groupId}`, {
        method: 'GET',
      });
      if (!response.ok) {
        throw new Error(
          `getTemplatesByGroupId 請求失敗，狀態碼: ${response.status}`,
        );
      }
      const responseData = await response.json();
      if (responseData.status !== 'success') {
        throw new Error(
          `getTemplatesByGroupId status 失敗， status: ${responseData.status}`,
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
}
