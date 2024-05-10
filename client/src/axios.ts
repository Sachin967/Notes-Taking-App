import axios, { AxiosInstance } from 'axios'

const user = 'http://localhost:3500/users'
const note = 'http://localhost:3500/notes'

function createAxiosInstance(baseURL: string, withCredentials: boolean = false): AxiosInstance {
     return axios.create({
          baseURL,
          withCredentials,
     })
}

const users: AxiosInstance = createAxiosInstance(user, true)
const notes: AxiosInstance = createAxiosInstance(note, true)

export { users, notes }
