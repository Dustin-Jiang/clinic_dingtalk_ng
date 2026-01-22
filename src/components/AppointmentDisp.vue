<template>
  <n-space vertical>
    <RecordItem :data="props.data" />
    <div v-if="isQrCodeVisible"
      style="justify-content: center; align-items: center; flex-direction: column; display: flex">
      <div style="padding: 8px 0 0 0">
        <n-qr-code :value="recordUrl" :size="120" :error-correction-level="'Q'"
          style="padding: 8px; box-sizing: content-box" />
      </div>
      <n-text style="font-size: 2rem; font-weight: 600">
        {{ recordId }}
      </n-text>
      <n-text>请在到达诊所后向工作人员展示</n-text>
    </div>
    <div v-if="isEditVisible">
      <n-button style="width: 100%;" @click="
        () => {
          router.push('/edit/' + recordId)
        }
      ">编辑预约</n-button>
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
import { productionConfig } from '@/utils/config'
import { useRouter } from 'vue-router'

const router = useRouter()

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

const recordId = computed(() => {
  return props.data?.url.split("/").slice(-2)[0]
})

const recordUrl = computed(() => {
  return productionConfig.frontend.baseUrl + productionConfig.frontend.recordUrl + recordId.value
})

const isRejectReasonVisible = computed(() => {
  return props.data!.status == RecordStatus.APPOINTMENT_REJECTED &&
    !!props.data!.reject_reason
})

const isEditVisible = computed(() => {
  return props.data!.status == RecordStatus.APPOINTMENT_PENDING ||
    props.data!.status == RecordStatus.PROCESS_PENDING ||
    props.data!.status == RecordStatus.APPOINTMENT_CONFIRMED
})
</script>
