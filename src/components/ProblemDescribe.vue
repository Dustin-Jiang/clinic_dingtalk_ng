<template>
  <n-space vertical>
    <RepairComment label="问题描述" :options="store.probDescs!" v-model:value="probDescs" />
    <n-form ref="probFormRef" :rules="probValueRule" :model="probValue">
      <n-form-item label="电脑型号" path="modelName">
        <n-input v-model:value="probValue.modelName" placeholder="若不清楚, 可查看机身底部铭文" :autofocus="false" />
      </n-form-item>
      <n-space justify="space-between">
        <div></div>
        <n-button type="primary" :disabled="!probStepFinished" @click="() => $emit('next')">下一步</n-button>
      </n-space>
    </n-form>
  </n-space>
</template>

<script setup lang="ts">
import RepairComment from '@/components/RepairComment.vue'
import store from '@/store';
import { computed } from 'vue';
import { ref, watchEffect } from "vue"

const model = defineModel<{
  modelName: string,
  probDesc: string,
  detail: {
    probDescValue: string,
    probDescRaw: {
      selection: string[],
      detail: string
    }
  }
}>("value")

const probDescs = ref<{
  validate: boolean,
  value: string,
  display: string,
  raw: {
    selection: string[],
    detail: string
  }
}>({
  validate: false,
  value: model.value?.detail.probDescValue ?? '',
  display: model.value?.probDesc ?? '',
  raw: model.value?.detail.probDescRaw ?? {
    selection: [],
    detail: ''
  }
})

const probValue = ref({
  modelName: model.value?.modelName ?? ''
})

const probValueRule = {
  modelName: { required: true, message: '请填写以便我们更好地处理', trigger: 'blur' }
}

const probFormRef = ref<HTMLFormElement>();

const probStepFinished = ref(false)

watchEffect(() => {
  console.debug("probStepFinished: ", probDescs.value.validate)
  probFormRef.value?.validate((errors: any) => {
    if (!errors) {
      probStepFinished.value = probDescs.value.validate
    }
    else {
      probStepFinished.value = false
    }
  })
})

const value = computed(() => {
  return {
    modelName: probValue.value.modelName,
    probDesc: probDescs.value.display,
    detail: {
      probDescValue: probDescs.value.value,
      probDescRaw: probDescs.value.raw,
    }
  }
})

watchEffect(() => {
  model.value = value.value
})

defineEmits(["next"])
</script>