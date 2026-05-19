import type { Rect, ViewportState } from '@/types/schema';

export const clamp = (value: number, min: number, max: number): number => Math.min(Math.max(value, min), max);

export const roundBy = (value: number, precision = 1): number => Math.round(value / precision) * precision;

export const rectsIntersect = (first: Rect, second: Rect): boolean =>
  first.x < second.x + second.width &&
  first.x + first.width > second.x &&
  first.y < second.y + second.height &&
  first.y + first.height > second.y;

export const clientToCanvas = (
  clientX: number,
  clientY: number,
  canvasRect: DOMRect,
  viewport: ViewportState,
): { x: number; y: number } => ({
  x: (clientX - canvasRect.left - viewport.translateX) / viewport.scale,
  y: (clientY - canvasRect.top - viewport.translateY) / viewport.scale,
});

export const snapToGrid = (rect: Rect, gridSize: number): Rect => ({
  x: roundBy(rect.x, gridSize),
  y: roundBy(rect.y, gridSize),
  width: roundBy(rect.width, gridSize),
  height: roundBy(rect.height, gridSize),
});
