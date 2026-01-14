import { reactive } from 'vue'
import type API from '@/store/api'
import Api from '@/utils/Api'

const store = reactive({
  user: {} as API.IUsers,
  records: null as API.Record[] | null,
  announcements: null as API.IAnnouncement[] | null,
  probDescs: null as API.RecordDesc[] | null,
  campuses: null as API.Campus[] | null,
  dateStatus: null as API.DateStatus[] | null,
})

const load = async () => {
  store.user = (await Api.get<API.IUsers>('/api/user/')).data
  store.campuses = (await Api.get<API.Campus[]>('/api/campus/')).data
  store.dateStatus = (await Api.get<API.DateStatus[]>('/api/date/')).data
}

export default store
export { load }

//@ts-expect-error
window.$store = store
