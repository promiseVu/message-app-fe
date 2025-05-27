import { axiosInstance } from "~/server/utils/axios"

export default defineEventHandler(async (event) => {
    try{
        const response = await axiosInstance().get('api/conversations')
        return response.data
    }catch(error){
        console.error('Lỗi khi gọi api', error)
    }
})