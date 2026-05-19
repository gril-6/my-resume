<template>
  <div class="editor-shell">
    <TopBar />
    <div class="editor-layout">
      <div class="left-stack">
        <MaterialPanel />
        <LayerTree />
      </div>
      <CanvasBoard />
      <PropertyPanel />
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import TopBar from '@/components/editor/TopBar.vue';
import MaterialPanel from '@/components/editor/MaterialPanel.vue';
import LayerTree from '@/components/editor/LayerTree.vue';
import CanvasBoard from '@/components/editor/CanvasBoard.vue';
import PropertyPanel from '@/components/editor/PropertyPanel.vue';
import { useEditorStore } from '@/stores/editor';
import { useKeyboard } from '@/hooks/useKeyboard';

const editor = useEditorStore();
useKeyboard();

onMounted(() => {
  editor.initHistory();
});
</script>
