<template>
  <n-form :rules="rule" ref="formRef" :model="result">
    <n-form-item label="姓名" path="name">
      <n-input v-model:value="result.name" placeholder="请填写真实姓名" />
    </n-form-item>
    <n-form-item label="手机号码" path="phone">
      <n-input v-model:value="result.phone" placeholder="请填写手机号码" />
    </n-form-item>
    <n-form-item label="开机密码" path="password">
      <n-input v-model:value="result.password" placeholder="非必填, 方便工作人员维修" type="password"
        :input-props="{ autocomplete: 'current-password' }" />
    </n-form-item>

    <n-space justify="space-between">
      <n-button @click="() => $emit('prev')">上一步</n-button>
      <n-button @click="() => $emit('next')" type="primary" :disabled="!validate">下一步</n-button>
    </n-space>
  </n-form>
</template>

<script setup lang="ts">
import { onMounted, watch } from 'vue';
import { ref } from 'vue';

defineEmits(["prev", "next"])

const model = defineModel<{
  name: string,
  phone: string,
  password: string
}>("value")

const result = ref({
  name: model.value?.name ?? '',
  phone: model.value?.phone ?? '',
  password: model.value?.password ?? ''
})

const formRef = ref<InstanceType<typeof import('naive-ui')['NForm']>>()

const rule = {
  name: { required: true, message: '请填写姓名', trigger: 'blur' },
  phone: {
    required: true,
    message: '请填写手机号码',
    trigger: 'blur',
    validator: (rule: any, value: string) => {
      return /\d{8,11}/.test(value) &&
        ((value.length == 8 && value[0] != '1') ||
          (value.length == 11 && value[0] === '1' || value[0] === '0'))
    }
  },
  password: { required: false, trigger: 'blur' }
}

const validate = ref(false)

watch(result, () => {
  model.value = result.value
  formRef.value!.validate((errors) => {
    if (!errors) {
      validate.value = true;
    }
    else {
      validate.value = false;
    }
  })
}, { deep: true })

onMounted(() => {
  if (model.value?.name && model.value?.phone) {
    formRef.value!.validate((errors) => {
      if (!errors) {
        validate.value = true;
      }
    })
  }
})
</script>