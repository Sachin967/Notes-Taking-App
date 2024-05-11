import axios, { AxiosInstance } from 'axios'

const user = 'https://notesbackend.sachinms.fyi/users'
const note = 'https://notesbackend.sachinms.fyi/notes'

function createAxiosInstance(baseURL: string, withCredentials: boolean = false): AxiosInstance {
     return axios.create({
          baseURL,
          withCredentials,
     })
}

const users: AxiosInstance = createAxiosInstance(user, true)
const notes: AxiosInstance = createAxiosInstance(note, true)

export { users, notes }
