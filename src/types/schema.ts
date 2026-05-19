export type ComponentCategory = 'basic' | 'layout' | 'data' | 'business';

export type ComponentKind =
  | 'text'
  | 'button'
  | 'input'
  | 'radio'
  | 'checkbox'
  | 'select'
  | 'switch'
  | 'date'
  | 'placeholder'
  | 'card'
  | 'columns'
  | 'divider'
  | 'table'
  | 'barChart'
  | 'progress'
  | 'metric';

export interface Rect {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface ComponentStyle extends Rect {
  zIndex: number;
  opacity: number;
  rotate: number;
  radius: number;
  background: string;
  color: string;
  borderColor: string;
  fontSize: number;
  fontWeight: number;
}

export interface ComponentEvent {
  trigger: 'click' | 'change' | 'hover';
  action: 'message' | 'toggleHidden' | 'link';
  value: string;
}

export interface DataBinding {
  source: 'static' | 'mock';
  field: string;
}

export interface ComponentSchema {
  id: string;
  name: string;
  kind: ComponentKind;
  category: ComponentCategory;
  parentId: string | null;
  children: string[];
  locked: boolean;
  hidden: boolean;
  props: Record<string, string | number | boolean | string[]>;
  style: ComponentStyle;
  events: ComponentEvent[];
  dataBinding: DataBinding;
}

export interface MaterialMeta {
  kind: ComponentKind;
  title: string;
  category: ComponentCategory;
  icon: string;
  defaultWidth: number;
  defaultHeight: number;
}

export interface EditorSchema {
  version: string;
  canvas: {
    width: number;
    height: number;
    backgroundMode: 'grid' | 'dot';
  };
  components: ComponentSchema[];
}

export interface GuideLine {
  type: 'horizontal' | 'vertical';
  position: number;
}

export interface ViewportState {
  scale: number;
  translateX: number;
  translateY: number;
}
