import store from "@/store"
import * as dd from 'dingtalk-jsapi'
import { User } from "@/utils/Api"
import type API from "@/store/api"

const loadUser = async () => {
  console.debug("Authorizing user")
  if (!store.user?.id) {
    try {
      const response = await User.get<API.IUsers>("/user")
      if (response.status === 200) {
        console.debug("Authorized success with localStorage")
        store.user = response.data
        return
      }
    }
    catch (e) {
      console.debug("Authorizing with Dingtalk")
      dd.ready(() => {
        dd.runtime.permission.requestAuthCode({
          corpId: findGetParameter('corpId')!,
        }).then(async (info) => {
          localStorage.setItem('user-token', info.code)
          const response2 = await User.post("/user")
          if (response2.data.status !== 200) {
            throw Error('login failed')
          }
          return
        })
      })
    }
  }
}

const findGetParameter = (parameterName: string) => {
  let result: string | null = null
  let tmp = []
  console.log(location.search)
  location.search.substr(1).split('&').forEach(function (item) {
    tmp = item.split('=')
    if (tmp[0] === parameterName) {
      result = decodeURIComponent(tmp[1])
    }
  })
  return result
}

export default loadUser;