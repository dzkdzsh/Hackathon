import { useEffect, useState, useCallback, useRef, useMemo } from 'react'
import { motion, AnimatePresence, useSpring, useAnimationFrame } from 'framer-motion'
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

/* === 漂浮元素池（16 个） === */

interface FloaterInit {
  emoji: string
  startX: number
  startY: number
  scale: number
}

const FLOATERS: FloaterInit[] = [
  { emoji: '✏️', startX: 6,  startY: 20, scale: 1.4 },
  { emoji: '🎒', startX: 80, startY: 65, scale: 1.5 },
  { emoji: '🐱', startX: 70, startY: 12, scale: 1.3 },
  { emoji: '💌', startX: 10, startY: 55, scale: 1.2 },
  { emoji: '⭐', startX: 86, startY: 38, scale: 1.3 },
  { emoji: '🌸', startX: 48, startY: 80, scale: 1.2 },
  { emoji: '🐦', startX: 28, startY: 8,  scale: 1.1 },
  { emoji: '🌻', startX: 62, startY: 52, scale: 1.4 },
  { emoji: '🦋', startX: 18, startY: 42, scale: 1.1 },
  { emoji: '📚', startX: 52, startY: 74, scale: 1.3 },
  { emoji: '🍀', startX: 14, startY: 70, scale: 1.2 },
  { emoji: '🌷', startX: 74, startY: 28, scale: 1.3 },
  { emoji: '🎵', startX: 38, startY: 14, scale: 1.1 },
  { emoji: '🧸', startX: 58, startY: 68, scale: 1.4 },
  { emoji: '🫧', startX: 22, startY: 34, scale: 1.0 },
  { emoji: '🍃', startX: 68, startY: 82, scale: 1.1 },
]

/* === 布朗运动漂浮者 === */

function BrownianFloater({ emoji, startX, startY, scale, onClick }: FloaterInit & { onClick: (e: React.MouseEvent) => void }) {
  const mx = useSpring(0, { stiffness: 0.06, damping: 0.35 })
  const my = useSpring(0, { stiffness: 0.06, damping: 0.35 })
  const mr = useSpring(0, { stiffness: 0.04, damping: 0.3 })

  const vx = useRef(0)
  const vy = useRef(0)
  const vr = useRef(0)
  const tick = useRef(0)

  // 每 0.5s 施加一次随机力，spring 自然平滑
  useAnimationFrame((_, delta) => {
    tick.current += delta
    const interval = 480 // ms between random impulses
    if (tick.current < interval) return
    tick.current -= interval

    // 随机加速度 + 归家力（越远拉力越强）
    const homeStrength = 0.015
    const cx = mx.get()
    const cy = my.get()
    const cr = mr.get()

    vx.current += (Math.random() - 0.5) * 22 - cx * homeStrength
    vy.current += (Math.random() - 0.5) * 18 - cy * homeStrength
    vr.current += (Math.random() - 0.5) * 14 - cr * homeStrength

    // 阻尼
    vx.current *= 0.82
    vy.current *= 0.82
    vr.current *= 0.82

    // 边界软限制 (max ~80px from origin)
    if (Math.abs(cx + vx.current) > 75) vx.current *= -0.3
    if (Math.abs(cy + vy.current) > 60) vy.current *= -0.3
    if (Math.abs(cr + vr.current) > 28) vr.current *= -0.3

    mx.set(cx + vx.current)
    my.set(cy + vy.current)
    mr.set(cr + vr.current)
  })

  return (
    <motion.button
      className="floater"
      style={{
        left: `${startX}%`,
        top: `${startY}%`,
        x: mx,
        y: my,
        rotate: mr,
      }}
      onClick={onClick}
      aria-label="点击互动"
    >
      <span className="floater-emoji" style={{ fontSize: `${scale * 36}px` }}>
        {emoji}
      </span>
    </motion.button>
  )
}

/* === 粒子系统 === */

interface SparkParticle {
  id: number
  x: number
  y: number
  emoji: string
  driftX: number
}

const PARTICLE_POOL = ['💕', '💖', '✨', '💝', '🌟', '🫧', '🎀', '🌷', '🍬', '💫', '🦋', '☁️']
let sparkId = 0

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
  const [sparks, setSparks] = useState<SparkParticle[]>([])

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (!mq.matches) {
      const t = setTimeout(() => setMounted(true), 200)
      return () => clearTimeout(t)
    }
  }, [])

  const spawnSpark = useCallback((e: React.MouseEvent) => {
    const driftX = (Math.random() - 0.5) * 40
    const s: SparkParticle = {
      id: ++sparkId,
      x: e.clientX,
      y: e.clientY,
      emoji: PARTICLE_POOL[Math.floor(Math.random() * PARTICLE_POOL.length)],
      driftX,
    }
    setSparks(prev => [...prev.slice(-20), s])
    setTimeout(() => setSparks(prev => prev.filter(p => p.id !== s.id)), 1600)
  }, [])

  return (
    <div className="decorations-layer" aria-hidden="true">
      <CornerDecorations />
      <div className="rainbow-stripe" />

      {mounted && (
        <>
          {FLOATERS.map((f, i) => (
            <BrownianFloater key={`bf${i}`} {...f} onClick={spawnSpark} />
          ))}

          <SideDecorations />

          <AnimatePresence>
            {sparks.map(s => (
              <motion.div
                key={s.id}
                className="spark-particle"
                style={{ left: s.x - 12, top: s.y - 12 }}
                initial={{ opacity: 0.8, scale: 0.3, y: 0, x: 0 }}
                animate={{ opacity: 0, scale: 1.6, y: -90, x: s.driftX }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1.5, ease: 'easeOut' }}
              >
                {s.emoji}
              </motion.div>
            ))}
          </AnimatePresence>
        </>
      )}
    </div>
  )
}
