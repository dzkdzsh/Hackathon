import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useMessages } from '../context/MessagesContext'
import { StudentType } from '../types'
import './WritePage.css'

export default function WritePage() {
  const { addMessage } = useMessages()
  const navigate = useNavigate()

  const [type, setType] = useState<StudentType>('primary')
  const [senderName, setSenderName] = useState('')
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!senderName.trim()) { setError('请填写你的名字吧'); return }
    if (!content.trim()) { setError('信的内容不能为空哦'); return }
    addMessage({ type, senderName: senderName.trim(), title: title.trim(), content: content.trim() })
    navigate('/')
  }

  return (
    <motion.div
      className="write-page"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
    >
      <div className="page-header">
        <h1>✉ 写一封信</h1>
        <p style={{ color: 'var(--ink-light)', marginTop: 4 }}>把心里话说出来，有人会在另一端等着</p>
      </div>

      <form className="letter-form paper-card" onSubmit={handleSubmit}>
        <StudentTypeSelector value={type} onChange={setType} />

        <label className="form-label">
          你的名字
          <input
            type="text"
            className="form-input"
            placeholder="可以是个昵称~"
            value={senderName}
            onChange={e => { setSenderName(e.target.value); setError('') }}
          />
        </label>

        <label className="form-label">
          信的标题 <span style={{ color: 'var(--ink-light)', fontSize: '0.85rem' }}>(可选)</span>
          <input
            type="text"
            className="form-input"
            placeholder="给这封信起个名字"
            value={title}
            onChange={e => setTitle(e.target.value)}
          />
        </label>

        <label className="form-label">
          信的内容
          <textarea
            className="form-textarea"
            placeholder="写下你想说的话……"
            rows={10}
            value={content}
            onChange={e => { setContent(e.target.value); setError('') }}
          />
        </label>

        {error && <p className="form-error">{error}</p>}

        <button type="submit" className="btn btn-seal btn-stamp">
          📮 寄出这封信
        </button>
      </form>
    </motion.div>
  )
}

function StudentTypeSelector({ value, onChange }: { value: StudentType; onChange: (v: StudentType) => void }) {
  return (
    <div className="type-selector">
      <p style={{ marginBottom: 8, fontWeight: 600, fontSize: '0.95rem' }}>你是谁？</p>
      <div className="type-buttons">
        <button
          type="button"
          className="type-btn"
          data-active={value === 'primary'}
          style={{
            borderColor: 'var(--rose)',
            color: value === 'primary' ? '#fff' : 'var(--rose)',
            background: value === 'primary' ? 'var(--rose)' : 'transparent',
          }}
          onClick={() => onChange('primary')}
        >
          🌸 小学生
        </button>
        <button
          type="button"
          className="type-btn"
          data-active={value === 'college'}
          style={{
            borderColor: 'var(--sky)',
            color: value === 'college' ? '#fff' : 'var(--sky)',
            background: value === 'college' ? 'var(--sky)' : 'transparent',
          }}
          onClick={() => onChange('college')}
        >
          🎓 大学生
        </button>
      </div>
    </div>
  )
}
