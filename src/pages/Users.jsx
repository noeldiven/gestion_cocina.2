import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getUsers } from '../api'
import Avatar from '../components/Avatar'

export default function Users() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    getUsers()
      .then((d) => setUsers(Array.isArray(d) ? d : d.items || d.users || []))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="content">
      <p><Link to="/">← Volver al Dashboard</Link></p>
      <h1>Usuarios</h1>
      {loading && <p>Cargando...</p>}
      {error && <p className="err">{error}</p>}
      {!loading && !error && (
        <table>
          <thead>
            <tr><th>Avatar</th><th>Nombre</th><th>Correo</th><th>Rol</th></tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id || u.email}>
                <td><Avatar src={u.avatar} name={u.name || u.email} /></td>
                <td>{u.name}</td>
                <td>{u.email}</td>
                <td>{u.role}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}
