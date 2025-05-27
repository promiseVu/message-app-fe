import axios, { AxiosInstance, AxiosResponse, AxiosError } from 'axios'

export const axiosInstance = (option?: any, event?: any): AxiosInstance => {
  const instance = axios.create({
    baseURL: useRuntimeConfig() .private.baseUrl || 'https://localhost:8080',
    headers: {
      'Content-Type': option?.['Content-Type'] || 'application/json',
      'Accept': option?.['Accept'] || 'application/json',
    //   'Authorization': `Bearer ${config.public.apiToken}`,
    },
    timeout: 10000,
  })

  instance.interceptors.request.use(
    (request) => {
      console.log('Sending request to:', request)
      return request
    },
  )

  instance.interceptors.response.use(
    (response: AxiosResponse) => {
      console.log('Response received:', response.data)
      return response
    },
    (error: AxiosError) => {
      console.error('Response error:', error.response?.status, error.response?.data)
    }
  )

  return instance
}