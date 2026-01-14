import Api from '@/utils/Api'
import type API from '@/store/api'
import store from '@/store'

import { ref } from 'vue'

const next = ref('')

export const getRecords = async () => {
  if (store.records === null) {
    try {
      const data = (await Api.get<API.IRecords>('/api/wechat/finish/')).data
      store.records = data.results
      next.value = data.next
    } catch {
      return false
    }
  } else {
    if (next.value !== '') {
      try {
        const data = (await Api.get<API.IRecords>(next.value)).data
        store.records = store.records.concat(data.results)
        next.value = data.next
      } catch {
        return false
      }
    } else {
      return false
    }
  }
  return true
}
