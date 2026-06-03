import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Message, StudentType } from '../types'
import { ArrowRight, Heart } from 'lucide-react'
import './MessageCard.css'

const typeColors: Record<StudentType, string> = {
  primary: 'var(--rose)',
  college: 'var(--sky)',
}

const typeLabels: Record<StudentType, string> = {
  primary: '🌸 小学生',
  college: '🎓 大学生',
}

export function MessageCard({ message, index }: { message: Message; index: number }) {
  const color = typeColors[message.type]
  const date = new Date(message.createdAt).toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: Math.min(index * 0.06, 0.3) }}
    >
      <Link to={`/message/${message.id}`} className="message-card">
        <div className="card-accent" style={{ backgroundColor: color }} />

        <div className="card-header">
          <span className="card-badge" style={{ color, borderColor: color }}>
            {typeLabels[message.type]}
          </span>
          {message.replies.length > 0 && (
            <span className="card-replied-badge">
              <Heart size={11} fill="var(--seal)" stroke="var(--seal)" />
              {' '}{message.replies.length} 条回复
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
          <ArrowRight className="card-arrow" size={16} />
        </div>
      </Link>
    </motion.div>
  )
}
