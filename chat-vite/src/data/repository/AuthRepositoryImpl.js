// AuthRepositoryImpl.js
import { httpClient } from '../network/httpClient.js'
import { loginToDomain } from '../mapper/loginToDomain.js'
import { loginToRequest } from '../mapper/loginToRequest.js' // ✅ ESTA IMPORTACIÓN ES CLAVE

export const AuthRepositoryImpl = {
  login: async (domainLogin) => {
    const request = loginToRequest(domainLogin)
    const response = await httpClient.post('users/authenticate', request)
    return loginToDomain(response.data)
  },
}