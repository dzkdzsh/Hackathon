import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useMessages } from '../context/MessagesContext'
import { ArrowLeft, Heart, Send, MessageCircle } from 'lucide-react'
import { motion } from 'framer-motion'
import './MessageDetailPage.css'
import type { StudentType } from '../types'

const typeLabels: Record<StudentType, string> = {
  primary: '🌸 小学生',
  college: '🎓 大学生',
}

const typeColors: Record<StudentType, string> = {
  primary: 'var(--rose)',
  college: 'var(--sky)',
}

export default function MessageDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { messages, addReply, toggleLike, toggleReplyLike } = useMessages()
  const message = messages.find(m => m.id === id)

  if (!message) return <EmptyDetail />

  const handleReplySubmit = (name: string, content: string, type: StudentType) => {
    addReply(message.id, { type, senderName: name, content })
  }

  return (
    <motion.div
      className="detail-page"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
    >
      <Link to="/" className="back-link">
        <ArrowLeft size={16} /> 返回留言板
      </Link>

      <LetterDisplay message={message} onLike={() => toggleLike(message.id)} />

      <ReplyForm onSubmitted={handleReplySubmit} />

      {message.replies.length > 0 && (
        <div className="replies-section">
          <h3 className="replies-heading">
            <MessageCircle size={18} /> {message.replies.length} 条回复
          </h3>
          {message.replies.map((reply, i) => (
            <ReplyCard
              key={i}
              reply={reply}
              index={i}
              onLike={() => toggleReplyLike(message.id, i)}
            />
          ))}
        </div>
      )}
    </motion.div>
  )
}

function LetterDisplay({ message, onLike }: { message: ReturnType<typeof useMessages>['messages'][number]; onLike: () => void }) {
  const date = new Date(message.createdAt).toLocaleDateString('zh-CN', {
    year: 'numeric', month: 'long', day: 'numeric',
  })

  return (
    <article className="letter-display paper-card" style={{ '--letter-bar-color': typeColors[message.type] } as React.CSSProperties}>
      <div className="letter-meta">
        <span
          className="letter-badge"
          style={{ color: typeColors[message.type], borderColor: typeColors[message.type] }}
        >
          {typeLabels[message.type]}
        </span>
        <span className="letter-date">{date}</span>
      </div>

      {message.title && <h1 className="letter-title">{message.title}</h1>}

      <p className="letter-author">— {message.senderName}</p>

      <div className="letter-body">
        {message.content.split('\n').map((line, i) => (
          <p key={i} className="letter-line">{line || ' '}</p>
        ))}
      </div>

      <button className="like-btn" onClick={onLike}>
        <Heart size={15} /> {message.likes}
      </button>
    </article>
  )
}

function ReplyCard({ reply, index, onLike }: { reply: ReturnType<typeof useMessages>['messages'][number]['replies'][number]; index: number; onLike: () => void }) {
  const date = new Date(reply.createdAt).toLocaleDateString('zh-CN', {
    year: 'numeric', month: 'long', day: 'numeric',
  })

  return (
    <motion.div
      className="reply-section paper-card"
      initial={{ opacity: 0, x: -16 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.35, delay: Math.min(index * 0.06, 0.2) }}
    >
      <div className="reply-header">
        <div className="reply-label">
          <Heart size={16} fill="var(--seal)" stroke="var(--seal)" />
          回信 #{index + 1}
        </div>
        <button className="like-btn" onClick={onLike}>
          <Heart size={14} /> {reply.likes}
        </button>
      </div>
      <p className="reply-meta">
        {typeLabels[reply.type]} · {reply.senderName} · {date}
      </p>
      <div className="reply-body">
        {reply.content.split('\n').map((line, i) => (
          <p key={i} className="reply-line">{line || ' '}</p>
        ))}
      </div>
    </motion.div>
  )
}

function ReplyForm({ onSubmitted }: { onSubmitted: (name: string, content: string, type: StudentType) => void }) {
  const [type, setType] = useState<StudentType>('college')
  const [name, setName] = useState('')
  const [content, setContent] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) { setError('请留下你的名字'); return }
    if (!content.trim()) { setError('回信内容不能为空哦'); return }
    onSubmitted(name.trim(), content.trim(), type)
    setName('')
    setContent('')
    setError('')
  }

  return (
    <motion.div
      className="reply-form-card paper-card"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15 }}
    >
      <h3 className="reply-form-title">写回信</h3>
      <form onSubmit={handleSubmit}>
        <div className="reply-type-btns">
          <button
            type="button"
            className="type-btn"
            style={{
              borderColor: 'var(--rose)',
              color: type === 'primary' ? '#fff' : 'var(--rose)',
              background: type === 'primary' ? 'var(--rose)' : 'transparent',
            }}
            onClick={() => setType('primary')}
          >
            🌸 小学生
          </button>
          <button
            type="button"
            className="type-btn"
            style={{
              borderColor: 'var(--sky)',
              color: type === 'college' ? '#fff' : 'var(--sky)',
              background: type === 'college' ? 'var(--sky)' : 'transparent',
            }}
            onClick={() => setType('college')}
          >
            🎓 大学生
          </button>
        </div>
        <input
          type="text"
          className="form-input"
          placeholder="你的名字"
          value={name}
          onChange={e => { setName(e.target.value); setError('') }}
        />
        <textarea
          className="form-textarea"
          placeholder="写下你的回信……"
          rows={5}
          value={content}
          onChange={e => { setContent(e.target.value); setError('') }}
        />
        {error && <p className="form-error">{error}</p>}
        <button type="submit" className="btn btn-seal" style={{ marginTop: 8, width: '100%', justifyContent: 'center', padding: '14px 24px' }}>
          <Send size={17} /> 寄出回信
        </button>
      </form>
    </motion.div>
  )
}

function EmptyDetail() {
  return (
    <div style={{ textAlign: 'center', padding: '80px 20px' }}>
      <p style={{ fontSize: '3rem', marginBottom: 16 }}>📭</p>
      <p style={{ color: 'var(--ink-light)', marginBottom: 20 }}>这封信好像走丢了</p>
      <Link to="/" className="btn btn-outline">
        <ArrowLeft size={16} /> 返回留言板
      </Link>
    </div>
  )
}
