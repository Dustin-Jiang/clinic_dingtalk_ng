<template>
  <n-space vertical>
    <n-element>
      <span> 姓名 </span>
      {{ model?.realname }}
    </n-element>
    <n-element>
      <span> 电话号码 </span>
      {{ model?.phone_num }}
    </n-element>
    <n-element>
      <span> 预约时间 </span>
      {{ model?.appointment_time }}
    </n-element>
    <n-element>
      <span> 地点 </span>
      {{ model?.campus }}
    </n-element>
    <n-element>
      <span> 电脑型号 </span>
      {{ model?.model }}
    </n-element>
    <n-element>
      <span> 问题描述 </span>
      {{ model?.description }}
    </n-element>
    <n-element v-if="model?.password">
      <span> 开机密码 </span>
      {{ model?.password }}
    </n-element>

    <n-space justify="space-between">
      <n-button @click="() => $emit('prev')">上一步</n-button>
      <n-button @click="handleSubmit" type="primary" :loading="submitStatus === ReqState.PENDING">提交</n-button>
    </n-space>
  </n-space>
</template>

<script setup lang="ts">
import Api, { ReqState } from '@/utils/Api'
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

const emit = defineEmits(["prev", "next"])

const submitStatus = ref<ReqState>(ReqState.IDLE)

const handleSubmit = async () => {
  try {
    submitStatus.value = ReqState.PENDING
    await Api.post('/wechat/', {
      ...model.value
    })
    submitStatus.value = ReqState.SUCCESS
    emit('next')
  }
  catch (e) {
    console.error('提交失败', e)
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