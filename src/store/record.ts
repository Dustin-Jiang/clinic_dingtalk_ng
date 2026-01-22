import Api from '@/utils/Api'
import type API from '@/store/api'
import store from '@/store'

import { ref } from 'vue'

const next = ref('')

export const getRecords = async () => {
  try {
    // TODO: @Dustin-Jiang: 后端返回的有count字段，但是data不是list，而是单个对象
    const working = (await Api.get<API.IWorkingRecord>('/wechat/working/')).data
    if (working.count > 0 && working.data) {
      store.records = [working.data]
    }
    else {
      store.records = []
    }
    next.value = '/wechat/finish/'
    getNextRecords()
  } catch {
    return false
  }
  return true
}

export const getNextRecords = async () => {
  if (!next.value) return false
  try {
    const data = ((await Api.get<API.IRecords>(next.value)).data)
    store.records = store.records!.concat(data.results)
    next.value = data.next
  } catch {
    return false
  }
  return true
}