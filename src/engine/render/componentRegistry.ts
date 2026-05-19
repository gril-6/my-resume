import type { MaterialMeta } from '@/types/schema';

export const materialGroups: Array<{ title: string; category: MaterialMeta['category']; items: MaterialMeta[] }> = [
  {
    title: '基础组件',
    category: 'basic',
    items: [
      { kind: 'text', title: '文本', category: 'basic', icon: 'Tx', defaultWidth: 180, defaultHeight: 48 },
      { kind: 'button', title: '按钮', category: 'basic', icon: 'Bt', defaultWidth: 132, defaultHeight: 44 },
      { kind: 'input', title: '输入框', category: 'basic', icon: 'In', defaultWidth: 220, defaultHeight: 44 },
      { kind: 'radio', title: '单选', category: 'basic', icon: 'Ra', defaultWidth: 180, defaultHeight: 48 },
      { kind: 'checkbox', title: '多选', category: 'basic', icon: 'Cb', defaultWidth: 200, defaultHeight: 48 },
      { kind: 'select', title: '下拉', category: 'basic', icon: 'Se', defaultWidth: 180, defaultHeight: 44 },
      { kind: 'switch', title: '开关', category: 'basic', icon: 'Sw', defaultWidth: 120, defaultHeight: 44 },
      { kind: 'date', title: '日期', category: 'basic', icon: 'Da', defaultWidth: 180, defaultHeight: 44 },
    ],
  },
  {
    title: '布局组件',
    category: 'layout',
    items: [
      { kind: 'placeholder', title: '空白占位', category: 'layout', icon: 'Ph', defaultWidth: 220, defaultHeight: 120 },
      { kind: 'card', title: '卡片容器', category: 'layout', icon: 'Ca', defaultWidth: 320, defaultHeight: 220 },
      { kind: 'columns', title: '分栏布局', category: 'layout', icon: 'Co', defaultWidth: 420, defaultHeight: 180 },
      { kind: 'divider', title: '分割线', category: 'layout', icon: 'Dv', defaultWidth: 360, defaultHeight: 32 },
    ],
  },
  {
    title: '数据组件',
    category: 'data',
    items: [
      { kind: 'table', title: '表格', category: 'data', icon: 'Tb', defaultWidth: 520, defaultHeight: 240 },
      { kind: 'barChart', title: '柱状图', category: 'data', icon: 'Bc', defaultWidth: 360, defaultHeight: 220 },
      { kind: 'progress', title: '进度条', category: 'data', icon: 'Pr', defaultWidth: 260, defaultHeight: 64 },
      { kind: 'metric', title: '指标卡', category: 'business', icon: 'Me', defaultWidth: 220, defaultHeight: 120 },
    ],
  },
];
