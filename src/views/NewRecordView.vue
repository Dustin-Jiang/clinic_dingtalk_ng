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
      <n-h1 style="padding: 0 8px">预约电脑诊所</n-h1>
    </n-space>

    <div style="overflow: auto; padding: 8px; " v-if="loadingStatus === ReqState.SUCCESS">
      <n-steps :current="step" vertical>
        <n-step title="描述问题">
          <n-collapse-transition :show="step === 1">
            <ProblemDescribe v-model:value="probDescs" @next="() => step++" />
          </n-collapse-transition>
        </n-step>
        <n-step title="阅读维修须知">
          <n-collapse-transition :show="step === 2">
            <EULA @prev="() => step--" @next="() => step++" />
          </n-collapse-transition>
        </n-step>
        <n-step title="选择时间地点">
          <n-collapse-transition :show="step === 3">
            <LocationSelect v-model:value="locationSelect" @prev="() => step--" @next="() => step++" />
          </n-collapse-transition>
        </n-step>
        <n-step title="填写信息">
          <n-collapse-transition :show="step === 4">
            <PersonalInfo v-model:value="personalInfo" @prev="() => step--" @next="() => step++" />
          </n-collapse-transition>
        </n-step>
        <n-step title="确认">
          <n-collapse-transition :show="step === 5">
            <RecordDisp v-model:value="result" @prev="() => step--" @next="() => step++" />
          </n-collapse-transition>
        </n-step>
        <n-step title="等待审核" />
      </n-steps>
    </div>

  </MainView>
</template>

<script setup lang="ts">
import MainView from '@/views/MainView.vue'
import ArrowBackFilled from '@vicons/material/ArrowBackFilled'
import ProblemDescribe from '@/components/ProblemDescribe.vue'
import PersonalInfo from '@/components/PersonalInfo.vue'
import LocationSelect from '@/components/LocationSelect.vue'
import EULA from '@/components/EULA.vue'
import RecordDisp from '@/components/RecordDisp.vue'

import { useRouter } from 'vue-router'
import { ref, onMounted } from 'vue'
import store from '@/store'
import { getProbDescs } from '@/store/probDescs'
import { computed } from 'vue'
import { ReqState } from '@/utils/Api'

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
}>()

const personalInfo = ref<{
  name: string,
  phone: string,
  password: string
}>()

const locationSelect = ref<{ date: string, location: string }>({
  date: '',
  location: ''
})

onMounted(async () => {
  if (!store.probDescs) {
    if (!await getProbDescs()) {
      loadingStatus.value = ReqState.ERROR
      return
    }
  }

  loadingStatus.value = ReqState.SUCCESS
})

const result = computed(() => {
  return {
    realname: personalInfo.value!.name,
    phone_num: personalInfo.value!.phone,
    campus: locationSelect.value!.location,

    description: probDescs.value!.probDesc,
    model: probDescs.value!.modelName,
    password: personalInfo.value!.password,

    appointment_time: locationSelect.value!.date
  }
})
</script>
