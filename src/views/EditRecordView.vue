<template>
  <MainView>
    <n-space>
      <n-button circle style="width: 48px; height: 48px" quaternary @click="() => {
        router.back()
      }">
        <n-icon style="height: 1.4rem; width: 1.4rem">
          <ArrowBackFilled style="font-size: 1.4rem" />
        </n-icon>
      </n-button>
      <n-h1 style="padding: 0 8px">编辑预约</n-h1>
    </n-space>

    <div style="overflow: auto; padding: 8px; " v-if="loadingStatus === ReqState.SUCCESS">
      <n-steps :current="step" vertical>
        <n-step title="描述问题">
          <n-collapse-transition :show="step === 1">
            <ProblemDescribe v-model:value="probDescs" @next="() => step++" />
          </n-collapse-transition>
        </n-step>
        <n-step title="选择时间地点">
          <n-collapse-transition :show="step === 2">
            <LocationSelect v-model:value="locationSelect" @prev="() => step--" @next="() => step++" />
          </n-collapse-transition>
        </n-step>
        <n-step title="填写信息">
          <n-collapse-transition :show="step === 3">
            <PersonalInfo v-model:value="personalInfo" @prev="() => step--" @next="() => step++" />
          </n-collapse-transition>
        </n-step>
        <n-step title="确认">
          <n-collapse-transition :show="step === 4">
            <RecordDisp v-model:value="result" @prev="() => step--" @next="router.back()" @submit="handleSubmit" />
          </n-collapse-transition>
        </n-step>
      </n-steps>
    </div>

  </MainView>
</template>

<script setup lang="ts">
import MainView from '@/views/MainView.vue'
import ArrowBackFilled from '@vicons/material/ArrowBackFilled'
import ProblemDescribe from '@/components/editRecord/ProblemDescribe.vue'
import PersonalInfo from '@/components/PersonalInfo.vue'
import LocationSelect from '@/components/editRecord/LocationSelect.vue'
import RecordDisp from '@/components/editRecord/RecordDisp.vue'

import { useRouter } from 'vue-router'
import { ref, onMounted } from 'vue'
import store from '@/store'
import { getProbDescs } from '@/store/probDescs'
import { computed } from 'vue'
import Api, { ReqState } from '@/utils/Api'
import { parseRecordId } from '@/utils/record'
import { getNextRecords, getRecords } from '@/store/record'
import type API from '@/store/api'

const router = useRouter()
const step = ref(1)
const loadingStatus = ref<ReqState>(ReqState.IDLE)

const probDescs = ref<{
  modelName: string,
  probDesc: string,
  detail: {
    probDescValue: string,
    probDescRaw: {
      selection: string[],
      detail: string
    }
  }
}>({
  modelName: '',
  probDesc: '',
  detail: {
    probDescValue: '',
    probDescRaw: {
      selection: [],
      detail: ''
    }
  }
})

const personalInfo = ref<{
  name: string,
  phone: string,
  password: string
}>()

const locationSelect = ref<{ date: string, location: string }>({
  date: '',
  location: ''
})

const props = defineProps({
  id: String
})

const record = ref<API.Record>()

onMounted(async () => {
  if (!store.probDescs) {
    if (!await getProbDescs()) {
      loadingStatus.value = ReqState.ERROR
      return
    }
  }

  if (!store.records) {
    await getRecords()
  }
  if (!store.probDescs) {
    await getProbDescs()
  }

  while (!store.records?.find((r => {
    return parseRecordId(r.url) === props.id
  }))) {
    await getNextRecords()
  }

  record.value = store.records!.find((r => {
    return parseRecordId(r.url) === props.id
  }))
  restoreRecord()

  console.debug("init probDescs", probDescs.value)
  loadingStatus.value = ReqState.SUCCESS
})

const restoreSelection = (desc: string) => {
  if (!store.probDescs) {
    return ""
  }
  let options = store.probDescs!
  let key: string | null = null
  desc.split(' / ').forEach((label) => {
    const option = options.find((o) => o.label === label)
    if (option) {
      key = option?.value
      if (option.children) {
        options = option.children
      }
    }
  })
  // If no key found, it means it's an "other" description
  if (!key) {
    probDescs.value.detail.probDescRaw.detail = desc
    return "other"
  }
  return key
}

const restoreRecord = () => {
  if (!record.value) {
    return
  }
  // console.debug("restoring record: ", record.value)
  probDescs.value.modelName = record.value.model
  probDescs.value.probDesc = record.value.description
  probDescs.value.detail.probDescValue = record.value.description
  probDescs.value.detail.probDescRaw.detail = ""
  probDescs.value.detail.probDescRaw.selection = record.value.description.split(', ').map((desc) => restoreSelection(desc))

  console.debug("restored probDescs: ", probDescs.value)
  personalInfo.value = {
    name: record.value.realname,
    phone: record.value.phone_num,
    password: record.value.password
  }
  locationSelect.value = {
    date: record.value.appointment_time,
    location: record.value.campus
  }
}

const result = computed(() => {
  return {
    realname: personalInfo.value!.name,
    phone_num: personalInfo.value!.phone,
    campus: locationSelect.value!.location,

    description: probDescs.value.probDesc,
    model: probDescs.value.modelName,
    password: personalInfo.value!.password,

    appointment_time: locationSelect.value!.date
  }
})

const handleSubmit = () => {
  return Api.put(`/wechat/${parseRecordId(record.value!.url)}/`, {
    ...result.value
  })
}
</script>
