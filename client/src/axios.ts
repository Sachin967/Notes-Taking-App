import axios, { AxiosInstance } from 'axios'

const userBaseUrl = 'http://localhost:3500/users'
const noteBaseUrl = 'http://localhost:3500/notes'

function createAxiosInstance(baseURL: string, withCredentials: boolean = false): AxiosInstance {
     return axios.create({
          baseURL,
          withCredentials,
     })
}

const users: AxiosInstance = createAxiosInstance(userBaseUrl, true)
const notes: AxiosInstance = createAxiosInstance(noteBaseUrl)

export { users, notes }
