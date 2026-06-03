import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useMessages } from '../context/MessagesContext'
import { Message, StudentType } from '../types'
import { ArrowRight, Heart, MessageCircle } from 'lucide-react'
import './MessageCard.css'

const typeLabels: Record<StudentType, string> = {
  primary: '🌸 小学生',
  college: '🎓 大学生',
}

const typeColors: Record<StudentType, string> = {
  primary: 'var(--rose)',
  college: 'var(--sky)',
}

function totalLikes(m: Message) {
  return m.likes + m.replies.reduce((s, r) => s + r.likes, 0)
}

export function MessageCard({ message, index }: { message: Message; index: number }) {
  const { toggleLike } = useMessages()
  const color = typeColors[message.type]
  const date = new Date(message.createdAt).toLocaleDateString('zh-CN', {
    year: 'numeric', month: 'long', day: 'numeric',
  })

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: Math.min(index * 0.06, 0.3) }}
    >
      <Link
        to={`/message/${message.id}`}
        className="message-card"
        style={{ '--bar-color': color } as React.CSSProperties}
      >
        {/* 信封折角 */}
        <div className="card-fold" />
        <div className="card-fold-inner" />

        <div className="card-header">
          <span className="card-badge" style={{ background: color }}>
            {typeLabels[message.type]}
          </span>
          {message.replies.length > 0 && (
            <span className="card-replied-badge">
              <MessageCircle size={11} /> {message.replies.length}
            </span>
          )}
          <span className="card-date">{date}</span>
        </div>

        <h3 className="card-title">{message.title || '无题'}</h3>
        <p className="card-preview">
          {message.content.slice(0, 120)}{message.content.length > 120 ? '...' : ''}
        </p>

        <div className="card-footer">
          <span className="card-sender">— {message.senderName}</span>
          <div className="card-actions" onClick={e => { e.preventDefault(); toggleLike(message.id) }}>
            <button className="like-btn-card">
              <Heart size={13} /> {totalLikes(message)}
            </button>
            <ArrowRight className="card-arrow" size={15} />
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
