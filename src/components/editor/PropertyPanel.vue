<template>
  <aside class="panel property-panel">
    <div class="panel-title">属性配置</div>
    <div v-if="active" class="property-body">
      <n-tabs type="segment" animated size="small">
        <n-tab-pane name="style" tab="样式">
          <div class="form-grid">
            <label>X<n-input-number :value="active.style.x" size="small" @update:value="setStyle('x', $event)" /></label>
            <label>Y<n-input-number :value="active.style.y" size="small" @update:value="setStyle('y', $event)" /></label>
            <label>宽<n-input-number :value="active.style.width" size="small" @update:value="setStyle('width', $event)" /></label>
            <label>高<n-input-number :value="active.style.height" size="small" @update:value="setStyle('height', $event)" /></label>
            <label>字号<n-input-number :value="active.style.fontSize" size="small" @update:value="setStyle('fontSize', $event)" /></label>
            <label>圆角<n-input-number :value="active.style.radius" size="small" @update:value="setStyle('radius', $event)" /></label>
            <label>背景<n-input :value="active.style.background" size="small" @update:value="setStyle('background', $event)" /></label>
            <label>文字<n-input :value="active.style.color" size="small" @update:value="setStyle('color', $event)" /></label>
          </div>
        </n-tab-pane>
        <n-tab-pane name="props" tab="内容">
          <div class="form-stack">
            <label v-for="entry in propEntries" :key="entry[0]">
              {{ entry[0] }}
              <n-input :value="String(entry[1])" size="small" @update:value="setProp(entry[0], $event)" />
            </label>
          </div>
        </n-tab-pane>
        <n-tab-pane name="event" tab="事件">
          <div class="form-stack">
            <n-select v-model:value="eventTrigger" size="small" :options="triggerOptions" />
            <n-select v-model:value="eventAction" size="small" :options="actionOptions" />
            <n-input v-model:value="eventValue" size="small" placeholder="事件参数" />
            <n-button size="small" type="primary" @click="saveEvent">保存事件</n-button>
          </div>
        </n-tab-pane>
        <n-tab-pane name="data" tab="数据">
          <div class="form-stack">
            <n-select
              :value="active.dataBinding.source"
              size="small"
              :options="sourceOptions"
              @update:value="setDataSource"
            />
            <n-input
              :value="active.dataBinding.field"
              size="small"
              placeholder="静态字段或 mock key"
              @update:value="setDataField"
            />
          </div>
        </n-tab-pane>
      </n-tabs>
    </div>
    <div v-else class="empty-panel">选择画布组件后配置属性</div>
  </aside>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { useEditorStore } from '@/stores/editor';
import type { ComponentEvent, ComponentSchema } from '@/types/schema';

const editor = useEditorStore();
const active = computed(() => editor.activeComponent);
const propEntries = computed(() => (active.value ? Object.entries(active.value.props) : []));
const eventTrigger = ref<ComponentEvent['trigger']>('click');
const eventAction = ref<ComponentEvent['action']>('message');
const eventValue = ref('Hello Lowcode');

const triggerOptions = [
  { label: '点击', value: 'click' },
  { label: '变更', value: 'change' },
  { label: '悬浮', value: 'hover' },
];
const actionOptions = [
  { label: '消息提示', value: 'message' },
  { label: '隐藏切换', value: 'toggleHidden' },
  { label: '链接跳转', value: 'link' },
];
const sourceOptions = [
  { label: '静态数据', value: 'static' },
  { label: 'Mock 数据', value: 'mock' },
];

watch(active, (node) => {
  const first = node?.events[0];
  if (first) {
    eventTrigger.value = first.trigger;
    eventAction.value = first.action;
    eventValue.value = first.value;
  }
});

const setStyle = <K extends keyof ComponentSchema['style']>(key: K, value: ComponentSchema['style'][K] | null): void => {
  if (active.value && value !== null) {
    editor.patchComponentStyle(active.value.id, { [key]: value } as Partial<ComponentSchema['style']>);
  }
};

const setProp = (key: string, value: string): void => {
  if (active.value) {
    editor.patchComponent(active.value.id, { props: { ...active.value.props, [key]: value } });
  }
};

const saveEvent = (): void => {
  if (active.value) {
    editor.patchComponent(active.value.id, {
      events: [{ trigger: eventTrigger.value, action: eventAction.value, value: eventValue.value }],
    });
  }
};

const setDataSource = (source: 'static' | 'mock'): void => {
  if (active.value) {
    editor.patchComponent(active.value.id, { dataBinding: { ...active.value.dataBinding, source } });
  }
};

const setDataField = (field: string): void => {
  if (active.value) {
    editor.patchComponent(active.value.id, { dataBinding: { ...active.value.dataBinding, field } });
  }
};
</script>
