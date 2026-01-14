<template>
  <n-config-provider :theme="theme" :locale="zhCN" :date-locale="dateZhCN">
    <n-global-style />
    <n-message-provider>
      <n-element style="height: 100vh; width: 100vw; overflow: hidden">
        <RouterView />
      </n-element>
    </n-message-provider>
  </n-config-provider>
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router'
import { darkTheme, lightTheme } from 'naive-ui'
import { ref, watch } from 'vue'
import { useOsTheme as useDark } from 'naive-ui'
import { onMounted } from 'vue'
import { load } from '@/store'
import { zhCN, dateZhCN } from 'naive-ui'

import '@/assets/base.css'

const isDark = useDark()
const theme = ref<typeof darkTheme | typeof lightTheme>(
  isDark.value === 'dark' ? darkTheme : lightTheme
)

watch(isDark, (val) => {
  console.debug(val)
  console.debug(theme)
  theme.value = isDark.value === 'dark' ? darkTheme : lightTheme
})

onMounted(() => {
  load()
})
</script>
