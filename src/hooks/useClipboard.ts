import { useMessage } from 'naive-ui';
import type { EditorSchema } from '@/types/schema';
import { useEditorStore } from '@/stores/editor';

export const useClipboard = (): { copySchema: () => Promise<void>; importFromText: (value: string) => void } => {
  const editor = useEditorStore();
  const message = useMessage();

  const copySchema = async (): Promise<void> => {
    await navigator.clipboard.writeText(JSON.stringify(editor.exportSchema(), null, 2));
    message.success('Schema 已复制');
  };

  const importFromText = (value: string): void => {
    const parsed = JSON.parse(value) as EditorSchema;
    editor.importSchema(parsed);
    message.success('Schema 导入成功');
  };

  return { copySchema, importFromText };
};
