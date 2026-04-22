import { useCallback, useState } from 'react'

type ChatInputProps = {
  canSend: boolean
  onSend: (text: string) => void
  onTyping: () => void
}

export function ChatInput({ canSend, onSend, onTyping }: ChatInputProps) {
  const [text, setText] = useState('')

  const handleSend = useCallback(() => {
    const trimmed = text.trim()
    if (!trimmed) return
    onSend(trimmed)
    setText('')
  }, [onSend, text])

  return (
    <div className="chatInput">
      <input
        className="chatInputField"
        type="text"
        value={text}
        placeholder={canSend ? 'Type a message…' : 'Connecting…'}
        onChange={(e) => {
          setText(e.target.value)
          onTyping()
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            handleSend()
          }
        }}
        disabled={!canSend}
        aria-label="Message input"
      />
      <button
        className="chatSendButton"
        type="button"
        onClick={handleSend}
        disabled={!canSend || text.trim().length === 0}
      >
        Send
      </button>
    </div>
  )
}

