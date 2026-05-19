<template>
  <n-config-provider :theme="darkTheme" :theme-overrides="themeOverrides">
    <n-message-provider>
      <EditorShell />
    </n-message-provider>
  </n-config-provider>
</template>

<script setup lang="ts">
import { darkTheme, type GlobalThemeOverrides } from 'naive-ui';
import EditorShell from '@/views/EditorShell.vue';

const themeOverrides: GlobalThemeOverrides = {
  common: {
    primaryColor: '#6ea8ff',
    primaryColorHover: '#8bbaff',
    primaryColorPressed: '#4f8deb',
    borderRadius: '8px',
    bodyColor: '#080c14',
    cardColor: 'rgba(16, 23, 37, 0.78)',
    modalColor: '#101725',
    popoverColor: '#101725',
    textColorBase: '#e8eefc',
    textColor2: '#9cacc7',
    borderColor: 'rgba(140, 166, 210, 0.16)',
  },
};
</script>
