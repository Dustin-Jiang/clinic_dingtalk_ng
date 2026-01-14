<template>
  <MainView>
    <n-space vertical>
      <n-h1 style="padding: 0 8px">预约电脑诊所</n-h1>

      <n-carousel autoplay show-arrow v-if="loadingStatus == 'success'" style=" border-radius: 3px;">
        <n-carousel-item v-for="announcement in store.announcements" v-bind:key="announcement.url">
          <AnnouncementDisp :data="announcement" brief />
        </n-carousel-item>
      </n-carousel>

      <AppointmentDispView />
    </n-space>
  </MainView>
</template>

<script setup lang="ts">
import MainView from '@/views/MainView.vue'
import AppointmentDispView from '@/views/AppointmentDispView.vue'
import { onMounted, ref } from 'vue'
import { getAnnouncement } from '@/store/announcements'
import AnnouncementDisp from '@/components/AnnouncementDisp.vue'
import store from '@/store'

const loadingStatus = ref<'loading' | 'success' | 'error' | 'empty'>('loading')

onMounted(async () => {
  if (await getAnnouncement()) {
    loadingStatus.value = 'success'
  } else {
    loadingStatus.value = 'error'
  }
})
</script>
