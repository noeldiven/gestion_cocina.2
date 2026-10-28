// ============================================================
//  AJUSTA AQUÍ lo que diga tu Swagger: https://api-funval-g6.onrender.com/docs
// ============================================================
export const BASE_URL = 'https://api-funval-g6.onrender.com'

export const ENDPOINTS = {
  login: '/auth/login',     // <- revisa la ruta exacta en /docs
  me: '/users/me',          // GET perfil actual y PUT/PATCH para editarlo
  users: '/users',          // GET lista de usuarios (solo ADMIN)
}

// 'json'  -> { email, password }
// 'form'  -> x-www-form-urlencoded con username/password (típico de FastAPI OAuth2)
export const LOGIN_MODE = 'json'
export const LOGIN_FIELDS = { user: 'email', pass: 'password' } // si usa 'username', cámbialo aquí

// Método para actualizar perfil: 'PUT' o 'PATCH'
export const UPDATE_METHOD = 'PUT'
// Nombre de la llave del archivo (la pauta dice "avatar")
export const AVATAR_KEY = 'avatar'
// Nombres de campos de texto que espera el backend al editar
export const PROFILE_FIELDS = { name: 'name', email: 'email' }
// ============================================================

import { useAuthStore } from './store/authStore'

async function request(path, options = {}) {
  const token = useAuthStore.getState().token
  const headers = { ...(options.headers || {}) }
  if (token) headers.Authorization = `Bearer ${token}`

  const res = await fetch(`${BASE_URL}${path}`, { ...options, headers })
  if (res.status === 401) useAuthStore.getState().logout()

  let data = null
  try { data = await res.json() } catch { /* sin cuerpo */ }

  if (!res.ok) {
    const detail = data?.detail
    const msg = Array.isArray(detail) ? detail.map((d) => d.msg).join(', ') : detail
    throw new Error(msg || data?.message || `Error ${res.status}`)
  }
  return data
}

export function loginRequest(user, pass) {
  if (LOGIN_MODE === 'form') {
    const body = new URLSearchParams()
    body.append('username', user)
    body.append('password', pass)
    return request(ENDPOINTS.login, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body,
    })
  }
  return request(ENDPOINTS.login, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ [LOGIN_FIELDS.user]: user, [LOGIN_FIELDS.pass]: pass }),
  })
}

export const getMe = () => request(ENDPOINTS.me)
export const getUsers = () => request(ENDPOINTS.users)

// FormData: NO se pone Content-Type; el navegador agrega multipart/form-data + boundary
export function updateProfile({ name, email, file }) {
  const fd = new FormData()
  fd.append(PROFILE_FIELDS.name, name)
  fd.append(PROFILE_FIELDS.email, email)
  if (file) fd.append(AVATAR_KEY, file)
  return request(ENDPOINTS.me, { method: UPDATE_METHOD, body: fd })
}

// El avatar puede venir como URL absoluta o ruta relativa
export function avatarSrc(avatar) {
  if (!avatar) return null
  return avatar.startsWith('http') ? avatar : `${BASE_URL}/${avatar.replace(/^\//, '')}`
}
