<template>
  <div
    v-if="editor.contextMenu.visible"
    class="context-menu"
    :style="{ left: `${editor.contextMenu.x}px`, top: `${editor.contextMenu.y}px` }"
  >
    <button @click="run(editor.duplicateSelected)">复制</button>
    <button @click="run(() => editor.arrange('top'))">置顶</button>
    <button @click="run(() => editor.arrange('bottom'))">置底</button>
    <button @click="run(toggleLock)">锁定/解锁</button>
    <button @click="run(toggleHidden)">隐藏/显示</button>
    <button class="danger" @click="run(editor.deleteSelected)">删除</button>
  </div>
</template>

<script setup lang="ts">
import { useEditorStore } from '@/stores/editor';

const editor = useEditorStore();

const run = (handler: () => void): void => {
  handler();
  editor.contextMenu.visible = false;
};

const toggleLock = (): void => {
  const id = editor.contextMenu.targetId;
  if (id) {
    editor.toggleLock(id);
  }
};

const toggleHidden = (): void => {
  const id = editor.contextMenu.targetId;
  if (id) {
    editor.toggleHidden(id);
  }
};
</script>
