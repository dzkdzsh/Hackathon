import { useEffect, useState, useCallback, useRef } from 'react'
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

/* === 漂浮元素池（16 个，每个带独特轨道参数） === */

interface FloaterInit {
  emoji: string
  startX: number
  startY: number
  scale: number
  orbA: number   // 轨道 X 幅值
  orbB: number   // 轨道 Y 幅值
  orbW: number   // 轨道频率
  orbP: number   // 相位偏移
}

const FLOATERS: FloaterInit[] = [
  { emoji: '✏️', startX: 6,  startY: 20, scale: 1.4, orbA: 55, orbB: 35, orbW: 0.8, orbP: 0 },
  { emoji: '🎒', startX: 80, startY: 65, scale: 1.5, orbA: 45, orbB: 60, orbW: 0.6, orbP: 1.2 },
  { emoji: '🐱', startX: 70, startY: 12, scale: 1.3, orbA: 65, orbB: 40, orbW: 0.7, orbP: 2.5 },
  { emoji: '💌', startX: 10, startY: 55, scale: 1.2, orbA: 40, orbB: 55, orbW: 0.9, orbP: 0.8 },
  { emoji: '⭐', startX: 86, startY: 38, scale: 1.3, orbA: 50, orbB: 45, orbW: 0.75, orbP: 3.1 },
  { emoji: '🌸', startX: 48, startY: 80, scale: 1.2, orbA: 58, orbB: 30, orbW: 0.55, orbP: 1.7 },
  { emoji: '🐦', startX: 28, startY: 8,  scale: 1.1, orbA: 70, orbB: 50, orbW: 1.0, orbP: 0.3 },
  { emoji: '🌻', startX: 62, startY: 52, scale: 1.4, orbA: 42, orbB: 62, orbW: 0.65, orbP: 2.0 },
  { emoji: '🦋', startX: 18, startY: 42, scale: 1.1, orbA: 48, orbB: 38, orbW: 1.1, orbP: 1.5 },
  { emoji: '📚', startX: 52, startY: 74, scale: 1.3, orbA: 35, orbB: 50, orbW: 0.5,  orbP: 3.8 },
  { emoji: '🍀', startX: 14, startY: 70, scale: 1.2, orbA: 60, orbB: 35, orbW: 0.85, orbP: 2.3 },
  { emoji: '🌷', startX: 74, startY: 28, scale: 1.3, orbA: 38, orbB: 58, orbW: 0.7,  orbP: 0.5 },
  { emoji: '🎵', startX: 38, startY: 14, scale: 1.1, orbA: 52, orbB: 44, orbW: 0.95, orbP: 3.4 },
  { emoji: '🧸', startX: 58, startY: 68, scale: 1.4, orbA: 30, orbB: 55, orbW: 0.6,  orbP: 1.9 },
  { emoji: '🫧', startX: 22, startY: 34, scale: 1.0, orbA: 44, orbB: 28, orbW: 1.2,  orbP: 2.8 },
  { emoji: '🍃', startX: 68, startY: 82, scale: 1.1, orbA: 56, orbB: 42, orbW: 0.72, orbP: 0.2 },
]

/* === 布朗 + 弧形轨道 漂浮者 === */

function BrownianFloater({ emoji, startX, startY, scale, orbA, orbB, orbW, orbP, onClick }: FloaterInit & { onClick: (e: React.MouseEvent) => void }) {
  const mx = useSpring(0, { stiffness: 0.4, damping: 0.22 })
  const my = useSpring(0, { stiffness: 0.4, damping: 0.22 })
  const mr = useSpring(0, { stiffness: 0.35, damping: 0.2 })

  const vx = useRef(0)
  const vy = useRef(0)
  const vr = useRef(0)
  const elapsed = useRef(0)

  useAnimationFrame((_, delta) => {
    elapsed.current += delta * 0.001 // seconds
    const t = elapsed.current
    const interval = 170
    // track a sub-tick counter; use it for brownian kicks
    const prevTick = Math.floor((t * 1000) / interval)

    vx.current += (Math.random() - 0.5) * 120 * (delta / interval)
    vy.current += (Math.random() - 0.5) * 90 * (delta / interval)
    vr.current += (Math.random() - 0.5) * 80 * (delta / interval)

    vx.current *= 0.955
    vy.current *= 0.955
    vr.current *= 0.955

    const bx = mx.get()
    const by = my.get()
    const br = mr.get()

    // 弧形轨道：利萨如曲线
    const orbitX = orbA * Math.sin(orbW * t + orbP)
    const orbitY = orbB * Math.cos(orbW * t + orbP + 0.7)

    // 软归心力：超过 150px 开始拉回，力度平方增长
    const dist = Math.sqrt(bx * bx + by * by)
    const homeR = 150
    let homeFx = 0, homeFy = 0
    if (dist > homeR) {
      const over = (dist - homeR) / homeR // 0..1+
      const strength = over * over * 3
      homeFx = (bx / dist) * -strength
      homeFy = (by / dist) * -strength
    }

    mx.set(orbitX + bx + vx.current + homeFx)
    my.set(orbitY + by + vy.current + homeFy)
    mr.set(br + vr.current)
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
