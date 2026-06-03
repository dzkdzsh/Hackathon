import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { Message, Reply } from '../types'

const STORAGE_KEY = 'xinxinxin_messages'

interface MessagesContextValue {
  messages: Message[]
  addMessage: (msg: Omit<Message, 'id' | 'createdAt' | 'replies'>) => void
  addReply: (id: string, reply: Omit<Reply, 'createdAt'>) => void
}

const MessagesContext = createContext<MessagesContextValue | null>(null)

function migrateData(raw: unknown): Message[] {
  if (!Array.isArray(raw)) return []
  return raw.map((item: Record<string, unknown>) => {
    // if already has replies array, it's new format
    if (Array.isArray(item.replies)) return item as Message
    // old format: reply is a single object -> wrap in replies array
    if (item.reply && typeof item.reply === 'object') {
      return { ...item, replies: [item.reply], reply: undefined } as Message
    }
    // no replies at all
    return { ...item, replies: [] as Reply[] } as Message
  })
}

function loadMessages(): Message[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw)
      const migrated = migrateData(parsed)
      if (migrated.length > 0) {
        // write back migrated data immediately
        localStorage.setItem(STORAGE_KEY, JSON.stringify(migrated))
        return migrated
      }
    }
  } catch {
    // corrupted data, start fresh
  }
  return seedMessages()
}

function seedMessages(): Message[] {
  const now = new Date()
  return [
    {
      id: 'seed001',
      type: 'primary',
      senderName: '小星星',
      title: '我想成为一名宇航员！',
      content: '大学生哥哥姐姐你们好，\n\n我今年上四年级，最喜欢科学课。老师说宇宙里有 billions of galaxies，太神奇了！\n\n我想知道：当宇航员在太空里怎么洗澡呀？还有，他们能看到星星更亮的样子吗？\n\n希望有人能回我！\n\n你们的：小星星',
      createdAt: new Date(now.getTime() - 86400000 * 2).toISOString(),
      replies: [
        {
          type: 'college',
          senderName: '学长阿远',
          content: '小星星同学你好！\n\n你梦想成为宇航员的想法太棒了！关于你的问题：\n\n1. 太空里没有水会往下流，所以宇航员是用一种特殊的免洗洗发水和湿巾洗澡的。\n2. 在太空中（比如国际空间站里），因为经常能看到地球，反而不容易看到星星——因为地球会挡住一部分天空。但是出舱活动的时候，确实能看到超级亮的星星！\n\n加油学习科学知识，未来可期！\n\n阿远学长',
          createdAt: new Date(now.getTime() - 86400000 * 1.5).toISOString(),
        },
      ],
    },
    {
      id: 'seed002',
      type: 'primary',
      senderName: '小雨',
      title: '考试考砸了怎么办',
      content: '哥哥姐姐们：\n\n这次期中考试我数学没考好，才78分。妈妈没有骂我，但我自己很难过。\n\n我明明已经很努力了，为什么还是考不好？是不是我不够聪明啊？\n\n你们小时候也会考砸吗？',
      createdAt: new Date(now.getTime() - 86400000).toISOString(),
      replies: [
        {
          type: 'college',
          senderName: '学姐小葵',
          content: '亲爱的小雨：\n\n学姐想告诉你，我小时候也考砸过，有一次我还把试卷藏起来了，不敢给妈妈看。\n\n但是你知道吗？考试不是为了证明你聪不聪明，而是帮你找到哪里没学会。\n\n78分说明你已经掌握了78分的内容，还有22分是你接下来可以进步的空间呀！\n\n建议你准备一个小错题本，把做错的题抄下来，分析为什么错，下次就不会再错了。\n\n你很棒，继续加油！\n\n小葵学姐',
          createdAt: new Date(now.getTime() - 86400000 * 0.5).toISOString(),
        },
      ],
    },
    {
      id: 'seed003',
      type: 'college',
      senderName: '大一新生小明',
      title: '写给小学生的话',
      content: '亲爱的小学生们：\n\n我是一名刚上大学的新生。想到自己还在小学的时候，有很多哥哥姐姐给我写信鼓励我，我也想把温暖传递给你们。\n\n无论你现在遇到什么困难——不管是学习上的还是和朋友之间的矛盾——都要相信时间会慢慢解决的。\n\n好好学习，大学的世界很有趣！你们值得拥有美好的未来！',
      createdAt: new Date(now.getTime() - 3600000 * 6).toISOString(),
      replies: [
        {
          type: 'primary',
          senderName: '小太阳',
          content: '哥哥你好！我看到你的信了，谢谢你的鼓励！\n\n我现在三年级，我觉得学习很有趣！我最喜欢语文课，喜欢读故事。\n\n大学里有什么好玩的事情呀？我也希望快点长大上大学！\n\n小太阳',
          createdAt: new Date(now.getTime() - 3600000 * 3).toISOString(),
        },
      ],
    },
  ]
}

function saveMessages(messages: Message[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(messages))
}

export function MessagesProvider({ children }: { children: ReactNode }) {
  const [messages, setMessages] = useState<Message[]>(loadMessages)

  useEffect(() => {
    saveMessages(messages)
  }, [messages])

  const addMessage = (msg: Omit<Message, 'id' | 'createdAt' | 'replies'>) => {
    const newMsg: Message = {
      ...msg,
      id: Date.now().toString(36) + Math.random().toString(36).slice(2, 7),
      createdAt: new Date().toISOString(),
      replies: [],
    }
    setMessages(prev => [newMsg, ...prev])
  }

  const addReply = (id: string, reply: Omit<Reply, 'createdAt'>) => {
    setMessages(prev =>
      prev.map(m =>
        m.id === id
          ? { ...m, replies: [...m.replies, { ...reply, createdAt: new Date().toISOString() }] }
          : m
      )
    )
  }

  return (
    <MessagesContext.Provider value={{ messages, addMessage, addReply }}>
      {children}
    </MessagesContext.Provider>
  )
}

export function useMessages() {
  const ctx = useContext(MessagesContext)
  if (!ctx) throw new Error('useMessages must be used within MessagesProvider')
  return ctx
}
