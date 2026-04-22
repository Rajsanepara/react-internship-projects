import type { ConnectionStatus } from '../types/message'

type StatusBarProps = {
  status: ConnectionStatus
  errorMessage: string | null
  onReconnect: () => void
}

const STATUS_LABEL: Record<ConnectionStatus, string> = {
  connecting: 'Connecting',
  open: 'Open',
  closed: 'Closed',
  error: 'Error',
}

export function StatusBar({ status, errorMessage, onReconnect }: StatusBarProps) {
  const showReconnect = status === 'closed' || status === 'error'

  return (
    <div className="statusBar" role="status" aria-live="polite">
      <span className={`statusDot statusDot--${status}`} aria-hidden="true" />
      <span className="statusText">{STATUS_LABEL[status]}</span>
      {errorMessage ? <span className="statusErrorText">• {errorMessage}</span> : null}
      {showReconnect ? (
        <button className="statusReconnectButton" type="button" onClick={onReconnect}>
          Reconnect
        </button>
      ) : null}
    </div>
  )
}

