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

/* === 动态漂浮元素（16个，3x 速度，带旋转） === */

interface FloaterDef {
  emoji: string
  startX: number
  startY: number
  dx: number
  dy: number
  scale: number
  dur: number
  delay: number
  rot: number[]
}

const FLOATERS: FloaterDef[] = [
  { emoji: '✏️', startX: 6,  startY: 20, dx: 55, dy: -22, scale: 1.4, dur: 6, delay: 0,   rot: [0, 18, -12, 8, 0] },
  { emoji: '🎒', startX: 80, startY: 65, dx: -50, dy: -14, scale: 1.5, dur: 7, delay: 1,   rot: [0, -10, 15, -8, 0] },
  { emoji: '🐱', startX: 70, startY: 12, dx: -40, dy: 35,  scale: 1.3, dur: 5, delay: 2,   rot: [0, -15, 10, -5, 0] },
  { emoji: '💌', startX: 10, startY: 55, dx: 45, dy: -30, scale: 1.2, dur: 6, delay: 0,    rot: [0, 12, -18, 10, 0] },
  { emoji: '⭐', startX: 86, startY: 38, dx: -55, dy: 20,  scale: 1.3, dur: 5, delay: 3,   rot: [0, 25, -20, 15, 0] },
  { emoji: '🌸', startX: 48, startY: 80, dx: 20, dy: -48, scale: 1.2, dur: 7, delay: 1,    rot: [0, 15, -10, 5, 0] },
  { emoji: '🐦', startX: 28, startY: 8,  dx: 46, dy: 16,  scale: 1.1, dur: 4, delay: 2,   rot: [0, -8, 12, -5, 0] },
  { emoji: '🌻', startX: 62, startY: 52, dx: -30, dy: -26, scale: 1.4, dur: 7, delay: 0,   rot: [0, -12, 8, -5, 0] },
  { emoji: '🦋', startX: 18, startY: 42, dx: 35, dy: -18,  scale: 1.1, dur: 4, delay: 3,   rot: [0, 10, -15, 8, 0] },
  { emoji: '📚', startX: 52, startY: 74, dx: -22, dy: -35, scale: 1.3, dur: 7, delay: 1,   rot: [0, -5, 10, -5, 0] },
  { emoji: '🍀', startX: 14, startY: 70, dx: 40, dy: -22, scale: 1.2, dur: 5, delay: 2,    rot: [0, 20, -15, 10, 0] },
  { emoji: '🌷', startX: 74, startY: 28, dx: -38, dy: 14,  scale: 1.3, dur: 6, delay: 0,   rot: [0, -18, 10, -5, 0] },
  { emoji: '🎵', startX: 38, startY: 14, dx: 30, dy: 22,  scale: 1.1, dur: 5, delay: 3,    rot: [0, 8, -10, 5, 0] },
  { emoji: '🧸', startX: 58, startY: 68, dx: -24, dy: -28, scale: 1.4, dur: 7, delay: 0,   rot: [0, -15, 8, -5, 0] },
  { emoji: '🫧', startX: 22, startY: 34, dx: 36, dy: -12,  scale: 1.0, dur: 4, delay: 2,   rot: [0, 5, -8, 5, 0] },
  { emoji: '🍃', startX: 68, startY: 82, dx: -32, dy: -20, scale: 1.1, dur: 5, delay: 1,   rot: [0, -10, 15, -8, 0] },
]

/* === 心形粒子 === */

interface HeartParticle {
  id: number
  x: number
  y: number
}

let heartId = 0

/* === 害羞小猫 === */

function ShyCat() {
  const [state, setState] = useState<'idle' | 'fleeing' | 'returning'>('idle')

  const handleEnter = () => {
    if (state === 'idle') {
      setState('fleeing')
      setTimeout(() => setState('returning'), 1000)
      setTimeout(() => setState('idle'), 3500)
    }
  }

  let className = 'side-cat'
  if (state === 'fleeing') className += ' cat-flee'
  else if (state === 'returning') className += ' cat-return'

  return (
    <div className={className} onMouseEnter={handleEnter} title="喵~">
      <span className="cat-body">🐈</span>
    </div>
  )
}

/* === 侧边装饰 === */

function SideDecorations() {
  return (
    <div className="side-decorations" aria-hidden="true">
      <div className="side-item side-chime side-chime-left" style={{ top: '12%' }}>
        <span className="chime-string">|</span>
        <span className="chime-body">🎐</span>
      </div>
      <div className="side-item side-chime side-chime-right" style={{ top: '18%' }}>
        <span className="chime-string">|</span>
        <span className="chime-body">🎐</span>
      </div>
      <div className="side-item side-grass-left" style={{ bottom: '10%' }}>
        <span className="grass-body">🌿</span>
      </div>
      <div className="side-item side-grass-right" style={{ bottom: '6%' }}>
        <span className="grass-body">🌱</span>
      </div>
      <ShyCat />
    </div>
  )
}

/* === 主组件 === */

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
    const h: HeartParticle = { id: ++heartId, x: e.clientX, y: e.clientY }
    setHearts(prev => [...prev.slice(-20), h])
    setTimeout(() => setHearts(prev => prev.filter(p => p.id !== h.id)), 1500)
  }, [])

  return (
    <div className="decorations-layer" aria-hidden="true">
      <CornerDecorations />
      <div className="rainbow-stripe" />

      {mounted && (
        <>
          {FLOATERS.map((f, i) => (
            <motion.button
              key={`f${i}`}
              className="floater"
              style={{
                left: `${f.startX}%`,
                top: `${f.startY}%`,
              }}
              initial={{ x: 0, y: 0, rotate: f.rot[0] }}
              animate={{
                x: [0, f.dx * 0.5, f.dx, f.dx * 0.6, 0],
                y: [0, f.dy * 0.5, f.dy, f.dy * 0.6, 0],
                rotate: f.rot,
              }}
              transition={{
                duration: f.dur,
                delay: f.delay,
                repeat: Infinity,
                ease: 'linear',
                times: [0, 0.25, 0.5, 0.75, 1],
              }}
              onClick={spawnHeart}
              aria-label="点击互动"
            >
              <span className="floater-emoji" style={{ fontSize: `${f.scale * 36}px` }}>
                {f.emoji}
              </span>
            </motion.button>
          ))}

          <SideDecorations />

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
