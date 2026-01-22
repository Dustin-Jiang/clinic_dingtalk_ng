<template>
  <n-space vertical>
    <n-element v-if="recordId">
      <span> 预约编号 </span>
      {{ recordId }}
    </n-element>
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
    <n-element v-if="model?.reject_reason">
      <span> 驳回原因 </span>
      {{ model?.reject_reason }}
    </n-element>
  </n-space>
</template>

<script setup lang="ts">
import type API from '@/store/api';
import { parseRecordId } from '@/utils/record';
import { computed } from 'vue';

const model = defineModel<API.Record>("value")

const recordId = computed(() => {
  return parseRecordId(model.value?.url)
})
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