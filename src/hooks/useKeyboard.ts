import { onBeforeUnmount, onMounted } from 'vue';
import { useEditorStore } from '@/stores/editor';

export const useKeyboard = (): void => {
  const editor = useEditorStore();

  const onKeydown = (event: KeyboardEvent): void => {
    const isMeta = event.metaKey || event.ctrlKey;
    const target = event.target;
    if (target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement) {
      return;
    }

    if (isMeta && event.key.toLowerCase() === 'z') {
      event.preventDefault();
      if (event.shiftKey) {
        editor.redo();
      } else {
        editor.undo();
      }
    }

    if (isMeta && event.key.toLowerCase() === 'c') {
      event.preventDefault();
      editor.duplicateSelected();
    }

    if (isMeta && event.key.toLowerCase() === 'a') {
      event.preventDefault();
      editor.setSelection(editor.components.map((item) => item.id));
    }

    if (event.key === 'Delete' || event.key === 'Backspace') {
      event.preventDefault();
      editor.deleteSelected();
    }
  };

  onMounted(() => window.addEventListener('keydown', onKeydown));
  onBeforeUnmount(() => window.removeEventListener('keydown', onKeydown));
};
