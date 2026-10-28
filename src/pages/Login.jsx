import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate, Navigate } from 'react-router-dom'
import { loginRequest, getMe } from '../api'
import { useAuthStore } from '../store/authStore'

export default function Login() {
  const { token, setSession } = useAuthStore()
  const navigate = useNavigate()
  const [error, setError] = useState('')
  const { register, handleSubmit, formState: { isSubmitting } } = useForm()

  if (token) return <Navigate to="/" replace />

// Decodifica el payload del JWT (para ver qué trae el "sub": email o id)
const decodeJwt = (t) => {
  try {
    return JSON.parse(atob(t.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')))
  } catch {
    return {}
  }
}

const onSubmit = async ({ email, password }) => {
  setError('')
  try {
    const res = await loginRequest(email, password)
    const payload = decodeJwt(res.access_token)
    console.log('JWT PAYLOAD:', payload)

    const user = {
      name: res.user_name,
      role: res.user_role,
      email,
      sub: payload.sub,
    }
    setSession(res.access_token, user)
    navigate('/')
  } catch (e) {
    useAuthStore.getState().logout()
    setError(e.message)
  }
}

  return (
    <div className="login-wrap">
      <form className="card" onSubmit={handleSubmit(onSubmit)}>
        <h1>Iniciar sesión</h1>
        <label>Correo</label>
        <input type="email" required {...register('email')} />
        <label>Contraseña</label>
        <input type="password" required {...register('password')} />
        {error && <p className="err">{error}</p>}
        <button className="btn" disabled={isSubmitting}>{isSubmitting ? 'Ingresando...' : 'Ingresar'}</button>
        <small>La API está en Render: la primera petición puede tardar ~30s.</small>
      </form>
    </div>
  )
}
