import { useCallback, useEffect, useRef, useState } from 'react'

type UseTypingIndicatorResult = {
  isTyping: boolean
  notifyTyping: () => void
}

export function useTypingIndicator(delayMs: number): UseTypingIndicatorResult {
  const [isTyping, setIsTyping] = useState(false)
  const timeoutRef = useRef<number | null>(null)

  const notifyTyping = useCallback(() => {
    setIsTyping(true)

    if (timeoutRef.current !== null) {
      window.clearTimeout(timeoutRef.current)
    }

    timeoutRef.current = window.setTimeout(() => {
      setIsTyping(false)
      timeoutRef.current = null
    }, delayMs)
  }, [delayMs])

  useEffect(() => {
    return () => {
      if (timeoutRef.current !== null) {
        window.clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  return { isTyping, notifyTyping }
}

