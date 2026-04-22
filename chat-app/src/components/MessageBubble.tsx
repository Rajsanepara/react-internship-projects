import type { Message } from '../types/message'

type MessageBubbleProps = {
  message: Message
}

function formatTime(timestamp: number): string {
  return new Intl.DateTimeFormat(undefined, {
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(timestamp))
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.sender === 'user'
  return (
    <div className={`bubbleRow ${isUser ? 'bubbleRow--user' : 'bubbleRow--server'}`}>
      <div className={`bubble ${isUser ? 'bubble--user' : 'bubble--server'}`}>
        <div className="bubbleText">{message.text}</div>
        <div className="bubbleMeta">
          <span className="bubbleSender">{isUser ? 'You' : 'Server'}</span>
          <span className="bubbleTime">{formatTime(message.timestamp)}</span>
        </div>
      </div>
    </div>
  )
}

