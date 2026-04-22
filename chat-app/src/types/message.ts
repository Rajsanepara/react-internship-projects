export type MessageSender = 'user' | 'server'

export type Message = {
  id: string
  text: string
  sender: MessageSender
  timestamp: number
}

export type ConnectionStatus = 'connecting' | 'open' | 'closed' | 'error'

