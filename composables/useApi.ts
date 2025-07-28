// composables/apiUser.ts
import { useAxios } from '@/composables/useAxios'

export const useApi = () => {
  const axios = useAxios()

  const get = async () => {
    const res = await axios.get('/users')
    return res.data
  }

  return { get }
}
