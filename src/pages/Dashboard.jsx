import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useAuthStore, isAdmin } from '../store/authStore'
import ProfileModal from '../components/ProfileModal'
import Avatar from '../components/Avatar'

export default function Dashboard() {
  const { user, logout } = useAuthStore()
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()

  return (
    <div className="layout">
      <nav className="nav">
        <strong>FunVal</strong>
        <NavLink to="/">Dashboard</NavLink>
        {isAdmin(user) && <NavLink to="/users">Usuarios</NavLink>}
        <span className="spacer" />
        <Avatar src={user?.avatar} name={user?.name || 'U'} size={36} />
        <button className="btn secondary" onClick={() => { logout(); navigate('/login') }}>Salir</button>
      </nav>

      <main className="content">
        <div className="card">
          <Avatar src={user?.avatar} name={user?.name || 'U'} size={96} />
          <h1>¡Bienvenido, {user?.name || user?.email}!</h1>
          <p>Rol: <b>{user?.role}</b> · {user?.email}</p>
          <button className="btn" onClick={() => setOpen(true)}>Editar perfil</button>
        </div>
      </main>

      {open && <ProfileModal onClose={() => setOpen(false)} />}
    </div>
  )
}
