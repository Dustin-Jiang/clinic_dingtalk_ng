<template>
  <n-form :rules="rules" :model="model" ref="formRef">
    <n-form-item :label="label" path="selection">
      <n-tree-select :options="data" multiple show-path expand-on-click checkable filterable
        :show-irrelevant-nodes="false" :override-default-node-click-behavior="override" check-strategy="child"
        style="width: 100%" :filter="(pattern: string, option: CascaderOption, path: CascaderOption[]) =>
          optionFilter(pattern, option)" :value="model.selection"
        @update:value="(val: string[]) => model.selection = val" />
    </n-form-item>
    <n-collapse-transition :show="isOtherSelected">
      <n-form-item :label="'其他' + label" path="detail">
        <n-input type="textarea" placeholder="详细描述问题, 方便我们更准确判断问题" v-model:value="model.detail" />
      </n-form-item>
    </n-collapse-transition>
  </n-form>
</template>

<script setup lang="ts">
import { ref, watch, computed, onMounted } from "vue"
import type { FormItemRule, NForm, TreeOption, TreeOverrideNodeClickBehavior } from "naive-ui"
import type API from "@/store/api"
import { watchEffect } from "vue";

const result = defineModel<IRepairComment>("value")

const buildLabels = (options: API.RecordDesc[], prefix: string = "", map: Map<string, string> = new Map()) => {
  options.forEach((v) => {
    if (v.children) {
      buildLabels(v.children, `${prefix}${v.label} / `, map)
    }
    else {
      map.set(v.value, prefix + v.label)
    }
  })
  return map
}

const labels = computed(() => buildLabels(props.options))

const props = defineProps<{
  label: string,
  options: API.RecordDesc[]
}>()

const convertOptions = (options: API.RecordDesc[]): TreeOption[] => {
  return options.map((v) => {
    return {
      label: v.label,
      key: v.value,
      children: v.children ? convertOptions(v.children) : undefined,
      checkboxDisabled: v.children ? true : false
    }
  })
}

const data = ref<TreeOption[]>(convertOptions(props.options))

const model = ref<{
  selection: string[],
  detail: string
}>(result.value?.raw ?? {
  selection: [],
  detail: ""
})

onMounted(() => {
  console.debug(props.options)
})

watch(() => model.value.selection, () => {
  console.debug("selection: ", model.value.selection)
  console.debug("selection: ", model.value.selection.includes("other"))
  console.debug("selection: ", isOtherSelected.value)
})

const isOtherSelected = computed(() => {
  return model.value.selection.includes("other")
})

const commentRaw = computed(() => model.value.selection.map((v) => {
  if (v == "other") return model.value.detail
  else return v;
}))

const commentDisplay = computed(() => model.value.selection.map((v) => {
  if (v == "other") return model.value.detail
  else return labels.value.get(v);
}))

const validate = computed(() => {
  if (model.value.selection.includes("other")) {
    return model.value.detail.length > 0
  }
  return model.value.selection.length > 0
})

const override: TreeOverrideNodeClickBehavior = ({ option }) => {
  if (option.children) {
    return 'toggleExpand'
  }
  return 'default'
}

watchEffect(() => {
  result.value!.value = commentRaw.value.join(", ")
  result.value!.display = commentDisplay.value.join(", ")
  result.value!.raw = model.value
  result.value!.validate = validate.value
  console.debug("comment: ", result.value)
})

const rules = {
  selection: {
    required: true,
    message: "请选择" + props.label,
    validator: (rule: FormItemRule, value: string) => {
      return value.length > 0
    },
    trigger: "blur"
  },
  detail: {
    required: true,
    message: "细细说说",
    trigger: "blur",
    key: "detail"
  },
}

interface IRepairComment {
  validate: boolean,
  value: string,
  display: string,
  raw: {
    selection: string[],
    detail: string
  }
}

type CascaderOption = {
  label: string,
  value: string,
  children?: CascaderOption[]
}

const optionFilter = (pattern: string, option: CascaderOption) => {
  return option.label.toLowerCase().includes(pattern.toLowerCase())
}
</script>