import type { ComponentSchema, GuideLine, MaterialMeta, Rect, ViewportState } from './schema';

export interface DragPayload {
  material: MaterialMeta;
  clientX: number;
  clientY: number;
}

export interface MoveContext {
  originRect: Rect;
  startX: number;
  startY: number;
  componentId: string;
}

export interface ResizeContext extends MoveContext {
  direction: ResizeDirection;
}

export type ResizeDirection = 'n' | 's' | 'e' | 'w' | 'ne' | 'nw' | 'se' | 'sw';

export interface HistorySnapshot {
  components: ComponentSchema[];
  selectedIds: string[];
  timestamp: number;
}

export interface CanvasState {
  width: number;
  height: number;
  backgroundMode: 'grid' | 'dot';
  viewport: ViewportState;
  guideLines: GuideLine[];
}

export interface ContextMenuState {
  visible: boolean;
  x: number;
  y: number;
  targetId: string | null;
}
