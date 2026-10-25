
import { useEffect, useState } from 'react'
import { getBusiness, getDeliveryLocations } from '../../services/api'
import './settings.css'

export default function Settings() {
  const [business, setBusiness] = useState(null)
  const [locations, setLocations] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true

    Promise.all([getBusiness(), getDeliveryLocations()])
      .then(([businessData, locationData]) => {
        if (!active) return

        setBusiness(
          Array.isArray(businessData)
            ? businessData[0] ?? null
            : businessData?.results?.[0] ?? businessData?.data ?? businessData
        )

        setLocations(
          Array.isArray(locationData)
            ? locationData
            : locationData?.results ?? locationData?.data ?? []
        )
      })
      .catch((err) => {
        if (active) setError(err.message || 'Unable to load settings.')
      })
      .finally(() => {
        if (active) setLoading(false)
      })

    return () => {
      active = false
    }
  }, [])

  if (loading) {
    return <main className="settings-page">Loading business settings…</main>
  }

  return (
    <main className="settings-page">
      <header className="settings-header">
        <p className="settings-eyebrow">OWNER WORKSPACE</p>
        <h1>Business settings</h1>
        <p>Review your business details and delivery locations.</p>
      </header>

      {error && <div className="settings-error">{error}</div>}

      <section className="settings-card">
        <div className="settings-card-heading">
          <div>
            <h2>Business profile</h2>
            <p>Current information returned by your Django API.</p>
          </div>
          <span className="settings-readonly">Read only</span>
        </div>

        {business ? (
          <dl className="settings-details">
            <div>
              <dt>Business name</dt>
              <dd>{business.name || business.business_name || '—'}</dd>
            </div>
            <div>
              <dt>Phone</dt>
              <dd>{business.phone || business.phone_number || '—'}</dd>
            </div>
            <div>
              <dt>Email</dt>
              <dd>{business.email || '—'}</dd>
            </div>
            <div>
              <dt>Address</dt>
              <dd>{business.address || business.location || '—'}</dd>
            </div>
            <div>
              <dt>Description</dt>
              <dd>{business.description || '—'}</dd>
            </div>
          </dl>
        ) : (
          <p>No business record was returned by the API.</p>
        )}
      </section>

      <section className="settings-card">
        <div className="settings-card-heading">
          <div>
            <h2>Delivery locations</h2>
            <p>Locations currently available from the backend.</p>
          </div>
          <span className="settings-location-count">
            {locations.length} locations
          </span>
        </div>

        {locations.length === 0 ? (
          <p className="settings-empty">
            No delivery locations were returned.
          </p>
        ) : (
          <ul className="settings-location-list">
            {locations.map((location, index) => (
              <li key={location.id ?? location.pk ?? index}>
                <span className="settings-location-icon">⌖</span>
                <div>
                  <strong>
                    {location.name ||
                      location.area ||
                      location.address ||
                      'Unnamed location'}
                  </strong>
                  {location.description && (
                    <p>{location.description}</p>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  )
}
