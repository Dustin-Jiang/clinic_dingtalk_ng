<template>
  <n-form :rules="rules" :model="model" ref="formRef">
    <n-form-item :label="label" path="selection">
      <n-space vertical style="width: 100%">
        <n-input v-model:value="filterPattern" placeholder="输入以搜索">
          <template #prefix>
            <n-icon>
              <SearchFilled />
            </n-icon>
          </template>
        </n-input>
        <n-tree :block-line="true" :block-node="true" :data="data" expand-on-click checkable
          :show-irrelevant-nodes="false" :override-default-node-click-behavior="override" check-strategy="child"
          style="width: 100%" @update:checkedKeys="updateCheckedKeys" :pattern="filterPattern" :filter="(pattern: string, option: CascaderOption, path: CascaderOption[]) =>
            optionFilter(pattern, option)" />
      </n-space>
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
import SearchFilled from "@vicons/material/SearchFilled"

const result = defineModel<IRepairComment>("value")
const labels = new Map<string, string>()

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

const formRef = ref<typeof NForm | null>(null)

onMounted(() => {
  setLabels(props.options)
  console.debug(props.options)
})

const setLabels = (options: API.RecordDesc[], prefix: string = "") => {
  options.forEach((v) => {
    if (v.children) {
      setLabels(v.children, `${prefix}${v.label} / `)
    }
    else {
      labels.set(v.value, prefix + v.label)
    }
  })
}

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
  else return labels.get(v);
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

const filterPattern = ref<string>("")
const optionFilter = (pattern: string, option: CascaderOption) => {
  return option.label.toLowerCase().includes(pattern.toLowerCase())
}

const updateCheckedKeys = (
  keys: Array<string | number>,
  options: Array<TreeOption | null>,
  meta: {
    node: TreeOption | null
    action: 'check' | 'uncheck'
  }
) => {
  console.log('updateCheckedKeys', keys, options, meta)
  model.value.selection = keys.map(v => v.toString())
}
</script>