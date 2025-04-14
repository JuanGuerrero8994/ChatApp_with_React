import { useState } from 'react'
import { useCases } from '../../di/container.js'
import { User } from '../../domain/models/User.js'

export const useLoginViewModel = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [response, setResponse] = useState(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    const handleLogin = async () => {
        setLoading(true)
        setError(null)
        try {
            const user = new User(email, password)
            const result = await useCases.loginUser.execute(user)
            setResponse(result)
        } catch (err) {
            setError('Login failed: ' + err.message)
        } finally {
            setLoading(false)
        }
    }

    return {
        email,
        setEmail,
        password,
        setPassword,
        response,
        loading,
        error,
        handleLogin,
    }
}
