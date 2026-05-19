import type { ComponentSchema, EditorSchema, MaterialMeta } from '@/types/schema';
import { createId } from './id';

const baseStyle = (width: number, height: number, x = 80, y = 80): ComponentSchema['style'] => ({
  x,
  y,
  width,
  height,
  zIndex: 1,
  opacity: 1,
  rotate: 0,
  radius: 8,
  background: 'rgba(27, 38, 59, 0.86)',
  color: '#edf4ff',
  borderColor: 'rgba(126, 164, 220, 0.28)',
  fontSize: 14,
  fontWeight: 500,
});

export const createComponentByMaterial = (material: MaterialMeta, x: number, y: number): ComponentSchema => {
  const id = createId(material.kind);
  const common: ComponentSchema = {
    id,
    name: material.title,
    kind: material.kind,
    category: material.category,
    parentId: null,
    children: [],
    locked: false,
    hidden: false,
    props: {},
    style: baseStyle(material.defaultWidth, material.defaultHeight, x, y),
    events: [],
    dataBinding: { source: 'static', field: '' },
  };

  const propsMap: Record<ComponentSchema['kind'], ComponentSchema['props']> = {
    text: { text: '高级数据看板标题' },
    button: { text: '提交审批', type: 'primary' },
    input: { placeholder: '请输入内容', value: '' },
    radio: { options: ['启用', '停用'], value: '启用' },
    checkbox: { options: ['邮件', '短信'], value: '邮件' },
    select: { options: ['华东', '华南', '海外'], value: '华东' },
    switch: { checked: true },
    date: { value: '2026-05-18' },
    placeholder: { text: 'Drop Zone' },
    card: { title: '业务容器' },
    columns: { columns: 2 },
    divider: { text: '分割线' },
    table: { rows: 4 },
    barChart: { values: '42,68,53,86,61' },
    progress: { value: 72 },
    metric: { label: '转化率', value: '86.4%', trend: '+12.8%' },
  };

  return { ...common, props: propsMap[material.kind] };
};

export const createInitialSchema = (): EditorSchema => ({
  version: '1.0.0',
  canvas: { width: 1440, height: 900, backgroundMode: 'grid' },
  components: [
    createComponentByMaterial({ kind: 'metric', title: '指标卡', category: 'business', icon: 'M', defaultWidth: 220, defaultHeight: 120 }, 80, 80),
    createComponentByMaterial({ kind: 'barChart', title: '柱状图', category: 'data', icon: 'B', defaultWidth: 360, defaultHeight: 220 }, 330, 80),
    createComponentByMaterial({ kind: 'table', title: '数据表格', category: 'data', icon: 'T', defaultWidth: 620, defaultHeight: 260 }, 80, 340),
  ],
});
