import store from '@/store'
import { probDescs } from '@/utils/constants'

export const getProbDescs = async () => {
  store.probDescs = probDescs
  return true
}