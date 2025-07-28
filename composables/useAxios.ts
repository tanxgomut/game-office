import axios from 'axios'

export const useAxios = () => {
    const config = useRuntimeConfig()
    const token = useCookie('token')

    const instance = axios.create({
        // baseURL: config.public.apiBase, 
        baseURL: 'https://jsonplaceholder.typicode.com',
        headers: {
            Authorization: token.value ? `Bearer ${token.value}` : '',
            'Content-Type': 'application/json'
        }
    })

    return instance
}
