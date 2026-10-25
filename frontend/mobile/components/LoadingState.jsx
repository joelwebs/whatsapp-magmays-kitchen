import './LoadingState.css'

export default function LoadingState({ message = 'Loading...' }) {
  return (
    <div className="loading-state" id="loading-state">
      <div className="loading-state__spinner">
        <div className="loading-state__dot"></div>
        <div className="loading-state__dot"></div>
        <div className="loading-state__dot"></div>
      </div>
      <p className="loading-state__text">{message}</p>
    </div>
  )
}

export function ErrorState({ message = 'Something went wrong', onRetry }) {
  return (
    <div className="loading-state loading-state--error" id="error-state">
      <p className="loading-state__icon">😕</p>
      <p className="loading-state__text">{message}</p>
      {onRetry && (
        <button className="loading-state__retry" onClick={onRetry}>
          Try Again
        </button>
      )}
    </div>
  )
}

export function EmptyState({ message = 'Nothing here yet', icon = '🍽️' }) {
  return (
    <div className="loading-state loading-state--empty" id="empty-state">
      <p className="loading-state__icon">{icon}</p>
      <p className="loading-state__text">{message}</p>
    </div>
  )
}
