import { AuthRepositoryImpl } from '../data/repository/AuthRepositoryImpl.js'
import { LoginUser } from '../domain/usecases/LoginUser.js'

const authRepository = AuthRepositoryImpl; // ✅ usamos el objeto directamente
const loginUser = new LoginUser(authRepository);

export const useCases = {
  loginUser,
};