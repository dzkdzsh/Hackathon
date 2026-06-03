import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { Message, Reply } from '../types'

const STORAGE_KEY = 'xinxinxin_messages'

interface MessagesContextValue {
  messages: Message[]
  addMessage: (msg: Omit<Message, 'id' | 'createdAt' | 'replies' | 'likes'>) => void
  addReply: (id: string, reply: Omit<Reply, 'createdAt' | 'likes'>) => void
  toggleLike: (id: string) => void
  toggleReplyLike: (id: string, replyIndex: number) => void
}

const MessagesContext = createContext<MessagesContextValue | null>(null)

function migrateData(raw: unknown): Message[] {
  if (!Array.isArray(raw)) return []
  return raw.map((item: Record<string, unknown>) => {
    let replies: Reply[] = []
    if (Array.isArray(item.replies)) {
      replies = item.replies as Reply[]
    } else if (item.reply && typeof item.reply === 'object') {
      replies = [item.reply as Reply]
    }

    // ensure every reply has likes
    replies = replies.map((r: Record<string, unknown>) =>
      typeof r.likes === 'number' ? (r as Reply) : { ...r, likes: 0 } as Reply
    )

    return {
      ...item,
      likes: typeof item.likes === 'number' ? item.likes : 0,
      replies,
      reply: undefined,
    } as Message
  })
}

function loadMessages(): Message[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw)
      const migrated = migrateData(parsed)
      if (migrated.length > 0) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(migrated))
        return migrated
      }
    }
  } catch {
    // corrupted data, start fresh
  }
  return seedMessages()
}

function rnd(n: number) { return Math.floor(Math.random() * n) + 1 }

function seedMessages(): Message[] {
  const now = new Date()
  const d = (hours: number) => new Date(now.getTime() - 3600000 * hours).toISOString()
  return [
    // ===== 小学生问 → 大学生答 =====
    {
      id: 's01',
      type: 'primary',
      senderName: '不敢说名字的小雨',
      title: '考不好怎么办',
      content: '考不好怎么办？妈妈总骂我。我已经很努力了，可是分数还是上不去……是不是我不够聪明？',
      createdAt: d(72),
      likes: rnd(10),
      replies: [{
        type: 'college',
        senderName: '天大学长',
        content: '你已经很棒了，长大就自由了。没关系的，下次努力就好，哥哥以前也考不好。分数不能定义你，努力的过程比结果重要得多。',
        createdAt: d(71),
        likes: rnd(10),
      }],
    },
    {
      id: 's02',
      type: 'primary',
      senderName: '作业堆成山的小明',
      title: '作业太多写不完怎么办',
      content: '每天晚上写到十点还写不完，我都想哭了。为什么老师要布置这么多作业？',
      createdAt: d(68),
      likes: rnd(10),
      replies: [{
        type: 'college',
        senderName: '温柔学姐',
        content: '慢慢写，写完一项就少一项，总会写完的。试着把大作业拆成小块，做一个划掉一个，很有成就感哦！',
        createdAt: d(67),
        likes: rnd(10),
      }],
    },
    {
      id: 's03',
      type: 'primary',
      senderName: '好奇宝宝小星',
      title: '天空离地面有多远',
      content: '我抬头看天，觉得好高好高。天空到底离地面有多远呀？是不是坐飞机就能摸到？',
      createdAt: d(64),
      likes: rnd(10),
      replies: [{
        type: 'college',
        senderName: '兰大学长',
        content: '风筝能飞多高，天空就离地面有多远。等你长大，答案会变得不一样，但现在——天空就在你的想象力里。',
        createdAt: d(63),
        likes: rnd(10),
      }],
    },
    {
      id: 's04',
      type: 'primary',
      senderName: '想玩到天亮的朵朵',
      title: '为什么不能一直玩',
      content: '我最喜欢玩了！为什么大人总是说"先去写作业"，为什么不能一直玩一直玩？',
      createdAt: d(60),
      likes: rnd(10),
      replies: [{
        type: 'college',
        senderName: '过来人姐姐',
        content: '因为玩完了还是要面对作业呀，但你可以边玩边开心！学习和玩都重要，找到平衡，你会发现写作业的时候想着待会能玩，也会很快乐的。',
        createdAt: d(59),
        likes: rnd(10),
      }],
    },
    {
      id: 's05',
      type: 'primary',
      senderName: '想交朋友的小凯',
      title: '如何让同学跟自己关系更好',
      content: '我们班有几个同学总是一起玩，我也想去，但他们好像不太理我。怎样才能和同学关系更好？',
      createdAt: d(56),
      likes: rnd(10),
      replies: [{
        type: 'college',
        senderName: '暖心学姐',
        content: '真诚对待，用心去爱。不用刻意讨好，做你自己就好。主动打个招呼、分享一颗糖、借一支笔——友情往往就从小事开始。',
        createdAt: d(55),
        likes: rnd(10),
      }],
    },
    {
      id: 's06',
      type: 'primary',
      senderName: '和同桌吵架的小宁',
      title: '和同学有冲突怎么办',
      content: '我跟同桌因为一块橡皮吵架了，现在谁也不理谁。我有点难过，但又不知道怎么开口。',
      createdAt: d(52),
      likes: rnd(10),
      replies: [{
        type: 'college',
        senderName: '调解大师',
        content: '试着聊一聊。如果不行，就先冷静一下。明天带一颗糖给她，说"昨天的事我也有不对"，你会发现朋友比橡皮重要。',
        createdAt: d(51),
        likes: rnd(10),
      }],
    },
    {
      id: 's07',
      type: 'primary',
      senderName: '想赚钱的小胖',
      title: '为什么十八岁才能工作',
      content: '我想买玩具但是妈妈说没钱。为什么我不能自己赚钱？为什么要等十八岁才能工作？',
      createdAt: d(48),
      likes: rnd(10),
      replies: [{
        type: 'college',
        senderName: '兰大学姐',
        content: '因为小孩子只需要负责快乐。长大的烦恼让大人去操心吧，你现在最重要的"工作"就是好好长大。',
        createdAt: d(47),
        likes: rnd(10),
      }],
    },
    {
      id: 's08',
      type: 'primary',
      senderName: '好奇少年小晨',
      title: '工作了就没有作业了吗',
      content: '妈妈每天下班回来还要做"工作上的作业"，她说那不是作业。工作了就没有作业了吗？',
      createdAt: d(44),
      likes: rnd(10),
      replies: [{
        type: 'college',
        senderName: '打工人学姐',
        content: '不是没有作业，是作业换了马甲，叫"责任"。小朋友的作业叫数学语文，大人的作业叫项目报告。各有各的累，也各有各的快乐。',
        createdAt: d(43),
        likes: rnd(10),
      }],
    },
    // ===== 大学生问 → 小学生答 =====
    {
      id: 's09',
      type: 'college',
      senderName: '不想长大的大二学长',
      title: '怎么能慢点长大？',
      content: '大学快毕业了，感觉时间越来越快。怎么才能让它慢一点？怎么才能慢点长大？',
      createdAt: d(42),
      likes: rnd(10),
      replies: [{
        type: 'primary',
        senderName: '四字箴言小朋友',
        content: '享受当下。',
        createdAt: d(41),
        likes: rnd(10),
      }],
    },
    {
      id: 's10',
      type: 'college',
      senderName: '迷茫的大三学姐',
      title: '幸福是什么？',
      content: '最近一直在想，幸福到底是什么？是赚很多钱吗？是找到好工作吗？还是别的什么？',
      createdAt: d(38),
      likes: rnd(10),
      replies: [{
        type: 'primary',
        senderName: '智慧的小朋友',
        content: '拥有苹果的时候，只想着苹果。还可以加牛奶，变成苹果汁！幸福就是拥有苹果时只想着苹果~',
        createdAt: d(37),
        likes: rnd(10),
      }],
    },
    {
      id: 's11',
      type: 'college',
      senderName: '心情低落的大一生',
      title: '找不到快乐了怎么办',
      content: '最近觉得很丧，什么事都提不起劲来。找不到快乐了怎么办？',
      createdAt: d(34),
      likes: rnd(10),
      replies: [{
        type: 'primary',
        senderName: '小猪佩奇粉丝',
        content: '你看看《小猪佩奇》。不开心的时候……我去抱抱妈妈。',
        createdAt: d(33),
        likes: rnd(10),
      }],
    },
    {
      id: 's12',
      type: 'college',
      senderName: '失眠的考研党',
      title: '有时候觉得活着好累',
      content: '考研压力、论文压力、找工作的压力……有时候觉得活着好累怎么办？',
      createdAt: d(30),
      likes: rnd(10),
      replies: [{
        type: 'primary',
        senderName: '一个聪明小孩',
        content: '睡觉。',
        createdAt: d(29),
        likes: rnd(10),
      }],
    },
    {
      id: 's13',
      type: 'college',
      senderName: '哲学爱好者',
      title: '人生的意义是什么',
      content: '看了很多书，想了很多问题，人生的意义到底是什么？我们为什么活着？',
      createdAt: d(26),
      likes: rnd(10),
      replies: [{
        type: 'primary',
        senderName: '快乐哲学家',
        content: '看《小猪佩奇》。',
        createdAt: d(25),
        likes: rnd(10),
      }],
    },
    {
      id: 's14',
      type: 'college',
      senderName: '缺乏自信的阿杰',
      title: '怎样才能有自信',
      content: '总是觉得自己不够好，总在意别人的眼光。怎样拥有勇气和自信？怎样去接纳自己的不足？',
      createdAt: d(22),
      likes: rnd(10),
      replies: [{
        type: 'primary',
        senderName: '暖心小天使',
        content: '再长大点就好啦。你已经很棒了！失败了怎么办？再试一次就好了呀。',
        createdAt: d(21),
        likes: rnd(10),
      }],
    },
    {
      id: 's15',
      type: 'college',
      senderName: '社交困难的小叶',
      title: '越长大越难交朋友',
      content: '小学的时候和谁都能玩到一起。为什么越长大，交朋友变得越难？是我变了吗？',
      createdAt: d(18),
      likes: rnd(10),
      replies: [{
        type: 'primary',
        senderName: '通透的小朋友',
        content: '因为你们想太多了，一起玩就成朋友了呀。',
        createdAt: d(17),
        likes: rnd(10),
      }],
    },
    // ===== 中学生 → 大学生 =====
    {
      id: 's16',
      type: 'college',
      senderName: '怕物理的高中生',
      title: '物理怎么对我好一点',
      content: '物理真的好难啊，每次考试都拖后腿。物理怎么才能对我好一点！',
      createdAt: d(14),
      likes: rnd(10),
      replies: [{
        type: 'college',
        senderName: '过来人学长',
        content: '很多事情都是相互的，要不先尝试对物理好一点。先别怕它，慢慢来。每天多花半小时，你会发现它没那么可怕。',
        createdAt: d(13),
        likes: rnd(10),
      }],
    },
    {
      id: 's17',
      type: 'college',
      senderName: '疲惫的高三党',
      title: '高中三年累吗',
      content: '我现在高二，每天只睡五六个小时。高中三年到底有多累？考上大学真的就轻松了吗？',
      createdAt: d(10),
      likes: rnd(10),
      replies: [{
        type: 'college',
        senderName: '天大学长',
        content: '超累。但考上大学确实会轻松一些——也别太放松，找到自己喜欢的事最重要。苦心人天不负，三千越甲可吞吴。加油！',
        createdAt: d(9),
        likes: rnd(10),
      }],
    },
    {
      id: 's18',
      type: 'college',
      senderName: '思考人生的大四生',
      title: '你想有一个什么样的人生',
      content: '站在毕业的路口回头看，我好像一直在为了"应该"而活。你想有一个什么样的人生？',
      createdAt: d(5),
      likes: rnd(10),
      replies: [{
        type: 'primary',
        senderName: '阳光小朋友',
        content: '每天都开心的那种！像你现在这样，充满好奇的人生。',
        createdAt: d(4),
        likes: rnd(10),
      }],
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

  const addMessage = (msg: Omit<Message, 'id' | 'createdAt' | 'replies' | 'likes'>) => {
    const newMsg: Message = {
      ...msg,
      id: Date.now().toString(36) + Math.random().toString(36).slice(2, 7),
      createdAt: new Date().toISOString(),
      likes: 0,
      replies: [],
    }
    setMessages(prev => [newMsg, ...prev])
  }

  const addReply = (id: string, reply: Omit<Reply, 'createdAt' | 'likes'>) => {
    setMessages(prev =>
      prev.map(m =>
        m.id === id
          ? { ...m, replies: [...m.replies, { ...reply, likes: 0, createdAt: new Date().toISOString() }] }
          : m
      )
    )
  }

  const toggleLike = (id: string) => {
    setMessages(prev =>
      prev.map(m =>
        m.id === id ? { ...m, likes: m.likes + 1 } : m
      )
    )
  }

  const toggleReplyLike = (id: string, replyIndex: number) => {
    setMessages(prev =>
      prev.map(m =>
        m.id === id
          ? {
              ...m,
              replies: m.replies.map((r, i) =>
                i === replyIndex ? { ...r, likes: r.likes + 1 } : r
              ),
            }
          : m
      )
    )
  }

  return (
    <MessagesContext.Provider value={{ messages, addMessage, addReply, toggleLike, toggleReplyLike }}>
      {children}
    </MessagesContext.Provider>
  )
}

export function useMessages() {
  const ctx = useContext(MessagesContext)
  if (!ctx) throw new Error('useMessages must be used within MessagesProvider')
  return ctx
}
