import type { RefObject } from 'react'
import { MessageBubble } from './MessageBubble'
import type { Message } from '../types/message'

export type MessageGroup = {
  dateLabel: string
  messages: Message[]
}

type MessageListProps = {
  groups: MessageGroup[]
  bottomRef: RefObject<HTMLDivElement | null>
  showTypingIndicator: boolean
}

export function MessageList({ groups, bottomRef, showTypingIndicator }: MessageListProps) {
  return (
    <div className="messageList" role="log" aria-live="polite" aria-relevant="additions">
      {groups.map((group) => (
        <div key={group.dateLabel} className="messageGroup">
          <div className="dateDivider">
            <span className="dateDividerLabel">{group.dateLabel}</span>
          </div>
          {group.messages.map((message) => (
            <MessageBubble key={message.id} message={message} />
          ))}
        </div>
      ))}

      {showTypingIndicator ? <div className="typingIndicator">typing...</div> : null}

      <div ref={bottomRef} />
    </div>
  )
}

