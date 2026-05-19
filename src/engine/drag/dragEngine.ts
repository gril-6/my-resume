import type { Rect, ViewportState } from '@/types/schema';
import { clamp } from '@/utils/math';

export interface DragEngineOptions {
  startEvent: PointerEvent;
  viewport: ViewportState;
  originRect: Rect;
  boundary: Rect;
  onMove: (rect: Rect) => void;
  onEnd: (rect: Rect) => void;
}

export const startDrag = (options: DragEngineOptions): void => {
  const pointerId = options.startEvent.pointerId;
  const target = options.startEvent.currentTarget;
  if (target instanceof HTMLElement) {
    target.setPointerCapture(pointerId);
  }

  let latest = options.originRect;

  const handleMove = (event: PointerEvent): void => {
    const deltaX = (event.clientX - options.startEvent.clientX) / options.viewport.scale;
    const deltaY = (event.clientY - options.startEvent.clientY) / options.viewport.scale;

    // 坐标修正：所有鼠标位移先反除缩放比例，再参与边界检测，确保缩放画布下移动距离真实一致。
    latest = {
      ...options.originRect,
      x: clamp(options.originRect.x + deltaX, options.boundary.x, options.boundary.width - options.originRect.width),
      y: clamp(options.originRect.y + deltaY, options.boundary.y, options.boundary.height - options.originRect.height),
    };

    options.onMove(latest);
  };

  const handleUp = (): void => {
    window.removeEventListener('pointermove', handleMove);
    window.removeEventListener('pointerup', handleUp);
    options.onEnd(latest);
  };

  window.addEventListener('pointermove', handleMove);
  window.addEventListener('pointerup', handleUp, { once: true });
};
