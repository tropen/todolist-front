import axios from 'axios'
const URL_API = process.env.VUE_APP_URL_API;
// import { AccessTokenService } from './access-token-service'

const api = axios.create({
    baseURL: URL_API,
    headers: {
        'Content-Type': 'application/json',
    },
})


// export const setApiAuthHeader = token => {
//     api.defaults.headers.common['Authorization'] = `Bearer ${token}`
// }
//
// export const resetApiAuthHeader = () => {
//     api.defaults.headers.common['Authorization'] = undefined
// }
//
// setApiAuthHeader(AccessTokenService.get())

export { api }