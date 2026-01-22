<template>
  <n-thing>
    <template #avatar>
      <n-avatar style="height: 48px; width: 48px">
        <n-icon>
          <StatusAvatar />
        </n-icon>
      </n-avatar>
    </template>
    <template #header> {{ props.data?.realname ?? '无名氏' }}</template>
    <template #header-extra>
      <n-text depth="3">{{ `#${recordId}` }} </n-text>
    </template>
    <template #description> {{ props.data?.appointment_time }}</template>
    {{ props.data?.model }}
    <template #action>
      <n-space vertical>
        <n-space>
          <StatusBadge :status="props.data?.status!" />
          <StatusBadge status="default" :text="props.data?.campus" />
        </n-space>
        <n-button style="width: 100%;" @click="showDetail = true">详细信息</n-button>
      </n-space>
    </template>
  </n-thing>

  <n-modal v-model:show="showDetail" preset="dialog" title="预约详细信息">
    <template #header>
      <div>预约详细信息</div>
    </template>
    <RecordDetail :value="props.data" />
  </n-modal>
</template>

<script setup lang="tsx">
import type API from '@/store/api'
import { computed, ref, type PropType } from 'vue'
import StatusBadge from '@/components/StatusBadge.vue'
import { RecordStatus } from '@/utils/constants'

import AccessTimeFilledFilled from '@vicons/material/AccessTimeFilledFilled'
import AccessTimeOutline from '@vicons/material/AccessTimeOutlined'
import CancelFilled from '@vicons/material/CancelFilled'
import FactoryFilled from '@vicons/material/FactoryFilled'
import DoneFilled from '@vicons/material/DoneFilled'
import CalendarMonthFilled from '@vicons/material/CalendarMonthFilled'
import PersonOffFilled from '@vicons/material/PersonOffFilled'
import HandyManFilled from '@vicons/material/HandyManFilled'
import RecordDetail from './RecordDetail.vue'

const props = defineProps({
  data: Object as PropType<API.Record>
})

const recordId = computed(() => {
  return props.data?.url.split("/").slice(-2)[0]
})

const StatusAvatar = () => {
  const status = props.data?.status
  if (
    status === RecordStatus.UNRESOLVE ||
    status === RecordStatus.APPOINTMENT_PENDING ||
    status === RecordStatus.PROCESS_PENDING
  )
    return <AccessTimeOutline />

  if (status === RecordStatus.APPOINTMENT_CONFIRMED) return <AccessTimeFilledFilled />

  if (status === RecordStatus.APPOINTMENT_REJECTED) return <CancelFilled />

  if (status === RecordStatus.GO_TO_OEM) return <FactoryFilled />

  if (status === RecordStatus.RESOLVED) return <DoneFilled />

  if (status === RecordStatus.ANOTHER_DAY) return <CalendarMonthFilled />

  if (status === RecordStatus.WHERE_ARE_YOU) return <PersonOffFilled />

  if (status === RecordStatus.RESOLVING) return <HandyManFilled />
}

const showDetail = ref(false)
</script>
