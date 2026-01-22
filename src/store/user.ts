import store from "@/store"
import { User } from "@/utils/Api"

const loadUser = async () => {
  console.debug("Authorizing user")
  if (!store.user?.id) {
    try {
      const response = await User.get<{ status: number }>("/user")
      if (response.status === 200 && response.data.status === 200) {
        console.debug("Authorized success with localStorage")
        return
      }
      if (response.data.status !== 200) {
        throw Error('login failed')
      }
    }
    catch (e) {
      console.debug("Authorizing with Dingtalk")
      const dd = await import('dingtalk-jsapi')
      dd.ready(() => {
        dd.runtime.permission.requestAuthCode({
          corpId: findGetParameter('corpId')!,
        }).then(async (info) => {
          localStorage.setItem('user-token', info.code)
          const response2 = await User.post<{ status: number }>("/user")
          if (response2.data.status !== 200 || response2.status !== 200) {
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