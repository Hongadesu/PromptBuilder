import { useState } from 'react';
import { Download, FileInput } from 'lucide-react';

import { PywebviewApi } from '@/apis';
import {
  Button,
  RadioGroup,
  RadioGroupItem,
  Label,
  showToast,
} from '@/components/global';
import { ExportAppType } from '@/types';
import { cn } from '@/modules/utils';
import styles from '@/styles/Scrollbar.module.css';

import { ExportTemplateDialog } from '@/features/file-data/ExportTemplateDialog';
import { ResetAppDialog } from '@/features/file-data/ResetAppDialog';

export function Setting() {
  const [exportType, setExportType] = useState<ExportAppType>('all');
  const [exportTemplateDialog, setExportTemplateDialog] = useState(false);
  const [resetAppDialog, setResetAppDialog] = useState(false);

  return (
    <div className='flex w-full flex-1 flex-col gap-6 overflow-y-auto bg-(--bg) p-8 text-(--on-bg) transition-all duration-500 select-none max-lg:mx-auto max-lg:w-11/12'>
      <h1 className='text-xl font-extrabold text-(--on-bg-title)'>設定</h1>
      <div
        className={cn(
          'flex-1 space-y-10 overflow-y-auto pr-4',
          styles.scrollable,
        )}
      >
        {/** 匯入提示詞 */}
        <section className='space-y-4'>
          <SettingSubtitle subtitle={'從本機導入提示詞'} className='pb-1' />
          <div className='py-1'>
            <Button
              variant={'outline'}
              className='flex gap-2 px-3 py-2'
              onClick={() => {
                PywebviewApi.appendAppData()
                  .then((result) => {
                    switch (result.status) {
                      case 'success':
                        showToast({ type: 'success', message: '導入成功' });
                        break;

                      case 'canceled':
                        showToast({ type: 'info', message: '取消導入' });
                        break;

                      case 'failed':
                        showToast({ type: 'error', message: '導入失敗' });
                        break;
                    }
                  })
                  .catch(() => {
                    showToast({ type: 'error', message: '導入失敗' });
                  });
              }}
            >
              <FileInput className='size-5' />
              導入提示詞
            </Button>
          </div>
          <p className='rounded-md border border-(--border)/20 p-3 text-sm'>
            導入提示詞會將本機的提示詞導入到當前資料庫中，導入為「追加導入」，會將導入的提示詞添加到當前資料庫中，不與現有的提示詞產生衝突
          </p>
        </section>
        {/** 匯出提示詞 */}
        <section className='space-y-4'>
          <SettingSubtitle
            subtitle={'從 PromptBuilder 導出提示詞'}
            className='pb-1'
          />
          <RadioGroup
            value={exportType}
            className='flex w-fit gap-2 py-2'
            onValueChange={(value: ExportAppType) => setExportType(value)}
          >
            <RadioGroupItem
              value='template-or-quickfill'
              id='export-template-or-quickfill'
            />
            <Label
              htmlFor='export-template-or-quickfill'
              className={cn(
                exportType === 'template-or-quickfill'
                  ? 'text-(--on-surface)'
                  : 'text-(--on-muted)',
              )}
            >
              Templates/Quickfills
            </Label>
            <RadioGroupItem value='all' id='export-all' />
            <Label
              htmlFor='export-all'
              className={cn(
                exportType === 'all'
                  ? 'text-(--on-surface)'
                  : 'text-(--on-muted)',
              )}
            >
              All
            </Label>
          </RadioGroup>
          <div className='py-1'>
            <Button
              variant={'outline'}
              className='flex gap-2 px-3 py-2'
              onClick={() => {
                // 根據不同的 exportType 類型去顯示 dialog
                switch (exportType) {
                  case 'template-or-quickfill':
                    setExportTemplateDialog(true);
                    break;
                  case 'all':
                    PywebviewApi.exportAppData({ type: 'all', items: null })
                      .then((result) => {
                        switch (result.status) {
                          case 'success':
                            showToast({ type: 'success', message: '導出成功' });
                            break;

                          case 'canceled':
                            showToast({ type: 'info', message: '取消導出' });
                            break;

                          case 'failed':
                            showToast({ type: 'error', message: '導出失敗' });
                            break;
                        }
                      })
                      .catch(() => {
                        showToast({ type: 'error', message: '導出失敗' });
                      });
                    break;
                }
              }}
            >
              <Download className='size-5' />
              導出提示詞
            </Button>
          </div>
          <p className='rounded-md border border-(--border)/20 p-3 text-sm'>
            導出提示詞會將當前資料庫中的所有提示詞 (包含全量導出與模板導出)
            導出為檔案
          </p>
        </section>
        <section className='group space-y-4'>
          <SettingSubtitle subtitle={'刪除所有內容'} className='pb-1' />
          <div className='py-1'>
            <ResetAppDialog
              open={resetAppDialog}
              onOpenChange={setResetAppDialog}
            >
              <Button className='px-3 py-2' variant={'outline'}>
                刪除並重置
              </Button>
            </ResetAppDialog>
          </div>
          <p className='rounded-md border border-(--border)/20 p-3 text-sm transition-colors duration-200 group-hover:border-(--destructive) group-hover:text-(--destructive)'>
            這會移除所有的 "釘選" 、 "群組" 以及 "提示詞" 數據
          </p>
        </section>
      </div>
      <ExportTemplateDialog
        open={exportTemplateDialog}
        setOpen={setExportTemplateDialog}
      />
    </div>
  );
}

type SettingSubtitleProps = {
  subtitle: string;
  className?: string;
};

function SettingSubtitle({ subtitle, className }: SettingSubtitleProps) {
  return (
    <div className={cn('flex w-fit gap-1 select-none', className)}>
      <span>#</span>
      <h4 className='font-semibold'>{subtitle}</h4>
    </div>
  );
}
