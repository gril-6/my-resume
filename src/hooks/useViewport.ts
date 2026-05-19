import { useEditorStore } from '@/stores/editor';
import { clamp } from '@/utils/math';

export const useViewport = (): {
  zoomIn: () => void;
  zoomOut: () => void;
  reset: () => void;
  pan: (deltaX: number, deltaY: number) => void;
} => {
  const editor = useEditorStore();

  const zoomTo = (scale: number): void => {
    editor.canvas.viewport.scale = clamp(scale, 0.3, 1.8);
  };

  return {
    zoomIn: () => zoomTo(editor.canvas.viewport.scale + 0.1),
    zoomOut: () => zoomTo(editor.canvas.viewport.scale - 0.1),
    reset: () => {
      editor.canvas.viewport.scale = 0.82;
      editor.canvas.viewport.translateX = 72;
      editor.canvas.viewport.translateY = 44;
    },
    pan: (deltaX: number, deltaY: number) => {
      editor.canvas.viewport.translateX += deltaX;
      editor.canvas.viewport.translateY += deltaY;
    },
  };
};
