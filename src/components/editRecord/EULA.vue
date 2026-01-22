<template>
  <MdPreview :modelValue="eula" class="heti" />
  <n-p>请仔细阅读上列声明 ({{ countDown }} / {{ WAIT_TIME }}s)</n-p>
  <n-space justify="space-between">
    <div></div>
    <n-button @click="() => $emit('next')" :disabled="countDown < WAIT_TIME" type="primary">下一步</n-button>
  </n-space>
</template>

<script setup lang="ts">
import { MdPreview } from 'md-editor-v3';
import { ref, onMounted, watch } from "vue"

//@ts-expect-error
import Heti from "heti/js/heti-addon"
import "heti/umd/heti.min.css"
import store from '@/store';
import { getAnnouncement } from '@/store/announcements';

defineEmits(["next"])

const WAIT_TIME = 10

const countDown = ref(0)

const startCountDown = () => {
  setInterval(() => {
    if (countDown.value >= WAIT_TIME) return
    countDown.value += 1
  }, 1000)
}

const eula = ref('')
const loadingStatus = ref<'loading' | 'success' | 'error'>('loading')

onMounted(async () => {
  if (!store.announcements) {
    if (!await getAnnouncement()) {
      loadingStatus.value = 'error'
      return;
    }
  }

  store.announcements?.forEach((anno) => {
    if (anno.tag === 'TOS') {
      eula.value = anno.content
    }
  })

  const heti = new Heti(".heti")
  heti.autoSpacing()
})

watch(eula, () => {
  startCountDown()
})
</script>