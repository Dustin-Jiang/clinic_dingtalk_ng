<template>
  <n-space vertical>
    <RecordDetail v-model:value="model" />

    <n-space justify="space-between">
      <n-button @click="() => $emit('prev')">上一步</n-button>
      <n-button @click="handleSubmit" type="primary" :loading="submitStatus === ReqState.PENDING">提交</n-button>
    </n-space>
  </n-space>
</template>

<script setup lang="ts">
import Api, { ReqState } from '@/utils/Api'
import type { AxiosResponse } from 'axios'
import { useMessage } from 'naive-ui'
import { ref } from 'vue'

const model = defineModel<{
  realname: string
  phone_num: string
  campus: string
  description: string
  model: string
  password: string
  appointment_time: string
}>("value")

const props = defineProps<{
  onSubmit: () => Promise<AxiosResponse<any, any>>
}>();

const emit = defineEmits(["prev", "next", "submit"])
const message = useMessage()

const submitStatus = ref<ReqState>(ReqState.IDLE)

const handleSubmit = async () => {
  try {
    submitStatus.value = ReqState.PENDING
    await props.onSubmit()
    submitStatus.value = ReqState.SUCCESS
    message.success('提交成功')
    emit('next')
  }
  catch (e) {
    console.error('提交失败', e)
    // @ts-ignore
    message.error(`提交失败，${e?.response?.data?.msg ?? e.message ?? e}`)
    submitStatus.value = ReqState.ERROR
  }
}
</script>

<style scoped>
div {
  margin: 10px 0;
  font-size: 1rem;
}

span {
  display: block;
  font-size: 0.8rem;
}
</style>