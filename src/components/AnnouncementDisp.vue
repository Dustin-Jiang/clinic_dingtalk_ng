<template>
  <n-element style="height: 192px; padding: 24px; border-radius: 3px;"
    :style="`background: var(--${getColor(props.data!.tag)}-card)`" @click="openAnnouncement">
    <div>
      <n-button size="small" secondary>
        {{ getTag(props.data!.tag) }}
      </n-button>
    </div>
    <n-h2 style="margin: 12px 0 8px 0"> {{ props.data!.title }} </n-h2>
    <n-text v-if="props.brief"> {{ props.data!.brief }}</n-text>
    <p v-if="props.time"> 发布于: {{ new Date(props.data!.createdTime).toLocaleString('zh-CN') }}</p>
    <p v-if="props.time"> 更新于: {{ new Date(props.data!.lastEditedTime).toLocaleString('zh-CN') }}</p>
  </n-element>
</template>

<script setup lang="ts">
import type API from '@/store/api'
import type { PropType } from 'vue'
import '@/assets/announcement.css'
import { useRouter } from 'vue-router'

const router = useRouter()

const props = defineProps({
  data: Object as PropType<API.IAnnouncement>,
  brief: {
    type: Boolean,
    default: false
  },
  time: {
    type: Boolean,
    default: false
  }
})

const getColor = (type: API.IAnnouncement['tag']) => {
  switch (type) {
    case 'TA':
      return 'primary'
    case 'TOS':
      return 'error'
    default:
      return 'info'
  }
}

const getTag = (type: API.IAnnouncement['tag']) => {
  switch (type) {
    case 'TA':
      return '置顶公告'
    case 'TOS':
      return '免责声明'
    default:
      return '一般通知'
  }
}

const openAnnouncement = () => {
  console.debug("announcement: ", props.data)
  const id = props.data!.url.split('/').slice(-2).shift()
  router.push(`/announcement/${id}`)
}
</script>
