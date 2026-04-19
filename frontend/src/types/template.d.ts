export type TemplateKeyValue = { key: string; value: string };

export type TemplateType = 'quickfill' | 'default';

/**
 * DTO
 */
export type BaseItemData = {
  id: string;
  title: string;
  description: string;
  template: string;
  param: Record<string, string>;
};

export type BaseItem = {
  id: string;
  title: string;
  description: string;
  template: string;
  param: Record<string, string>;
};

/**
 * DTO
 */
export type AppendTemplateReq = Omit<BaseItem, 'id'>;

/**
 * DTO
 */
export type QuickfillItemData = {
  id: string;
  title: string;
  description: string;
  template: string;
  param: Record<string, string>;
};

export type QuickfillItem = {
  id: string;
  title: string;
  description: string;
  template: string;
  param: Record<string, string>;
};

/**
 * DTO
 */
export type AppendQuickfillTemplateReq = Omit<QuickfillItem, 'id'>;

export type TemplateItem =
  | ({ type: 'default' } & BaseItem)
  | ({ type: 'quickfill' } & QuickfillItem);

export type TemplateSelectedItem = {
  id: string;
  title: string;
  type: TemplateType;
};

/**
 * DTO
 */
export type PinTemplateItemData =
  | ({ type: 'default' } & BaseItem)
  | ({ type: 'quickfill' } & QuickfillItem);

export type PinTemplateItem =
  | ({ type: 'default' } & BaseItem)
  | ({ type: 'quickfill' } & QuickfillItem);

/**
 * DTO
 */
export type GroupData = {
  groupId: string;
  group: string;
  description: string;
};

/**
 * DTO
 */
export type GroupTemplateData = {
  templateId: string;
  groupId: string;
  type: TemplateType;
};

export type GroupTemplate = {
  templateId: string;
  groupId: string;
  type: TemplateType;
};

/**
 * DTO
 */
export type GroupTemplateItemData =
  | ({ type: 'default' } & BaseItem)
  | ({ type: 'quickfill' } & QuickfillItem);

export type GroupTemplateItem =
  | ({ type: 'default' } & BaseItem)
  | ({ type: 'quickfill' } & QuickfillItem);
