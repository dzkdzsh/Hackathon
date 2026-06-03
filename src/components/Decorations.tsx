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

/* === 漂浮元素池（16 个） === */

const FLOATER_EMOJIS = ['✏️', '🎒', '🐱', '💌', '⭐', '🌸', '🐦', '🌻', '🦋', '📚', '🍀', '🌷', '🎵', '🧸', '🫧', '🍃']
const SCALES = [1.4, 1.5, 1.3, 1.2, 1.3, 1.2, 1.1, 1.4, 1.1, 1.3, 1.2, 1.3, 1.1, 1.4, 1.0, 1.1]

function rndPx(max: number) { return Math.random() * (max - 120) + 60 }
function rndEdgeSpawn(w: number, h: number) {
  const edge = Math.floor(Math.random() * 4)
  const pad = 60
  switch (edge) {
    case 0: return { x: rndPx(w), y: -pad, vx: 0, vy: 2 + Math.random() * 3 } // top
    case 1: return { x: w + pad, y: rndPx(h), vx: -(2 + Math.random() * 3), vy: 0 } // right
    case 2: return { x: rndPx(w), y: h + pad, vx: 0, vy: -(2 + Math.random() * 3) } // bottom
    default: return { x: -pad, y: rndPx(h), vx: 2 + Math.random() * 3, vy: 0 } // left
  }
}

/* === 布朗 + 弧形轨道 + 出屏重生 漂浮者 === */

function BrownianFloater({ emoji, scale, onClick }: { emoji: string; scale: number; onClick: (e: React.MouseEvent) => void }) {
  const [pos, setPos] = useState(() => {
    const w = window.innerWidth, h = window.innerHeight
    return { x: rndPx(w), y: rndPx(h) }
  })
  const [visible, setVisible] = useState(true)

  const mx = useSpring(0, { stiffness: 0.4, damping: 0.22 })
  const my = useSpring(0, { stiffness: 0.4, damping: 0.22 })
  const mr = useSpring(0, { stiffness: 0.35, damping: 0.2 })

  const vx = useRef((Math.random() - 0.5) * 4)
  const vy = useRef((Math.random() - 0.5) * 3)
  const vr = useRef((Math.random() - 0.5) * 2)
  const elapsed = useRef(0)

  const orbA = useRef(35 + Math.random() * 55)
  const orbB = useRef(25 + Math.random() * 45)
  const orbW = useRef(0.4 + Math.random() * 0.9)
  const orbP = useRef(Math.random() * Math.PI * 2)

  const timerRef = useRef<ReturnType<typeof setTimeout>>()

  useAnimationFrame((_, delta) => {
    elapsed.current += delta * 0.001
    const t = elapsed.current

    // 布朗随机力
    vx.current += (Math.random() - 0.5) * 100 * (delta / 160)
    vy.current += (Math.random() - 0.5) * 75 * (delta / 160)
    vr.current += (Math.random() - 0.5) * 70 * (delta / 160)

    vx.current *= 0.96
    vy.current *= 0.96
    vr.current *= 0.96

    const bx = mx.get()
    const by = my.get()

    // 弧形轨道
    const orbitX = orbA.current * Math.sin(orbW.current * t + orbP.current)
    const orbitY = orbB.current * Math.cos(orbW.current * t + orbP.current + 0.7)

    const newX = bx + vx.current
    const newY = by + vy.current
    mx.set(orbitX + newX)
    my.set(orbitY + newY)
    mr.set(mr.get() + vr.current)

    // 出屏检测：元素完全离开视口
    const sx = pos.x + mx.get()
    const sy = pos.y + my.get()
    const w = window.innerWidth, h = window.innerHeight
    const margin = 150
    if (sx < -margin || sx > w + margin || sy < -margin || sy > h + margin) {
      const { x, y, vx: nvx, vy: nvy } = rndEdgeSpawn(w, h)
      setPos({ x, y })
      mx.set(0)
      my.set(0)
      vx.current = nvx
      vy.current = nvy
      setVisible(false)
      clearTimeout(timerRef.current)
      timerRef.current = setTimeout(() => setVisible(true), 80)
    }
  })

  return (
    <motion.button
      className="floater"
      style={{
        left: pos.x,
        top: pos.y,
        x: mx,
        y: my,
        rotate: mr,
        opacity: visible ? undefined : 0,
        transition: 'opacity 0.6s ease-in',
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
          {FLOATER_EMOJIS.map((emoji, i) => (
            <BrownianFloater key={`bf${i}`} emoji={emoji} scale={SCALES[i]} onClick={spawnSpark} />
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
