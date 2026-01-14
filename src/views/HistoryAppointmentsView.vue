<template>
  <MainView>
    <n-space vertical>
      <n-space>
        <n-button
          circle
          style="width: 48px; height: 48px"
          quaternary
          @click="
            () => {
              router.back()
            }
          "
        >
          <n-icon style="height: 1.4rem; width: 1.4rem">
            <ArrowBackFilled style="font-size: 1.4rem" />
          </n-icon>
        </n-button>
        <n-h1 style="padding: 0 8px">历史预约</n-h1>
      </n-space>
      <n-space vertical v-if="loadingStatus == 'success'">
        <n-card v-for="result in store.records!" v-bind:key="result.id">
          <AppointmentDisp :data="result" />
        </n-card>
      </n-space>

      <n-result
        v-else-if="loadingStatus == 'empty'"
        status="404"
        title="无预约历史"
        description="初次相见, 请多多关照"
      />
    </n-space>
  </MainView>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getRecords } from '@/store/record'
import store from '@/store'
import AppointmentDisp from '@/components/AppointmentDisp.vue'
import MainView from '@/views/MainView.vue'
import ArrowBackFilled from '@vicons/material/ArrowBackFilled'

import { useRouter } from 'vue-router'

const router = useRouter()

const loadingStatus = ref<'loading' | 'success' | 'error' | 'empty'>('loading')

onMounted(async () => {
  // eslint-disable-next-line no-extra-boolean-cast
  if (store.records) {
    if (store.records.length === 0) {
      loadingStatus.value = 'empty'
    } else {
      loadingStatus.value = 'success'
    }
    return
  }
  try {
    if (await getRecords()) {
      if (store.records!.length === 0) {
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
</script>
