export class LoginUser {
    constructor(authRepository) {
        this.authRepository = authRepository
    }

    async execute(user) {
        return await this.authRepository.login(user)
    }
}
