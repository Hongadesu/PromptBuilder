import { create } from 'zustand';

import {
  BaseItem,
  GroupData,
  GroupTemplateData,
  QuickfillItem,
  TemplateItem,
} from '@/types';
import { TemplateApi, GlobalApi, PinApi, GroupApi } from '@/apis';
import { useTemplatePinStore } from './TemplatePinStore';
import { useGroupDetailStore, useGroupListStore } from './group';
import { useTemplateListStore, useTemplateDetailStore } from './prompt';
import { useQuickfillDetailStore, useQuickfillListStore } from './quickfill';
import { useThemeStore } from './ThemeStore';

interface GlobalStoreState {
  lastRoute: string;
  alwaysOnTop: boolean;
}

interface GlobalStoreActions {
  init: () => Promise<void>;
  setAlwaysOnTop: (newAlwaysOnTop: boolean) => void;
  setLastRoute: (lastRoute: string) => void;
  resetAllStores: () => void;

  // 釘選提示詞
  getPinTemplates: () => Promise<void>;
  appendPinTemplateItem: (
    templateItem: TemplateItem,
  ) => Promise<'success' | 'error' | 'conflict'>;
  removePinTemplateItem: (id: string) => Promise<boolean>;

  // 所有提示詞
  getTemplates: (page: number, numPerPage: number) => Promise<void>;
  appendTemplateItem: (item: Omit<BaseItem, 'id'>) => Promise<boolean>;
  removeTemplateItem: (id: string) => Promise<boolean>;
  updateTemplateItem: (
    id: string,
    item: Partial<Omit<BaseItem, 'id'>>,
  ) => Promise<void>;
  setTemplateMaxPage: (pageSize: number) => Promise<void>;
  getTemplateDetail: (id: string) => Promise<void>;

  // 群組
  getGroups: (page: number, numPerPage: number) => Promise<void>;
  setGroupMaxPage: (pageSize: number) => Promise<void>;
  appendGroupItem: (
    group: Omit<GroupData, 'groupId'>,
    groupTemplates: Omit<GroupTemplateData, 'groupId'>[],
  ) => Promise<boolean>;
  removeGroupItem: (id: string) => Promise<boolean>;
  updateGroupItem: (
    id: string,
    item: Partial<Omit<GroupData, 'groupId'>>,
  ) => Promise<void>;
  getGroupDetail: (groupId: string) => Promise<void>;
  appendTemplateIntoGroup: (
    groupTemplate: GroupTemplateData,
  ) => Promise<'success' | 'error' | 'conflict'>;
  removeTemplateIntoGroup: (
    templateId: string,
    groupId: string,
  ) => Promise<boolean>;

  // 速填群組
  getQuickfillItems: (page: number, numPerPage: number) => Promise<void>;
  appendQuickfillItem: (item: Omit<QuickfillItem, 'id'>) => Promise<boolean>;
  removeQuickfillItem: (id: string) => Promise<boolean>;
  updateQuickfillItem: (
    id: string,
    item: Partial<Omit<QuickfillItem, 'id'>>,
  ) => Promise<void>;
  getQuickfillDetail: (id: string) => Promise<void>;
  setQuickfillMaxPage: (pageSize: number) => Promise<void>;
}

type GlobalStoreType = GlobalStoreState & GlobalStoreActions;

const initState: GlobalStoreState = {
  lastRoute: '/home',
  alwaysOnTop: false,
};

export const useGlobalStore = create<GlobalStoreType>((set, get) => ({
  ...initState,

  async init() {
    const resp = await GlobalApi.getDefaultConfig();
    if (resp.status !== 'success') {
      return;
    }

    set({
      lastRoute: resp.config.lastRoute,
      alwaysOnTop: resp.config.alwaysOnTop,
    });

    useThemeStore.getState().setTheme(resp.config.theme);
  },
  setAlwaysOnTop(alwaysOnTop: boolean) {
    set({ alwaysOnTop });
  },
  setLastRoute(lastRoute: string) {
    set({ lastRoute });
  },
  resetAllStores() {
    useTemplatePinStore.getState().reset();
    useGroupListStore.getState().reset();
    useGroupDetailStore.getState().reset();
    useTemplateDetailStore.getState().reset();
    useTemplateListStore.getState().reset();
    useQuickfillDetailStore.getState().reset();
    useQuickfillListStore.getState().reset();
  },

  // Pin Templates
  async getPinTemplates() {
    const resp = await PinApi.getPinTemplates();
    if (resp.status !== 'success') {
      return;
    }
    useTemplatePinStore.getState().setTemplateList(resp.templates);
  },
  async appendPinTemplateItem(templateItem: TemplateItem) {
    const resp = await PinApi.addPinTemplate(
      templateItem.id,
      templateItem.type,
    );

    switch (resp.status) {
      case 'success':
        useTemplatePinStore.getState().appendItem(templateItem);
        return 'success';

      case 'conflict':
        return 'conflict';

      default:
        return 'error';
    }
  },
  async removePinTemplateItem(id: string) {
    const resp = await PinApi.deletePinTemplate(id);
    if (resp.status !== 'success') {
      return false;
    }
    useTemplatePinStore.getState().removeItem(id);
    return true;
  },

  // Template
  async getTemplates(page: number, numPerPage: number) {
    const resp = await TemplateApi.getTemplates({ page, pageSize: numPerPage });
    if (resp.status !== 'success') {
      return;
    }
    useTemplateListStore.getState().setTemplateList(resp.templates);
  },
  async appendTemplateItem(item: Omit<BaseItem, 'id'>) {
    const resp = await TemplateApi.appendTemplate({ item });
    if (resp.status !== 'success') {
      return false;
    }
    return true;
  },
  async removeTemplateItem(id: string) {
    const resp = await TemplateApi.deleteTemplate({ templateId: id });
    if (resp.status !== 'success') {
      return false;
    }
    return true;
  },
  async updateTemplateItem(id: string, item: Partial<Omit<BaseItem, 'id'>>) {
    // 發送請求，更新數據
    // 更新 TemplateList
    // useTemplateListStore.getState().updateItem(id, item);
  },
  async setTemplateMaxPage(pageSize: number) {
    if (pageSize <= 0) {
      throw new Error('pageSize 必須大於 0');
    }
    const resp = await TemplateApi.getTemplateTotal();
    if (resp.status !== 'success') {
      return;
    }
    let maxPage = Math.ceil(resp.total / pageSize);
    if (maxPage === 0) {
      maxPage = 1;
    }
    useTemplateListStore.getState().setMaxPage(maxPage);
  },
  async getTemplateDetail(id: string) {
    const resp = await TemplateApi.getTemplate({ templateId: id });
    if (resp.status !== 'success') {
      return;
    }
    useTemplateDetailStore.getState().setDetail({
      id: resp.template.id,
      title: resp.template.title,
      description: resp.template.description,
      template: resp.template.template,
      param: resp.template.param,
    });
  },

  // Group
  async getGroups(page: number, numPerPage: number) {
    const resp = await GroupApi.getGroups({ page, pageSize: numPerPage });
    if (resp.status !== 'success') {
      return;
    }
    useGroupListStore.getState().setGroupList(resp.groups);
  },
  async setGroupMaxPage(pageSize: number) {
    if (pageSize <= 0) {
      throw new Error('pageSize 必須大於 0');
    }
    const resp = await GroupApi.getGroupTotal();
    if (resp.status !== 'success') {
      return;
    }
    let maxPage = Math.ceil(resp.total / pageSize);
    if (maxPage === 0) {
      maxPage = 1;
    }
    useGroupListStore.getState().setMaxPage(maxPage);
  },
  async appendGroupItem(
    group: Omit<GroupData, 'groupId'>,
    groupTemplates: Omit<GroupTemplateData, 'groupId'>[],
  ) {
    const resp = await GroupApi.addGroup(group, groupTemplates);
    if (resp.status !== 'success') {
      return false;
    }
    return true;
  },
  async removeGroupItem(id: string) {
    const resp = await GroupApi.deleteGroup(id);
    if (resp.status !== 'success') {
      return false;
    }
    return true;
  },
  async updateGroupItem(
    id: string,
    item: Partial<Omit<GroupData, 'groupId'>>,
  ) {},
  async getGroupDetail(groupId: string) {
    const [groupResp, templatesResp] = await Promise.all([
      GroupApi.getGroup(groupId),
      GroupApi.getTemplatesByGroupId(groupId),
    ]);
    if (groupResp.status !== 'success' || templatesResp.status !== 'success') {
      return;
    }
    useGroupDetailStore.getState().setGroupItem(groupResp.group);
    useGroupDetailStore.getState().setTemplateList(templatesResp.templates);
  },
  async appendTemplateIntoGroup(groupTemplate: GroupTemplateData) {
    const resp = await GroupApi.addGroupTemplate(groupTemplate);
    switch (resp.status) {
      case 'success':
        return 'success';

      case 'conflict':
        return 'conflict';

      default:
        return 'error';
    }
  },
  async removeTemplateIntoGroup(templateId: string, groupId: string) {
    const resp = await GroupApi.deleteGroupTemplate(templateId, groupId);
    if (resp.status !== 'success') {
      return false;
    }
    return true;
  },

  // Quickfill template
  async getQuickfillItems(page: number, numPerPage: number) {
    const resp = await TemplateApi.getQuickfillTemplates({
      page,
      pageSize: numPerPage,
    });
    if (resp.status !== 'success') {
      return;
    }
    useQuickfillListStore.getState().setTemplateList(resp.templates);
  },
  async appendQuickfillItem(item: Omit<QuickfillItem, 'id'>) {
    const resp = await TemplateApi.appendQuickfillTemplate({ item });
    if (resp.status !== 'success') {
      return false;
    }
    return true;
  },
  async removeQuickfillItem(id: string) {
    const resp = await TemplateApi.deleteQuickfillTemplate({ templateId: id });
    if (resp.status !== 'success') {
      return false;
    }
    useQuickfillListStore.getState().removeItem(id);
    return true;
  },
  async updateQuickfillItem(
    id: string,
    item: Partial<Omit<QuickfillItem, 'id'>>,
  ) {},
  async setQuickfillMaxPage(pageSize: number) {
    if (pageSize <= 0) {
      throw new Error('pageSize 必須大於 0');
    }
    const resp = await TemplateApi.getQuickfillTemplateTotal();
    if (resp.status !== 'success') {
      return;
    }
    let maxPage = Math.ceil(resp.total / pageSize);
    if (maxPage === 0) {
      maxPage = 1;
    }
    useQuickfillListStore.getState().setMaxPage(maxPage);
  },
  async getQuickfillDetail(id: string) {
    const resp = await TemplateApi.getQuickfillTemplate({ templateId: id });
    if (resp.status !== 'success') {
      return;
    }
    useQuickfillDetailStore.getState().setDetail({
      id: resp.template.id,
      title: resp.template.title,
      description: resp.template.description,
      template: resp.template.template,
      param: resp.template.param,
    });
  },
}));
