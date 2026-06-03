import { Link } from 'react-router-dom'

export function NewMessageButton() {
  return (
    <div style={{ textAlign: 'center', margin: '32px 0' }}>
      <Link to="/write" className="btn btn-seal" style={{ fontSize: '1.05rem', padding: '12px 32px' }}>
        ✉ 写一封信
      </Link>
    </div>
  )
}
