import { useCallback, useEffect, useRef, useState } from 'react'
import type { ConnectionStatus, Message } from '../types/message'

type UseWebSocketResult = {
  status: ConnectionStatus
  messages: Message[]
  errorMessage: string | null
  sendMessage: (text: string) => boolean
  reconnect: () => void
}

function createId(): string {
  // `crypto.randomUUID()` is ideal, but not available in some older environments.
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID()
  }
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`
}

function jitter(ms: number): number {
  // Keep jitter deterministic-ish and bounded.
  const factor = 0.2
  const delta = ms * factor
  return Math.max(0, Math.round(ms - delta + Math.random() * (2 * delta)))
}

export function useWebSocket(url: string): UseWebSocketResult {
  const socketRef = useRef<WebSocket | null>(null)
  const reconnectTimerRef = useRef<number | null>(null)
  const reconnectAttemptRef = useRef(0)
  const shouldReconnectRef = useRef(true)
  const [status, setStatus] = useState<ConnectionStatus>('connecting')
  const [messages, setMessages] = useState<Message[]>([])
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const clearReconnectTimer = useCallback(() => {
    if (reconnectTimerRef.current !== null) {
      window.clearTimeout(reconnectTimerRef.current)
      reconnectTimerRef.current = null
    }
  }, [])

  const closeSocket = useCallback((reason: string) => {
    // `reason` is intentionally unused right now; it documents intent for future analytics/logging.
    void reason
    const socket = socketRef.current
    if (!socket) return

    socket.onopen = null
    socket.onmessage = null
    socket.onerror = null
    socket.onclose = null
    socket.close()
    socketRef.current = null
  }, [])

  const connect = useCallback(() => {
    clearReconnectTimer()
    closeSocket('reconnect')

    setStatus('connecting')
    setErrorMessage(null)

    const socket = new WebSocket(url)
    socketRef.current = socket

    socket.onopen = () => {
      reconnectAttemptRef.current = 0
      setStatus('open')
      setErrorMessage(null)
    }

    socket.onmessage = (event: MessageEvent<unknown>) => {
      const commit = (text: string) => {
        setMessages((prev) => [
          ...prev,
          { id: createId(), text, sender: 'server', timestamp: Date.now() },
        ])
      }

      const { data } = event
      if (typeof data === 'string') {
        commit(data)
        return
      }
      if (data instanceof Blob) {
        void data.text().then(commit).catch(() => {
          // If message payload isn't readable, ignore safely.
        })
      }
    }

    socket.onerror = () => {
      // Browsers intentionally do not provide detailed error reasons for WebSockets.
      setStatus('error')
      setErrorMessage('WebSocket error occurred.')
    }

    socket.onclose = (event: CloseEvent) => {
      setStatus('closed')
      if (event.wasClean) {
        setErrorMessage(null)
      } else {
        setErrorMessage('Connection closed unexpectedly.')
      }

      if (!shouldReconnectRef.current) return

      // Exponential backoff with jitter; capped to avoid runaway waits.
      const attempt = reconnectAttemptRef.current + 1
      reconnectAttemptRef.current = attempt

      const baseMs = 400
      const maxMs = 8000
      const delayMs = jitter(Math.min(maxMs, baseMs * 2 ** Math.min(6, attempt)))

      reconnectTimerRef.current = window.setTimeout(() => {
        connect()
      }, delayMs)
    }
  }, [clearReconnectTimer, closeSocket, errorMessage, url])

  useEffect(() => {
    shouldReconnectRef.current = true
    reconnectAttemptRef.current = 0
    connect()

    return () => {
      shouldReconnectRef.current = false
      clearReconnectTimer()
      closeSocket('unmount')
      setStatus('closed')
    }
  }, [clearReconnectTimer, closeSocket, connect])

  const sendMessage = useCallback((rawText: string): boolean => {
    const text = rawText.trim()
    if (!text) {
      setErrorMessage('Message cannot be empty.')
      return false
    }

    const socket = socketRef.current
    if (!socket || socket.readyState !== WebSocket.OPEN) {
      setErrorMessage('Not connected. Please wait for the connection to open.')
      return false
    }

    setMessages((prev) => [
      ...prev,
      { id: createId(), text, sender: 'user', timestamp: Date.now() },
    ])
    socket.send(text)
    return true
  }, [])

  const reconnect = useCallback(() => {
    reconnectAttemptRef.current = 0
    connect()
  }, [connect])

  return { status, messages, errorMessage, sendMessage, reconnect }
}

