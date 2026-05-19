<template>
  <main
    ref="stageRef"
    class="canvas-stage"
    @dragover.prevent
    @drop="onDrop"
    @pointerdown="onStagePointerDown"
  >
    <div
      class="canvas-viewport"
      :style="{
        transform: `translate(${editor.canvas.viewport.translateX}px, ${editor.canvas.viewport.translateY}px) scale(${editor.canvas.viewport.scale})`,
      }"
    >
      <div
        ref="canvasRef"
        class="canvas-board"
        :class="`canvas-board--${editor.canvas.backgroundMode}`"
        :style="{ width: `${editor.canvas.width}px`, height: `${editor.canvas.height}px` }"
      >
        <div
          v-for="node in editor.visibleComponents"
          :key="node.id"
          class="canvas-node"
          :class="{ selected: editor.selectedIds.includes(node.id), locked: node.locked }"
          :style="nodeFrame(node)"
          @pointerdown.stop="onNodePointerDown($event, node)"
          @contextmenu.prevent.stop="openNodeMenu($event, node.id)"
        >
          <SchemaRenderer :node="node" />
          <span v-if="editor.selectedIds.includes(node.id)" class="resize-handle" @pointerdown.stop="onResize($event, node)" />
        </div>
        <span
          v-for="(line, index) in editor.canvas.guideLines"
          :key="`${line.type}-${index}`"
          class="guide-line"
          :class="`guide-line--${line.type}`"
          :style="line.type === 'vertical' ? { left: `${line.position}px` } : { top: `${line.position}px` }"
        />
        <div v-if="selecting" class="select-box" :style="selectionStyle" />
      </div>
    </div>
    <ContextMenu />
  </main>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import SchemaRenderer from '@/components/materials/SchemaRenderer.vue';
import ContextMenu from './ContextMenu.vue';
import { startDrag } from '@/engine/drag/dragEngine';
import { useEditorStore } from '@/stores/editor';
import type { ComponentSchema, MaterialMeta, Rect } from '@/types/schema';
import { clientToCanvas, rectsIntersect } from '@/utils/math';

const editor = useEditorStore();
const stageRef = ref<HTMLElement | null>(null);
const canvasRef = ref<HTMLElement | null>(null);
const selectionRect = ref<Rect>({ x: 0, y: 0, width: 0, height: 0 });
const selecting = ref(false);

const selectionStyle = computed(() => ({
  left: `${selectionRect.value.x}px`,
  top: `${selectionRect.value.y}px`,
  width: `${selectionRect.value.width}px`,
  height: `${selectionRect.value.height}px`,
}));

const nodeFrame = (node: ComponentSchema): Record<string, string> => ({
  left: `${node.style.x}px`,
  top: `${node.style.y}px`,
  width: `${node.style.width}px`,
  height: `${node.style.height}px`,
  zIndex: String(node.style.zIndex),
});

const getCanvasPoint = (event: Pick<PointerEvent | DragEvent, 'clientX' | 'clientY'>): { x: number; y: number } => {
  const rect = stageRef.value?.getBoundingClientRect();
  if (!rect) {
    return { x: 0, y: 0 };
  }
  return clientToCanvas(event.clientX, event.clientY, rect, editor.canvas.viewport);
};

const onDrop = (event: DragEvent): void => {
  const raw = event.dataTransfer?.getData('application/lowcode-material');
  if (!raw) {
    return;
  }
  const material = JSON.parse(raw) as MaterialMeta;
  const point = getCanvasPoint(event);
  editor.addComponent(material, Math.max(0, point.x - material.defaultWidth / 2), Math.max(0, point.y - 20));
};

const onNodePointerDown = (event: PointerEvent, node: ComponentSchema): void => {
  editor.setSelection([node.id], event.shiftKey);
  if (node.locked) {
    return;
  }

  startDrag({
    startEvent: event,
    viewport: editor.canvas.viewport,
    originRect: node.style,
    boundary: { x: 0, y: 0, width: editor.canvas.width, height: editor.canvas.height },
    onMove: (rect) => editor.moveComponent(node.id, rect, true),
    onEnd: () => editor.finishOperation(),
  });
};

const onResize = (event: PointerEvent, node: ComponentSchema): void => {
  const startX = event.clientX;
  const startY = event.clientY;
  const origin = { ...node.style };

  const handleMove = (moveEvent: PointerEvent): void => {
    const deltaX = (moveEvent.clientX - startX) / editor.canvas.viewport.scale;
    const deltaY = (moveEvent.clientY - startY) / editor.canvas.viewport.scale;
    editor.patchComponentStyle(
      node.id,
      {
        width: Math.max(60, origin.width + deltaX),
        height: Math.max(36, origin.height + deltaY),
      },
      false,
    );
  };

  const handleUp = (): void => {
    window.removeEventListener('pointermove', handleMove);
    window.removeEventListener('pointerup', handleUp);
    editor.finishOperation();
  };

  window.addEventListener('pointermove', handleMove);
  window.addEventListener('pointerup', handleUp, { once: true });
};

const onStagePointerDown = (event: PointerEvent): void => {
  editor.contextMenu.visible = false;
  const start = getCanvasPoint(event);
  selecting.value = true;
  selectionRect.value = { x: start.x, y: start.y, width: 0, height: 0 };

  const handleMove = (moveEvent: PointerEvent): void => {
    const current = getCanvasPoint(moveEvent);
    selectionRect.value = {
      x: Math.min(start.x, current.x),
      y: Math.min(start.y, current.y),
      width: Math.abs(current.x - start.x),
      height: Math.abs(current.y - start.y),
    };
    const ids = editor.visibleComponents
      .filter((node) => rectsIntersect(selectionRect.value, node.style))
      .map((node) => node.id);
    editor.setSelection(ids);
  };

  const handleUp = (): void => {
    selecting.value = false;
    window.removeEventListener('pointermove', handleMove);
    window.removeEventListener('pointerup', handleUp);
  };

  window.addEventListener('pointermove', handleMove);
  window.addEventListener('pointerup', handleUp, { once: true });
};

const openNodeMenu = (event: MouseEvent, id: string): void => {
  editor.setSelection([id]);
  editor.contextMenu = { visible: true, x: event.clientX, y: event.clientY, targetId: id };
};
</script>
