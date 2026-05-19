<template>
  <div class="schema-node" :class="`schema-node--${node.kind}`" :style="nodeStyle">
    <template v-if="node.kind === 'text'">
      {{ node.props.text }}
    </template>
    <button v-else-if="node.kind === 'button'" class="material-button">{{ node.props.text }}</button>
    <input v-else-if="node.kind === 'input'" class="material-input" :placeholder="String(node.props.placeholder)" />
    <div v-else-if="node.kind === 'radio'" class="option-line">
      <span v-for="item in options" :key="item"><i class="radio-dot" />{{ item }}</span>
    </div>
    <div v-else-if="node.kind === 'checkbox'" class="option-line">
      <span v-for="item in options" :key="item"><i class="check-box" />{{ item }}</span>
    </div>
    <div v-else-if="node.kind === 'select'" class="fake-select">{{ node.props.value }} <span>⌄</span></div>
    <div v-else-if="node.kind === 'switch'" class="fake-switch" :class="{ active: Boolean(node.props.checked) }" />
    <div v-else-if="node.kind === 'date'" class="fake-select">{{ node.props.value }}</div>
    <div v-else-if="node.kind === 'placeholder'" class="placeholder">{{ node.props.text }}</div>
    <div v-else-if="node.kind === 'card'" class="card-shell">
      <strong>{{ node.props.title }}</strong>
      <slot />
    </div>
    <div v-else-if="node.kind === 'columns'" class="columns-shell">
      <div v-for="column in columnCount" :key="column" />
    </div>
    <div v-else-if="node.kind === 'divider'" class="divider"><span>{{ node.props.text }}</span></div>
    <table v-else-if="node.kind === 'table'" class="data-table">
      <tbody>
        <tr v-for="row in tableRows" :key="row">
          <td>客户 {{ row }}</td>
          <td>¥ {{ 3200 + row * 860 }}</td>
          <td><span class="state-pill">运行中</span></td>
        </tr>
      </tbody>
    </table>
    <div v-else-if="node.kind === 'barChart'" class="bar-chart">
      <span v-for="(value, index) in chartValues" :key="index" :style="{ height: `${value}%` }" />
    </div>
    <div v-else-if="node.kind === 'progress'" class="progress-view">
      <span>{{ node.props.value }}%</span>
      <i :style="{ width: `${node.props.value}%` }" />
    </div>
    <div v-else class="metric-card">
      <span>{{ node.props.label }}</span>
      <strong>{{ node.props.value }}</strong>
      <em>{{ node.props.trend }}</em>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { ComponentSchema } from '@/types/schema';

const props = defineProps<{
  node: ComponentSchema;
  preview?: boolean;
}>();

const nodeStyle = computed<Record<string, string>>(() => ({
  width: '100%',
  height: '100%',
  opacity: String(props.node.style.opacity),
  color: props.node.style.color,
  background: props.node.style.background,
  borderColor: props.node.style.borderColor,
  borderRadius: `${props.node.style.radius}px`,
  fontSize: `${props.node.style.fontSize}px`,
  fontWeight: String(props.node.style.fontWeight),
  transform: `rotate(${props.node.style.rotate}deg)`,
  pointerEvents: props.preview ? 'auto' : 'none',
}));

const options = computed(() => {
  const raw = props.node.props.options;
  return Array.isArray(raw) ? raw : [];
});

const columnCount = computed(() => Number(props.node.props.columns) || 2);
const tableRows = computed(() => Number(props.node.props.rows) || 4);
const chartValues = computed(() =>
  String(props.node.props.values ?? '42,68,53,86,61')
    .split(',')
    .map((item) => Number(item.trim()))
    .filter((item) => Number.isFinite(item)),
);
</script>
