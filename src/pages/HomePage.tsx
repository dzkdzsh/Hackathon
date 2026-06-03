import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useMessages } from '../context/MessagesContext'
import { FilterTabs, type FilterOption } from '../components/FilterTabs'
import { MessageCard } from '../components/MessageCard'
import { NewMessageButton } from '../components/NewMessageButton'
import '../components/FilterTabs.css'

export default function HomePage() {
  const { messages } = useMessages()
  const [filter, setFilter] = useState<FilterOption>('all')

  const filtered = useMemo(() => {
    if (filter === 'all') return messages
    return messages.filter(m => m.type === filter)
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
            <EmptyState />
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

function EmptyState() {
  return (
    <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--ink-light)' }}>
      <div style={{ fontSize: '3.5rem', marginBottom: 16 }}>💌</div>
      <p style={{ fontSize: '1.1rem', marginBottom: 8 }}>这里还没有留言</p>
      <p style={{ fontSize: '0.9rem' }}>来做第一个写信的人吧！</p>
    </div>
  )
}
