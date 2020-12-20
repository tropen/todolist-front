import {api} from '@/services/api'

const baseApi = '/api/tasks'

export const getAllTasks = () => api.get(baseApi)
export const getTaskStatuses = () => api.get(baseApi + `/statuses`)
export const getTask = id => api.get(`${baseApi}/${id}`)
export const addTask = data => api.post(baseApi, data)
export const updateTask = (taskId, data) => api.put(`${baseApi}/${taskId}`, data)

export const deleteTask = id => api.delete(`${baseApi}/${id}`)

