import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import './Decorations.css'

/* === 四角静态 SVG 装饰 === */

function CornerDecorations() {
  return (
    <div className="corner-decorations" aria-hidden="true">
      {/* 左上 - 信封 */}
      <svg className="corner corner-tl" width="56" height="56" viewBox="0 0 56 56" fill="none">
        <rect x="8" y="14" width="38" height="26" rx="3" stroke="var(--stamp)" strokeWidth="1.5" strokeDasharray="3 2" fill="none" opacity="0.35"/>
        <path d="M8 14L27 32L46 14" stroke="var(--stamp)" strokeWidth="1.5" opacity="0.35"/>
        <circle cx="40" cy="20" r="3" fill="var(--seal)" opacity="0.35"/>
      </svg>

      {/* 右上 - 纸飞机 */}
      <svg className="corner corner-tr" width="52" height="52" viewBox="0 0 52 52" fill="none">
        <path d="M8 40L26 8L44 40L26 30L8 40Z" stroke="var(--sky)" strokeWidth="1.5" fill="none" opacity="0.35"/>
        <path d="M26 8L26 30" stroke="var(--sky)" strokeWidth="1" opacity="0.2"/>
      </svg>

      {/* 左下 - 小星星簇 */}
      <svg className="corner corner-bl" width="60" height="60" viewBox="0 0 60 60" fill="none">
        <path d="M18 38L20 34L24 32L20 30L18 26L16 30L12 32L16 34L18 38Z" stroke="var(--stamp)" strokeWidth="1" opacity="0.3"/>
        <path d="M36 44L37 42L39 41L37 40L36 38L35 40L33 41L35 42L36 44Z" stroke="var(--stamp)" strokeWidth="0.8" opacity="0.2"/>
        <path d="M44 32L44.8 30.5L46 29.5L44.8 28.5L44 27L43.2 28.5L42 29.5L43.2 30.5L44 32Z" stroke="var(--rose)" strokeWidth="1" opacity="0.25"/>
      </svg>

      {/* 右下 - 墨点 + 小花 */}
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

interface Floater {
  id: string
  el: 'pencil' | 'backpack' | 'cat' | 'bird' | 'plane' | 'petal' | 'star' | 'mailbox'
  startX: number
  startY: number
  duration: number
  delay: number
  size: number
}

function randomFloaters(count: number): Floater[] {
  const pool: Floater['el'][] = ['pencil', 'backpack', 'cat', 'bird', 'plane', 'petal', 'star', 'mailbox']
  const shuffled = pool.sort(() => Math.random() - 0.5)
  return shuffled.slice(0, count).map((el, i) => ({
    id: `flt-${i}`,
    el,
    startX: Math.random() * 90,
    startY: Math.random() * 85,
    duration: 70 + Math.random() * 60,
    delay: Math.random() * 30,
    size: 28 + Math.random() * 20,
  }))
}

const floaters = randomFloaters(5)

const floaterSvgs: Record<Floater['el'], JSX.Element> = {
  pencil: (
    <svg viewBox="0 0 60 20" fill="none">
      <rect x="2" y="6" width="40" height="8" rx="2" fill="var(--stamp)" opacity="0.5"/>
      <polygon points="42,6 56,10 42,14" fill="var(--envelope)" opacity="0.6"/>
      <rect x="56" y="9" width="4" height="2" rx="0.5" fill="var(--ink)" opacity="0.3"/>
      <rect x="2" y="6" width="8" height="8" rx="2" fill="var(--rose)" opacity="0.4"/>
    </svg>
  ),
  backpack: (
    <svg viewBox="0 0 50 50" fill="none">
      <rect x="10" y="16" width="30" height="28" rx="8" fill="var(--rose)" opacity="0.35"/>
      <rect x="16" y="16" width="18" height="8" rx="3" fill="var(--rose)" opacity="0.25"/>
      <path d="M20 16C20 10 30 10 30 16" stroke="var(--rose)" strokeWidth="2.5" fill="none" opacity="0.3"/>
      <circle cx="22" cy="30" r="2" fill="var(--paper)" opacity="0.4"/>
      <circle cx="30" cy="30" r="2" fill="var(--paper)" opacity="0.4"/>
    </svg>
  ),
  cat: (
    <svg viewBox="0 0 50 40" fill="none">
      <ellipse cx="25" cy="24" rx="14" ry="11" fill="var(--stamp)" opacity="0.35"/>
      <circle cx="25" cy="24" r="9" fill="var(--envelope)" opacity="0.35"/>
      <path d="M14 15L11 6L17 12" stroke="var(--stamp)" strokeWidth="1.8" fill="none" opacity="0.3"/>
      <path d="M36 15L39 6L33 12" stroke="var(--stamp)" strokeWidth="1.8" fill="none" opacity="0.3"/>
      <circle cx="21" cy="22" r="2" fill="var(--ink)" opacity="0.25"/>
      <circle cx="29" cy="22" r="2" fill="var(--ink)" opacity="0.25"/>
      <path d="M21 27Q25 30 29 27" stroke="var(--ink)" strokeWidth="1" fill="none" opacity="0.2"/>
      <path d="M25 11L25 16" stroke="var(--ink)" strokeWidth="0.8" opacity="0.12"/>
    </svg>
  ),
  bird: (
    <svg viewBox="0 0 40 30" fill="none">
      <path d="M4 18Q12 10 20 15Q28 10 36 18" stroke="var(--sky)" strokeWidth="2" fill="none" opacity="0.4"/>
      <path d="M14 16L20 20" stroke="var(--sky)" strokeWidth="1.2" fill="none" opacity="0.25"/>
      <path d="M26 16L20 20" stroke="var(--sky)" strokeWidth="1.2" fill="none" opacity="0.25"/>
    </svg>
  ),
  plane: (
    <svg viewBox="0 0 50 30" fill="none">
      <path d="M4 26L26 8L48 26L26 18L4 26Z" stroke="var(--sky)" strokeWidth="1.5" fill="none" opacity="0.35"/>
      <path d="M26 8V18" stroke="var(--sky)" strokeWidth="1" opacity="0.2"/>
    </svg>
  ),
  petal: (
    <svg viewBox="0 0 24 32" fill="none">
      <ellipse cx="12" cy="14" rx="10" ry="14" fill="var(--rose)" opacity="0.3"/>
      <path d="M12 0Q12 14 6 28" stroke="var(--rose)" strokeWidth="0.8" fill="none" opacity="0.15"/>
    </svg>
  ),
  star: (
    <svg viewBox="0 0 30 30" fill="none">
      <path d="M15 4L17 12L25 14L17 16L15 24L13 16L5 14L13 12L15 4Z" stroke="var(--stamp)" strokeWidth="1.2" fill="none" opacity="0.3"/>
    </svg>
  ),
  mailbox: (
    <svg viewBox="0 0 50 50" fill="none">
      <rect x="8" y="14" width="34" height="26" rx="6" fill="var(--seal)" opacity="0.3"/>
      <rect x="10" y="16" width="30" height="6" rx="2" fill="var(--paper)" opacity="0.4"/>
      <rect x="22" y="38" width="6" height="8" rx="1" fill="var(--ink)" opacity="0.18"/>
      <path d="M12 34L22 28" stroke="var(--paper)" strokeWidth="1.5" opacity="0.2"/>
    </svg>
  ),
}

export default function Decorations() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    // reduce-motion check
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (!mq.matches) setMounted(true)
  }, [])

  if (!mounted) return <CornerDecorations />

  return (
    <div className="decorations-layer" aria-hidden="true">
      <CornerDecorations />

      {/* 顶部彩条 */}
      <div className="rainbow-stripe" />

      {floaters.map(f => {
        const midX = 50 + (Math.random() - 0.5) * 30
        const midY = 35 + (Math.random() - 0.5) * 25
        return (
          <motion.div
            key={f.id}
            className={`floater floater-${f.el}`}
            style={{ width: f.size, height: f.size, left: `${f.startX}%`, top: `${f.startY}%` }}
            initial={{ x: 0, y: 0, opacity: 0 }}
            animate={{
              x: [`${0}vw`, `${midX - f.startX}vw`, `${(Math.random() - 0.5) * 20}vw`],
              y: [`${0}vh`, `${midY - f.startY}vh`, `${(Math.random() - 0.5) * 15}vh`],
              opacity: [0, 0.12, 0.08, 0.12, 0],
              rotate: [0, 5, -4, 3, 0],
            }}
            transition={{
              duration: f.duration,
              delay: f.delay,
              repeat: Infinity,
              ease: 'easeInOut',
              times: [0, 0.3, 0.6, 0.85, 1],
            }}
          >
            {floaterSvgs[f.el]}
          </motion.div>
        )
      })}
    </div>
  )
}
