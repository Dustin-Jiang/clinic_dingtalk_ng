<template>
  <n-list-item v-bind:key="idx" @click="() => {
    if (disabled) return;
    if (choice === location?.campus) choice = undefined
    else choice = location?.campus
  }">
    <n-thing :title="location?.campus"
      :style="{ opacity: disabled ? 0.5 : 1, cursor: disabled ? 'not-allowed' : 'pointer' }">
      <template #description>
        <n-space>
          <n-tag style="user-select: none;" size="small" type="success" :bordered="false">
            {{ location?.title }}
          </n-tag>
          <n-tag style="user-select: none;" size="small" :bordered="false">
            {{ location?.startTime }} - {{ location?.endTime }}
          </n-tag>
        </n-space>
      </template>
      <p>地址: {{ address.get(location!.campus) }}</p>
      <p>容量: {{ `${location?.count} / ${location?.capacity}` }}</p>
    </n-thing>
    <template #suffix>
      <n-collapse-transition :show="location?.campus === choice">
        <n-icon style="height: 1.6rem; width: 1.6rem; ">
          <CheckCircleFilled style="font-size: 1.6rem; color: var(--primary-color); " />
        </n-icon>
      </n-collapse-transition>
    </template>
  </n-list-item>
</template>

<script setup lang="ts">
import store from '@/store';
import type API from '@/store/api';
import { watch } from 'vue';
import CheckCircleFilled from "@vicons/material/CheckCircleFilled";

const props = defineProps<{
  location: API.DateStatus,
  idx: number,
  disabled?: boolean
}>()

const choice = defineModel<string | undefined>("value")

watch(choice, (newVal) => {
  console.debug("LocationItem choice changed: ", newVal)
})

const address = new Map<string, string>()
store.campuses?.forEach((campus) => {
  address.set(campus.name, campus.address)
})

console.debug("address: ", address)
</script>