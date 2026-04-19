import type { TemplateSelectedItem, GroupSelectedItem } from './template';

// App File Import and Export data
export type ExportAppType = 'template-or-quickfill' | 'all';
export type ExportAppTemplatesData = {
  type: 'template-or-quickfill';
  items: TemplateSelectedItem[];
};
export type ExportAppAllData = {
  type: 'all';
  items: null;
};
export type ExportAppData = ExportAppTemplatesData | ExportAppAllData;

export type AppendAppDataRespSuccess = {
  status: 'success';
  template: { id: string; title: string }[];
  quickfill: { id: string; title: string }[];
};

export type AppendAppDataRespFailed = {
  status: 'failed';
  msg: string;
};

export type AppendAppDataRespCancel = {
  status: 'canceled';
};

export type AppendAppDataResp =
  | AppendAppDataRespSuccess
  | AppendAppDataRespFailed
  | AppendAppDataRespCancel;

export type ExpoprAppDataRespSuccess = {
  status: 'success';
};

export type ExpoprAppDataRespFailed = {
  status: 'failed';
  msg: string;
};

export type ExpoprAppDataRespCancel = {
  status: 'canceled';
};

export type ExpoprAppDataResp =
  | ExpoprAppDataRespSuccess
  | ExpoprAppDataRespCancel
  | ExpoprAppDataRespFailed;
