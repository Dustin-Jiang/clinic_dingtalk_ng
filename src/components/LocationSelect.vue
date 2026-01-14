<template>
  <n-space vertical>
    <n-form>
      <n-form-item label="选择时间" required>
        <n-space style="flex-wrap: nowrap;">
          <n-button circle quaternary :disabled="prevDisabled" @click="() => setDateOffset(-1)">
            <template #icon>
              <n-icon>
                <ArrowBackFilled />
              </n-icon>
            </template>
          </n-button>
          <n-date-picker v-model:value="date" type="date" format="yyyy-MM-dd cccc" :first-day-of-week="6"
            :is-date-disabled="isDateDisabled" input-readonly />
          <n-button circle quaternary :disabled="nextDisabled" @click="() => setDateOffset(1)">
            <template #icon>
              <n-icon>
                <ArrowForwardFilled />
              </n-icon>
            </template>
          </n-button>
        </n-space>
      </n-form-item>

      <n-form-item label="选择地点" required>
        <n-list hoverable clickable style="width: 100%" bordered v-if="locations && locations?.length > 0">
          <n-list-item v-for="(location, idx) in locations" v-bind:key="idx" @click="() => {
            if (choice === idx) choice = -1
            else choice = idx
          }">
            <n-thing :title="location?.campus">
              <template #description>
                <n-space>
                  <n-tag size="small" type="success" :bordered="false"> {{ location?.title }} </n-tag>
                  <n-tag size="small" :bordered="false"> {{ location?.startTime }} - {{ location?.endTime }} </n-tag>
                </n-space>
              </template>
              <p>地址: {{ address.get(location!.campus) }}</p>
              <p>容量: {{ `${location?.count} / ${location?.capacity}` }}</p>
            </n-thing>
            <template #suffix>
              <n-collapse-transition :show="idx === choice">
                <n-icon style="height: 1.6rem; width: 1.6rem; ">
                  <CheckCircleFilled style="font-size: 1.6rem; color: var(--primary-color); " />
                </n-icon>
              </n-collapse-transition>
            </template>
          </n-list-item>
        </n-list>
        <n-empty v-else style="width: 100%;">暂无可用地点</n-empty>
      </n-form-item>
    </n-form>

    <n-space justify="space-between">
      <n-button @click="() => $emit('prev')">上一步</n-button>
      <n-button @click="() => $emit('next')" :disabled="!validate" type="primary">下一步</n-button>
    </n-space>
  </n-space>
</template>

<script setup lang="ts">
import { ref } from "vue"
import ArrowForwardFilled from "@vicons/material/ArrowForwardFilled"
import ArrowBackFilled from "@vicons/material/ArrowBackFilled"
import { computed } from "vue";
import store from "@/store";
import CheckCircleFilled from "@vicons/material/CheckCircleFilled";
import { watch } from "vue";
import { watchEffect } from "vue";

defineEmits(["prev", "next"])
const date = ref<number | null>((new Date()).getTime())

const isDateDisabled = (date: number) => {
  const now = new Date()
  const isPast = date < (new Date(now.toDateString())).getTime()
  const moreThan2Weeks = date > new Date(now.setDate(now.getDate() + 14)).getTime()
  return isPast || moreThan2Weeks
}

const prevDisabled = computed(() => {
  const now = new Date(date.value ?? '')
  return isDateDisabled(new Date(now.setDate(now.getDate() - 1)).getTime())
})

const nextDisabled = computed(() => {
  const now = new Date(date.value ?? '')
  return isDateDisabled(new Date(now.setDate(now.getDate() + 1)).getTime())
})

const setDateOffset = (offset: number) => {
  const now = new Date(date.value ?? '')
  date.value = new Date(now.setDate(now.getDate() + offset)).getTime()
}

const locations = computed(() => {
  return store.dateStatus?.map((location) => {
    const now = new Date(date.value ?? '')
    const dateString = `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')
      }-${now.getDate().toString().padStart(2, '0')}`
    if (location.date === dateString) {
      return location
    }
  }).filter((location) => location)
})

const choice = ref(-1)

const campus = computed(() => {
  if (choice.value === -1) return ''
  return locations.value![choice.value]!.campus
})

watch(date, (d, old) => {
  if (old !== d) {
    choice.value = -1
  }
  return d
})

const address = new Map<string, string>()
store.campuses?.forEach((campus) => {
  address.set(campus.name, campus.address)
})

console.debug("address: ", address)

const validate = computed(() => choice.value !== -1)

const model = defineModel<{ date: string, location: string }>("value")

watchEffect(() => {
  const dateSelected = new Date(date.value ?? '')
  model.value!.date = `${dateSelected.getFullYear()}-${(dateSelected.getMonth() + 1).toString().padStart(2, '0')}-${dateSelected.getDate().toString().padStart(2, '0')}`
  model.value!.location = campus.value
})
</script>