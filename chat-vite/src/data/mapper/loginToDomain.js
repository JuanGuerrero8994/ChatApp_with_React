import { LoginResponse } from '../models/LoginResponse.js'

export const loginToDomain = (data) => {
    return new LoginResponse(data) // `data` es el token directamente
}