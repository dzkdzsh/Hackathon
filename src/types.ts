export type StudentType = 'primary' | 'college'

export interface Reply {
  type: StudentType
  senderName: string
  content: string
  createdAt: string
  likes: number
}

export interface Message {
  id: string
  type: StudentType
  senderName: string
  title: string
  content: string
  createdAt: string
  likes: number
  replies: Reply[]
}
