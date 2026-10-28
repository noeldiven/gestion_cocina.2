import { avatarSrc } from '../api'

export default function Avatar({ src, name = '?', size = 40 }) {
  const url = src?.startsWith?.('blob:') ? src : avatarSrc(src)
  return url ? (
    <img className="avatar" src={url} alt={name} style={{ width: size, height: size }} />
  ) : (
    <div className="avatar placeholder" style={{ width: size, height: size }}>
      {name.charAt(0).toUpperCase()}
    </div>
  )
}
