<template>
  <n-space vertical>
    <RecordItem :data="props.data" />
    <div v-if="isQrCodeVisible"
      style="justify-content: center; align-items: center; flex-direction: column; display: flex">
      <div style="padding: 8px 0 0 0">
        <n-qr-code :value="props.data!.url" :size="120" :error-correction-level="'Q'"
          style="padding: 8px; box-sizing: content-box" />
      </div>
      <n-text style="font-size: 2rem; font-weight: 600">
        {{ props.data!.id }}
      </n-text>
      <n-text>请在到达诊所后向工作人员展示</n-text>
    </div>
    <div v-if="isRejectReasonVisible">
      <div>
        <n-text strong>拒绝原因</n-text>
      </div>
      <n-text>{{ props.data!.reject_reason }}</n-text>
    </div>
  </n-space>
</template>

<script setup lang="ts">
import type API from '@/store/api'
import type { PropType } from 'vue'
import { computed } from 'vue'
import { RecordStatus } from '@/utils/constants'

const props = defineProps({
  data: Object as PropType<API.Record>
})

const isQrCodeVisible = computed(() => {
  return (
    props.data!.status == RecordStatus.APPOINTMENT_CONFIRMED ||
    props.data!.status == RecordStatus.PROCESS_PENDING ||
    props.data!.status == RecordStatus.RESOLVING
  )
})

const isRejectReasonVisible = computed(() => {
  return props.data!.status == RecordStatus.APPOINTMENT_REJECTED &&
    !!props.data!.reject_reason
})
</script>
