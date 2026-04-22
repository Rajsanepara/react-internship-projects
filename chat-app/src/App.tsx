import './App.css'
import { useMemo } from 'react'
import { ChatInput } from './components/ChatInput'
import { MessageList, type MessageGroup } from './components/MessageList'
import { StatusBar } from './components/StatusBar'
import { useAutoScroll } from './hooks/useAutoScroll'
import { useTypingIndicator } from './hooks/useTypingIndicator'
import { useWebSocket } from './hooks/useWebSocket'
import type { Message } from './types/message'

const ECHO_SERVER_URL = 'wss://ws.postman-echo.com/raw'

function toDateKey(timestamp: number): string {
  const d = new Date(timestamp)
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

function formatDateLabel(dateKey: string): string {
  const parts = dateKey.split('-')
  const y = Number(parts[0])
  const m = Number(parts[1])
  const d = Number(parts[2])
  if (!Number.isFinite(y) || !Number.isFinite(m) || !Number.isFinite(d)) return dateKey

  const date = new Date(y, m - 1, d)
  return new Intl.DateTimeFormat(undefined, { weekday: 'short', month: 'short', day: '2-digit' }).format(date)
}

function groupMessagesByDate(messages: Message[]): MessageGroup[] {
  const buckets = new Map<string, Message[]>()
  for (const message of messages) {
    const key = toDateKey(message.timestamp)
    const existing = buckets.get(key)
    if (existing) existing.push(message)
    else buckets.set(key, [message])
  }

  const orderedKeys = Array.from(buckets.keys()).sort()
  return orderedKeys.map((key) => ({
    dateLabel: formatDateLabel(key),
    messages: buckets.get(key) ?? [],
  }))
}

function App() {
  const { status, messages, sendMessage, errorMessage, reconnect } = useWebSocket(ECHO_SERVER_URL)
  const { isTyping, notifyTyping } = useTypingIndicator(700)
  const canSend = status === 'open'

  const groups = useMemo(() => groupMessagesByDate(messages), [messages])
  const { bottomRef } = useAutoScroll(messages.length)

  return (
    <div className="appShell">
      <header className="appHeader">
        <div className="appTitle">
          <div className="appTitleText">Real-time Chat (Echo)</div>
          <div className="appSubtitle">WebSocket: {ECHO_SERVER_URL}</div>
        </div>
        <StatusBar status={status} errorMessage={errorMessage} onReconnect={reconnect} />
      </header>

      <main className="appMain">
        <MessageList groups={groups} bottomRef={bottomRef} showTypingIndicator={isTyping} />
      </main>

      <footer className="appFooter">
        <ChatInput
          canSend={canSend}
          onTyping={notifyTyping}
          onSend={(text) => {
            sendMessage(text)
          }}
        />
      </footer>
    </div>
  )
}

export default App
