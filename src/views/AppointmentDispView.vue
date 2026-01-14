<template>
  <n-space vertical>
    <n-card v-if="loadingStatus == 'success' && isAppointmentActive">
      <AppointmentDisp :data="store.records![0]" />
    </n-card>

    <n-skeleton v-else-if="loadingStatus == 'loading'" />

    <n-result
      v-else
      status="404"
      title="无活跃预约"
      description="目前如此, 但谁又能预知未来"
      style="margin: 16px 0"
    />

    <n-button
      style="width: 100%"
      @click="
        () => {
          router.push('/history')
        }
      "
      >查看历史预约</n-button
    >
    <n-button
      style="width: 100%"
      type="primary"
      @click="
        () => {
          router.push('/new')
        }
      "
      >创建新预约</n-button
    >
  </n-space>
</template>

<script setup lang="ts">
import AppointmentDisp from '@/components/AppointmentDisp.vue'

import { onMounted } from 'vue'
import { getRecords } from '@/store/record'
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import store from '@/store'

const loadingStatus = ref<'loading' | 'success' | 'error' | 'empty'>('loading')
const router = useRouter()

onMounted(async () => {
  try {
    await getRecords()
    if (store.records) {
      if (store.records.length === 0) {
        loadingStatus.value = 'empty'
      } else {
        loadingStatus.value = 'success'
      }
    } else {
      loadingStatus.value = 'error'
    }
  } catch (e) {
    console.error(e)
    loadingStatus.value = 'error'
  }
})

/**
 * 展示未来和三天前的预约
 */
const isAppointmentActive = computed(() => {
  const now = new Date()
  const appointmentTime = new Date(store.records![0].appointment_time)
  return now.getTime() - appointmentTime.getTime() < 3 * 24 * 60 * 60 * 1000
})
</script>
