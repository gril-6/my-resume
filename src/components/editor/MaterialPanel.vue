<template>
  <aside class="panel material-panel">
    <div class="panel-title">组件物料</div>
    <section v-for="group in materialGroups" :key="group.title" class="material-group">
      <h3>{{ group.title }}</h3>
      <div class="material-grid">
        <button
          v-for="item in group.items"
          :key="item.kind"
          class="material-item"
          draggable="true"
          @dragstart="onDragStart($event, item)"
        >
          <span>{{ item.icon }}</span>
          <em>{{ item.title }}</em>
        </button>
      </div>
    </section>
  </aside>
</template>

<script setup lang="ts">
import { materialGroups } from '@/engine/render/componentRegistry';
import type { MaterialMeta } from '@/types/schema';

const onDragStart = (event: DragEvent, material: MaterialMeta): void => {
  event.dataTransfer?.setData('application/lowcode-material', JSON.stringify(material));
  if (event.dataTransfer) {
    event.dataTransfer.effectAllowed = 'copy';
  }
};
</script>
