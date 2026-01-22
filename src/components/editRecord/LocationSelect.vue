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
          <LocationItem v-for="(location, idx) in locations" :key="idx" :location="location!" :idx="idx"
            v-model:value="choice" :disabled="location?.count == location?.capacity" />
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
import { onMounted, ref } from "vue"
import ArrowForwardFilled from "@vicons/material/ArrowForwardFilled"
import ArrowBackFilled from "@vicons/material/ArrowBackFilled"
import { computed } from "vue";
import store, { loadDateStatus } from "@/store";
import { watch } from "vue";
import { watchEffect } from "vue";
import LocationItem from "./LocationItem.vue";

const model = defineModel<{ date: string, location: string }>("value")

defineEmits(["prev", "next"])
const date = ref<number>((model.value?.date ? new Date(model.value.date).getTime() : (new Date()).getTime()))

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

onMounted(async () => {
  await loadDateStatus()
})

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

const choice = ref<string | undefined>(model.value?.location ?? undefined)

const campus = computed(() => {
  if (choice.value === undefined) return ''
  return choice.value
})

watch(date, (d, old) => {
  if (old !== d) {
    choice.value = undefined
  }
  return d
})

const validate = computed(() => choice.value !== undefined)

watchEffect(() => {
  const dateSelected = new Date(date.value ?? '')
  model.value!.date = `${dateSelected.getFullYear()}-${(dateSelected.getMonth() + 1).toString().padStart(2, '0')}-${dateSelected.getDate().toString().padStart(2, '0')}`
  model.value!.location = campus.value
})
</script>