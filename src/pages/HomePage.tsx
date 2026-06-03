import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useMessages } from '../context/MessagesContext'
import { FilterTabs, type FilterOption } from '../components/FilterTabs'
import { MessageCard } from '../components/MessageCard'
import { NewMessageButton } from '../components/NewMessageButton'
import '../components/FilterTabs.css'

function hotScore(m: ReturnType<typeof useMessages>['messages'][number]) {
  return m.likes + m.replies.reduce((sum, r) => sum + r.likes, 0)
}

export default function HomePage() {
  const { messages } = useMessages()
  const [filter, setFilter] = useState<FilterOption>('all')

  const filtered = useMemo(() => {
    let list = messages

    if (filter === 'primary' || filter === 'college') {
      list = list.filter(m => m.type === filter)
    } else if (filter === 'unanswered') {
      list = list.filter(m => m.replies.length === 0)
    }

    if (filter === 'newest' || filter === 'unanswered') {
      list = [...list].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    } else if (filter === 'hottest') {
      list = [...list].sort((a, b) => hotScore(b) - hotScore(a))
    }

    return list
  }, [messages, filter])

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        style={{ marginBottom: 24 }}
      >
        <h1 style={{ fontSize: '1.6rem', marginBottom: 4 }}>
          🌿 心连心留言板
        </h1>
        <p style={{ color: 'var(--ink-light)', fontSize: '0.95rem' }}>
          每一封信，都是一次温暖的相遇
        </p>
      </motion.div>

      <FilterTabs value={filter} onChange={setFilter} />

      <AnimatePresence mode="wait">
        {filtered.length === 0 ? (
          <motion.div
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <EmptyState filter={filter} />
          </motion.div>
        ) : (
          <motion.div key="list">
            {filtered.map((msg, i) => (
              <MessageCard key={msg.id} message={msg} index={i} />
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <NewMessageButton />
    </>
  )
}

function EmptyState({ filter }: { filter: FilterOption }) {
  const messages: Record<string, string> = {
    unanswered: '所有信件都有回复了 🎉',
    default: '这里还没有留言',
  }
  return (
    <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--ink-light)' }}>
      <svg width="100" height="80" viewBox="0 0 100 80" fill="none" style={{ margin: '0 auto 20px', opacity: 0.5 }}>
        <rect x="15" y="20" width="68" height="44" rx="5" stroke="var(--stamp)" strokeWidth="2" strokeDasharray="4 3" fill="none"/>
        <path d="M15 20L50 48L85 20" stroke="var(--stamp)" strokeWidth="2" opacity="0.6"/>
        <path d="M42 38L20 55" stroke="var(--stamp)" strokeWidth="1.5" opacity="0.3"/>
        <path d="M58 38L80 55" stroke="var(--stamp)" strokeWidth="1.5" opacity="0.3"/>
        <circle cx="72" cy="30" r="6" fill="var(--seal)" opacity="0.35"/>
        <path d="M44 30L42 34L40 32" stroke="var(--ink)" strokeWidth="1" opacity="0.3"/>
      </svg>
      <p style={{ fontSize: '1.1rem', marginBottom: 8 }}>
        {messages[filter] || messages.default}
      </p>
      <p style={{ fontSize: '0.9rem' }}>来做第一个写信的人吧！</p>
    </div>
  )
}
