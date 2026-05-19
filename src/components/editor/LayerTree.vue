<template>
  <aside class="panel layer-panel">
    <div class="panel-title">图层结构</div>
    <div class="layer-list">
      <div
        v-for="node in orderedComponents"
        :key="node.id"
        class="layer-item"
        :class="{ active: editor.selectedIds.includes(node.id), muted: node.hidden }"
        draggable="true"
        @click="editor.setSelection([node.id])"
        @dragstart="draggingId = node.id"
        @dragover.prevent
        @drop="sortLayer(node.id)"
      >
        <span class="layer-dot" />
        <strong>{{ node.name }}</strong>
        <button @click.stop="editor.toggleHidden(node.id)">{{ node.hidden ? '显' : '隐' }}</button>
        <button @click.stop="editor.toggleLock(node.id)">{{ node.locked ? '解' : '锁' }}</button>
      </div>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useEditorStore } from '@/stores/editor';

const editor = useEditorStore();
const draggingId = ref<string | null>(null);

const orderedComponents = computed(() => [...editor.components].sort((a, b) => b.style.zIndex - a.style.zIndex));

const sortLayer = (targetId: string): void => {
  if (!draggingId.value || draggingId.value === targetId) {
    return;
  }
  const target = editor.components.find((item) => item.id === targetId);
  if (target) {
    editor.patchComponentStyle(draggingId.value, { zIndex: target.style.zIndex + 1 });
  }
  draggingId.value = null;
};
</script>
