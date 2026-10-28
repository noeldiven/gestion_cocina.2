import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useAuthStore } from '../store/authStore'
import { updateProfile } from '../api'
import Avatar from './Avatar'

export default function ProfileModal({ onClose }) {
  const { user, setUser } = useAuthStore()
  const [file, setFile] = useState(null)
  const [preview, setPreview] = useState(null)
  const [error, setError] = useState('')
  const [ok, setOk] = useState(false)

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    defaultValues: { name: user?.name || '', email: user?.email || '' },
  })

  // Libera la URL temporal de memoria al cambiar de imagen o cerrar el modal
  useEffect(() => () => { if (preview) URL.revokeObjectURL(preview) }, [preview])

  const onFile = (e) => {
    const f = e.target.files?.[0]
    if (!f) return
    if (!f.type.startsWith('image/')) return setError('Selecciona un archivo de imagen')
    if (f.size > 2 * 1024 * 1024) return setError('La imagen no debe pesar más de 2MB')
    setError('')
    setFile(f)
    setPreview(URL.createObjectURL(f)) // previsualización local, sin tocar el servidor
  }

  const onSubmit = async (values) => {
    setError(''); setOk(false)
    try {
      const updated = await updateProfile({ ...values, file })
      setUser(updated || values)
      setOk(true)
      setTimeout(onClose, 800)
    } catch (e) {
      setError(e.message)
    }
  }

  return (
    <div className="overlay" onClick={onClose}>
      <form className="modal" onClick={(e) => e.stopPropagation()} onSubmit={handleSubmit(onSubmit)}>
        <h2>Editar perfil</h2>

        <div className="center">
          <Avatar src={preview || user?.avatar} name={user?.name || 'U'} size={96} />
          <label className="btn secondary">
            Cambiar foto
            <input type="file" accept="image/*" hidden onChange={onFile} />
          </label>
        </div>

        <label>Nombre</label>
        <input {...register('name', { required: 'El nombre es obligatorio' })} />
        {errors.name && <small className="err">{errors.name.message}</small>}

        <label>Correo</label>
        <input type="email" {...register('email', { required: 'El correo es obligatorio' })} />
        {errors.email && <small className="err">{errors.email.message}</small>}

        {error && <p className="err">{error}</p>}
        {ok && <p className="okmsg">¡Perfil actualizado!</p>}

        <div className="row">
          <button type="button" className="btn secondary" onClick={onClose}>Cancelar</button>
          <button className="btn" disabled={isSubmitting}>{isSubmitting ? 'Guardando...' : 'Guardar'}</button>
        </div>
      </form>
    </div>
  )
}
