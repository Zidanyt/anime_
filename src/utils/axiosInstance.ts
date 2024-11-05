import axios from 'axios'

const axiosInstance = axios.create({
  baseURL: 'https://anime-api-alpha-red.vercel.app/',
  headers: {
    'Content-Type': 'application/json',
  },
})

export default axiosInstance
