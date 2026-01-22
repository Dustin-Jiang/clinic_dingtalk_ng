import store from '@/store'
import Api from '@/utils/Api'
import type API from '@/store/api'

export const getAnnouncement = async () => {
  if (store.announcements === null) {
    try {
      store.announcements = (await Api.get<API.IAnnouncement[]>('/announcement/')).data
    } catch {
      return false
    }
  }
  return true
}
