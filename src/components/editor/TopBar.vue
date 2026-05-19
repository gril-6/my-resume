<template>
  <header class="top-bar">
    <div class="brand">
      <span class="brand-mark">LC</span>
      <div>
        <strong>Lowcode Studio</strong>
        <small>Enterprise Visual Builder</small>
      </div>
    </div>
    <div class="toolbar">
      <n-button size="small" quaternary @click="editor.undo">撤销</n-button>
      <n-button size="small" quaternary @click="editor.redo">重做</n-button>
      <n-button size="small" quaternary @click="editor.duplicateSelected">复制</n-button>
      <n-button size="small" quaternary @click="editor.deleteSelected">删除</n-button>
      <n-divider vertical />
      <n-button size="small" quaternary @click="zoomOut">缩小</n-button>
      <span class="zoom-text">{{ Math.round(editor.canvas.viewport.scale * 100) }}%</span>
      <n-button size="small" quaternary @click="zoomIn">放大</n-button>
      <n-button size="small" quaternary @click="reset">居中</n-button>
      <n-divider vertical />
      <n-button size="small" quaternary @click="toggleBackground">背景</n-button>
      <n-button size="small" quaternary @click="editor.resetTemplate">模板</n-button>
      <n-button size="small" quaternary @click="editor.clearCanvas">清空</n-button>
      <n-button size="small" type="primary" @click="copySchema">导出 JSON</n-button>
      <n-button size="small" type="primary" ghost @click="openPreview">预览</n-button>
    </div>
  </header>
</template>

<script setup lang="ts">
import { useEditorStore } from '@/stores/editor';
import { useClipboard } from '@/hooks/useClipboard';
import { useViewport } from '@/hooks/useViewport';

const editor = useEditorStore();
const { copySchema } = useClipboard();
const { zoomIn, zoomOut, reset } = useViewport();

const toggleBackground = (): void => {
  editor.canvas.backgroundMode = editor.canvas.backgroundMode === 'grid' ? 'dot' : 'grid';
};

const openPreview = (): void => {
  const encoded = encodeURIComponent(JSON.stringify(editor.exportSchema()));
  window.open(`/preview.html?schema=${encoded}`, '_blank', 'noopener,noreferrer');
};
</script>
