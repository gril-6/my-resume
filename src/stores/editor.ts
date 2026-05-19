import { computed, ref } from 'vue';
import { defineStore } from 'pinia';
import type { CanvasState, ContextMenuState } from '@/types/editor';
import type { ComponentSchema, EditorSchema, Rect } from '@/types/schema';
import { HistoryStack } from '@/engine/history/historyStack';
import { calculateSnap } from '@/engine/align/snap';
import { deepClone } from '@/utils/clone';
import { createComponentByMaterial, createInitialSchema } from '@/utils/schema';
import { createId } from '@/utils/id';

const history = new HistoryStack(30);

export const useEditorStore = defineStore('editor', () => {
  const initial = createInitialSchema();
  const canvas = ref<CanvasState>({
    width: initial.canvas.width,
    height: initial.canvas.height,
    backgroundMode: initial.canvas.backgroundMode,
    viewport: { scale: 0.82, translateX: 72, translateY: 44 },
    guideLines: [],
  });
  const components = ref<ComponentSchema[]>(initial.components);
  const selectedIds = ref<string[]>([]);
  const contextMenu = ref<ContextMenuState>({ visible: false, x: 0, y: 0, targetId: null });

  const selectedComponents = computed(() => components.value.filter((item) => selectedIds.value.includes(item.id)));
  const activeComponent = computed(() => selectedComponents.value.at(-1) ?? null);
  const visibleComponents = computed(() => components.value.filter((item) => !item.hidden));

  const record = (): void => {
    history.push({
      components: components.value,
      selectedIds: selectedIds.value,
      timestamp: Date.now(),
    });
  };

  const hydrate = (snapshot: { components: ComponentSchema[]; selectedIds: string[] }): void => {
    components.value = deepClone(snapshot.components);
    selectedIds.value = deepClone(snapshot.selectedIds);
    canvas.value.guideLines = [];
  };

  const initHistory = (): void => {
    history.clear();
    record();
  };

  const setSelection = (ids: string[], append = false): void => {
    selectedIds.value = append ? Array.from(new Set([...selectedIds.value, ...ids])) : ids;
  };

  const addComponent = (material: Parameters<typeof createComponentByMaterial>[0], x: number, y: number): void => {
    const maxZIndex = Math.max(0, ...components.value.map((item) => item.style.zIndex));
    const node = createComponentByMaterial(material, x, y);
    node.style.zIndex = maxZIndex + 1;
    components.value = [...components.value, node];
    selectedIds.value = [node.id];
    record();
  };

  const patchComponent = (id: string, patch: Partial<ComponentSchema>, shouldRecord = true): void => {
    components.value = components.value.map((item) => (item.id === id ? { ...item, ...patch } : item));
    if (shouldRecord) {
      record();
    }
  };

  const patchComponentStyle = (id: string, style: Partial<ComponentSchema['style']>, shouldRecord = true): void => {
    components.value = components.value.map((item) =>
      item.id === id ? { ...item, style: { ...item.style, ...style } } : item,
    );
    if (shouldRecord) {
      record();
    }
  };

  const moveComponent = (id: string, rect: Rect, withSnap: boolean): void => {
    const current = components.value.find((item) => item.id === id);
    if (!current || current.locked) {
      return;
    }

    const siblings = components.value.filter((item) => item.id !== id && !item.hidden);
    const result = withSnap ? calculateSnap(rect, siblings) : { rect, guideLines: [] };
    canvas.value.guideLines = result.guideLines;
    patchComponentStyle(id, result.rect, false);
  };

  const finishOperation = (): void => {
    canvas.value.guideLines = [];
    record();
  };

  const deleteSelected = (): void => {
    const ids = new Set(selectedIds.value);
    components.value = components.value.filter((item) => !ids.has(item.id));
    selectedIds.value = [];
    record();
  };

  const duplicateSelected = (): void => {
    const selected = selectedComponents.value;
    const maxZIndex = Math.max(0, ...components.value.map((item) => item.style.zIndex));
    const clones = selected.map((item, index) => ({
      ...deepClone(item),
      id: createId(item.kind),
      name: `${item.name} 副本`,
      parentId: null,
      children: [],
      style: {
        ...item.style,
        x: item.style.x + 24,
        y: item.style.y + 24,
        zIndex: maxZIndex + index + 1,
      },
    }));
    components.value = [...components.value, ...clones];
    selectedIds.value = clones.map((item) => item.id);
    record();
  };

  const arrange = (type: 'top' | 'bottom'): void => {
    const id = activeComponent.value?.id;
    if (!id) {
      return;
    }
    const zIndexes = components.value.map((item) => item.style.zIndex);
    const target = type === 'top' ? Math.max(...zIndexes) + 1 : Math.min(...zIndexes) - 1;
    patchComponentStyle(id, { zIndex: target });
  };

  const toggleLock = (id: string): void => {
    const target = components.value.find((item) => item.id === id);
    if (target) {
      patchComponent(id, { locked: !target.locked });
    }
  };

  const toggleHidden = (id: string): void => {
    const target = components.value.find((item) => item.id === id);
    if (target) {
      patchComponent(id, { hidden: !target.hidden });
    }
  };

  const undo = (): void => {
    const snapshot = history.undo();
    if (snapshot) {
      hydrate(snapshot);
    }
  };

  const redo = (): void => {
    const snapshot = history.redo();
    if (snapshot) {
      hydrate(snapshot);
    }
  };

  const exportSchema = (): EditorSchema => ({
    version: '1.0.0',
    canvas: {
      width: canvas.value.width,
      height: canvas.value.height,
      backgroundMode: canvas.value.backgroundMode,
    },
    components: deepClone(components.value),
  });

  const importSchema = (schema: EditorSchema): void => {
    canvas.value.width = schema.canvas.width;
    canvas.value.height = schema.canvas.height;
    canvas.value.backgroundMode = schema.canvas.backgroundMode;
    components.value = schema.components;
    selectedIds.value = [];
    record();
  };

  const clearCanvas = (): void => {
    components.value = [];
    selectedIds.value = [];
    record();
  };

  const resetTemplate = (): void => {
    const next = createInitialSchema();
    components.value = next.components;
    canvas.value.backgroundMode = next.canvas.backgroundMode;
    selectedIds.value = [];
    record();
  };

  return {
    canvas,
    components,
    selectedIds,
    selectedComponents,
    activeComponent,
    visibleComponents,
    contextMenu,
    initHistory,
    setSelection,
    addComponent,
    patchComponent,
    patchComponentStyle,
    moveComponent,
    finishOperation,
    deleteSelected,
    duplicateSelected,
    arrange,
    toggleLock,
    toggleHidden,
    undo,
    redo,
    exportSchema,
    importSchema,
    clearCanvas,
    resetTemplate,
  };
});
