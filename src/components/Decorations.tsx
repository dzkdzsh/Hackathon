import { useEffect, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import './Decorations.css'

/* === 四角静态 SVG 装饰 === */

function CornerDecorations() {
  return (
    <div className="corner-decorations" aria-hidden="true">
      <svg className="corner corner-tl" width="56" height="56" viewBox="0 0 56 56" fill="none">
        <rect x="8" y="14" width="38" height="26" rx="3" stroke="var(--stamp)" strokeWidth="1.5" strokeDasharray="3 2" fill="none" opacity="0.35"/>
        <path d="M8 14L27 32L46 14" stroke="var(--stamp)" strokeWidth="1.5" opacity="0.35"/>
        <circle cx="40" cy="20" r="3" fill="var(--seal)" opacity="0.35"/>
      </svg>
      <svg className="corner corner-tr" width="52" height="52" viewBox="0 0 52 52" fill="none">
        <path d="M8 40L26 8L44 40L26 30L8 40Z" stroke="var(--sky)" strokeWidth="1.5" fill="none" opacity="0.35"/>
        <path d="M26 8L26 30" stroke="var(--sky)" strokeWidth="1" opacity="0.2"/>
      </svg>
      <svg className="corner corner-bl" width="60" height="60" viewBox="0 0 60 60" fill="none">
        <path d="M18 38L20 34L24 32L20 30L18 26L16 30L12 32L16 34L18 38Z" stroke="var(--stamp)" strokeWidth="1" opacity="0.3"/>
        <path d="M36 44L37 42L39 41L37 40L36 38L35 40L33 41L35 42L36 44Z" stroke="var(--stamp)" strokeWidth="0.8" opacity="0.2"/>
        <path d="M44 32L44.8 30.5L46 29.5L44.8 28.5L44 27L43.2 28.5L42 29.5L43.2 30.5L44 32Z" stroke="var(--rose)" strokeWidth="1" opacity="0.25"/>
      </svg>
      <svg className="corner corner-br" width="56" height="56" viewBox="0 0 56 56" fill="none">
        <circle cx="40" cy="36" r="5" fill="var(--ink)" opacity="0.06"/>
        <circle cx="42" cy="34" r="2" fill="var(--ink)" opacity="0.04"/>
        <circle cx="18" cy="36" r="4" fill="var(--rose)" opacity="0.2"/>
        <circle cx="18" cy="36" r="1.5" fill="var(--stamp)" opacity="0.25"/>
        <path d="M18 32C18 32 20 38 24 40" stroke="var(--sky)" strokeWidth="1" opacity="0.25"/>
        <path d="M18 32C18 32 16 38 12 40" stroke="var(--sky)" strokeWidth="1" opacity="0.25"/>
        <path d="M18 32L18 42" stroke="var(--sky)" strokeWidth="0.8" opacity="0.2"/>
      </svg>
    </div>
  )
}

/* === 动态漂浮元素 === */

interface FloaterDef {
  emoji: string
  startX: number
  startY: number
  dx: number
  dy: number
  scale: number
  dur: number
  delay: number
}

const FLOATERS: FloaterDef[] = [
  { emoji: '✏️', startX: 8,  startY: 25, dx: 65, dy: -25, scale: 1.4, dur: 18, delay: 0 },
  { emoji: '🎒', startX: 85, startY: 70, dx: -60, dy: -15, scale: 1.5, dur: 20, delay: 2 },
  { emoji: '🐱', startX: 75, startY: 15, dx: -45, dy: 40,  scale: 1.3, dur: 16, delay: 4 },
  { emoji: '💌', startX: 12, startY: 60, dx: 50, dy: -35, scale: 1.2, dur: 19, delay: 1 },
  { emoji: '⭐', startX: 90, startY: 40, dx: -65, dy: 25,  scale: 1.3, dur: 14, delay: 5 },
  { emoji: '🌸', startX: 50, startY: 85, dx: 25, dy: -55, scale: 1.2, dur: 22, delay: 1 },
  { emoji: '🐦', startX: 30, startY: 10, dx: 55, dy: 18,  scale: 1.1, dur: 13, delay: 3 },
  { emoji: '🌻', startX: 65, startY: 55, dx: -35, dy: -30, scale: 1.4, dur: 20, delay: 2 },
  { emoji: '🦋', startX: 20, startY: 45, dx: 40, dy: -22,  scale: 1.1, dur: 12, delay: 6 },
  { emoji: '📚', startX: 55, startY: 78, dx: -28, dy: -40, scale: 1.3, dur: 21, delay: 0 },
]

const PICKED = FLOATERS.sort(() => Math.random() - 0.5).slice(0, 8)

/* === 心形粒子 === */

interface HeartParticle {
  id: number
  x: number
  y: number
}

let heartId = 0

export default function Decorations() {
  const [mounted, setMounted] = useState(false)
  const [hearts, setHearts] = useState<HeartParticle[]>([])

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (!mq.matches) {
      const t = setTimeout(() => setMounted(true), 200)
      return () => clearTimeout(t)
    }
  }, [])

  const spawnHeart = useCallback((e: React.MouseEvent) => {
    const h: HeartParticle = {
      id: ++heartId,
      x: e.clientX,
      y: e.clientY,
    }
    setHearts(prev => [...prev.slice(-20), h])
    setTimeout(() => {
      setHearts(prev => prev.filter(p => p.id !== h.id))
    }, 1500)
  }, [])

  return (
    <div className="decorations-layer" aria-hidden="true">
      <CornerDecorations />
      <div className="rainbow-stripe" />

      {mounted && (
        <>
          {PICKED.map((f, i) => (
            <motion.button
              key={f.emoji + i}
              className="floater"
              style={{
                left: `${f.startX}%`,
                top: `${f.startY}%`,
                fontSize: `${f.scale * 36}px`,
              }}
              initial={{ x: 0, y: 0, opacity: 0.22 }}
              animate={{
                x: [0, f.dx * 0.5, f.dx, f.dx * 0.6, 0],
                y: [0, f.dy * 0.5, f.dy, f.dy * 0.6, 0],
                opacity: [0.22, 0.32, 0.22, 0.30, 0.22],
              }}
              transition={{
                duration: f.dur,
                delay: f.delay,
                repeat: Infinity,
                ease: 'linear',
                times: [0, 0.25, 0.5, 0.75, 1],
              }}
              onClick={spawnHeart}
              whileHover={{ opacity: 0.7 }}
              whileTap={{ opacity: 0.9 }}
              aria-label="点击互动"
            >
              {f.emoji}
            </motion.button>
          ))}

          <AnimatePresence>
            {hearts.map(h => (
              <motion.div
                key={h.id}
                className="heart-particle"
                style={{ left: h.x - 11, top: h.y - 11 }}
                initial={{ opacity: 0.8, scale: 0.3, y: 0 }}
                animate={{ opacity: 0, scale: 1.5, y: -80 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1.4, ease: 'easeOut' }}
              >
                {['💕', '💖', '✨', '💝', '🌟'][h.id % 5]}
              </motion.div>
            ))}
          </AnimatePresence>
        </>
      )}
    </div>
  )
}
