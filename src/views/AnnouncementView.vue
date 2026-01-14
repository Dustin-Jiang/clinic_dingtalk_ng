<template>
  <MainView>
    <n-flex justify="center">
      <n-space vertical>
        <n-space>
          <n-button circle style="width: 48px; height: 48px" quaternary @click="() => {
            router.back()
          }
            ">
            <n-icon style="height: 1.4rem; width: 1.4rem">
              <ArrowBackFilled style="font-size: 1.4rem" />
            </n-icon>
          </n-button>
          <n-h1 style="padding: 0 8px">公告内容</n-h1>
        </n-space>

        <div v-if="loadingStatus == 'success'">
          <AnnouncementDisp :data="announcement" time />
          <n-flex justify="center">
            <MdPreview :modelValue="announcement?.content" class="heti" />
          </n-flex>
        </div>
      </n-space>
    </n-flex>
  </MainView>
</template>

<script setup lang="ts">
import store from '@/store';
import { getAnnouncement } from '@/store/announcements';
import type API from '@/store/api';
import MainView from '@/views/MainView.vue'
import ArrowBackFilled from '@vicons/material/ArrowBackFilled'
import { ref } from 'vue';
import { onMounted } from 'vue';
import { useRouter } from 'vue-router'
import { MdPreview } from 'md-editor-v3'
import AnnouncementDisp from '@/components/AnnouncementDisp.vue';

//@ts-expect-error
import Heti from "heti/js/heti-addon"
import "heti/umd/heti.min.css"

const router = useRouter()

const props = defineProps({
  id: String
})

const loadingStatus = ref<'loading' | 'success' | 'error' | 'empty'>('loading')

const announcement = ref<API.IAnnouncement>()

onMounted(async () => {
  if (!store.announcements) {
    if (!await getAnnouncement()) {
      loadingStatus.value = 'error'
      return
    }
  }

  store.announcements?.forEach((anno) => {
    if (anno.url.split('/').slice(-2).shift() === props.id!.toString()) {
      announcement.value = anno
    }
  })

  if (announcement.value) {
    loadingStatus.value = 'success'
  } else {
    loadingStatus.value = 'empty'
  }

  const heti = new Heti(".heti")
  heti.autoSpacing()
})
</script>

<style>
strong {
  font-weight: 700;
}
</style>