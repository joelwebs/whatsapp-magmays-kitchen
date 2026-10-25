
import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { MapPin, Navigation } from 'lucide-react'
import Header from '../components/Header'
import PrimaryButton from '../components/PrimaryButton'
import LoadingState, { ErrorState } from '../components/LoadingState'
import { useCart } from '../context/useCart'
import { getDeliveryLocations } from '../services/api'
import { toast } from 'sonner'
import './location.css'

export default function LocationPage({ onNavigate }) {
  const [locations, setLocations] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [manualSelectedId, setManualSelectedId] = useState(null)
  const [step, setStep] = useState('select')
  const [manualAddress, setManualAddress] = useState('')
  const [manualDirection, setManualDirection] = useState('')
  const [showGpsModal, setShowGpsModal] = useState(false)

  const {
    setDeliveryLocation,
    setCustomerLocation,
    deliveryLocation,
  } = useCart()

  // Derive the selected location rather than synchronizing duplicate state
  // through an effect.
  const selectedId = manualSelectedId ?? deliveryLocation?.id ?? null

  const loadLocations = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const data = await getDeliveryLocations()
      setLocations(Array.isArray(data) ? data : data?.results ?? [])
    } catch (err) {
      setError(err.message || 'Failed to load locations')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
  const timer = setTimeout(() => {
    loadLocations()
  }, 0)

  return () => clearTimeout(timer)
}, [loadLocations])

  function handleSelect(loc) {
    setManualSelectedId(loc.id)
    setDeliveryLocation(loc)
  }

  function handleChangeLocation() {
    setManualSelectedId(null)
    setDeliveryLocation(null)
  }

  function handleConfirm() {
    if (!selectedId) {
      toast.error('Please select a delivery location')
      return
    }

    onNavigate('checkout')
  }

  function handleUseGps() {
    setShowGpsModal(true)
  }

  function handleAllowLocation() {
    setShowGpsModal(false)

    if (!('geolocation' in navigator)) {
      toast.error('Geolocation is not supported')
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords
        const url = `https://maps.google.com/?q=${latitude},${longitude}`

        setCustomerLocation(url)
        toast.success('Location captured!')
      },
      () => {
        toast.error('Could not get your location. Please enter it manually.')
      },
      {
        enableHighAccuracy: false,
        timeout: 10000,
        maximumAge: 60000,
      }
    )
  }

  function handleManualEntry() {
    setStep('manual')
  }

  function handleSaveManual() {
    if (!manualAddress.trim()) {
      toast.error('Please enter an address')
      return
    }

    const address = `${manualAddress.trim()}${
      manualDirection.trim() ? ` (${manualDirection.trim()})` : ''
    }`

    setCustomerLocation(address)
    toast.success('Address saved!')
    setStep('select')
  }

  const selected = locations.find(
    (location) => String(location.id) === String(selectedId)
  )

  if (loading) {
    return <LoadingState message="Loading locations..." />
  }

  if (error) {
    return <ErrorState message={error} onRetry={loadLocations} />
  }

  if (step === 'manual') {
    return (
      <div className="location-page" id="location-manual-page">
        <Header
          title="Enter Location"
          showBack
          onBack={() => setStep('select')}
        />

        <div className="location-page__manual">
          <div className="location-page__field">
            <label
              className="location-page__label"
              htmlFor="location-manual-address"
            >
              Address / Hall
            </label>

            <input
              type="text"
              className="location-page__input"
              placeholder="e.g. Hall B, University of Ghana"
              value={manualAddress}
              onChange={(event) => setManualAddress(event.target.value)}
              id="location-manual-address"
            />
          </div>

          <div className="location-page__field">
            <label
              className="location-page__label"
              htmlFor="location-manual-direction"
            >
              Direction (optional)
            </label>

            <textarea
              className="location-page__textarea"
              placeholder="Any specific directions?"
              value={manualDirection}
              onChange={(event) => setManualDirection(event.target.value)}
              rows={3}
              id="location-manual-direction"
            />
          </div>

          <PrimaryButton
            onClick={handleSaveManual}
            size="lg"
            id="location-save-btn"
          >
            Save Location
          </PrimaryButton>
        </div>
      </div>
    )
  }

  return (
    <div className="location-page" id="location-page">
      <Header
        title="Delivery Location"
        showBack
        onBack={() => onNavigate('checkout')}
      />

      <div className="location-page__content">
        <button
          type="button"
          className="location-page__gps-btn"
          onClick={handleUseGps}
          id="location-gps-btn"
        >
          <Navigation size={18} className="location-page__gps-icon" />

          <div className="location-page__gps-text">
            <span className="location-page__gps-title">
              Use my current location
            </span>
            <span className="location-page__gps-sub">
              Get my GPS location
            </span>
          </div>
        </button>

        <div className="location-page__divider">
          <span>Or select a hall</span>
        </div>

        <div className="location-page__list">
          {locations.map((loc) => {
            const isSelected =
              String(selectedId) === String(loc.id)
            const isFree = Number(loc.delivery_fee) === 0

            return (
              <motion.button
                type="button"
                key={loc.id}
                className={`location-page__item ${
                  isSelected ? 'location-page__item--active' : ''
                }`}
                onClick={() => handleSelect(loc)}
                whileTap={{ scale: 0.98 }}
                id={`location-item-${loc.id}`}
              >
                <div className="location-page__item-radio">
                  {isSelected && (
                    <div className="location-page__item-radio-dot" />
                  )}
                </div>

                <div className="location-page__item-info">
                  <span className="location-page__item-name">
                    {loc.name}
                  </span>

                  <span className="location-page__item-fee">
                    {isFree
                      ? 'Free Delivery'
                      : `GH₵${Number(loc.delivery_fee).toFixed(2)}`}
                  </span>
                </div>

                {isFree && (
                  <span className="location-page__item-badge">
                    Free
                  </span>
                )}
              </motion.button>
            )
          })}
        </div>

        <button
          type="button"
          className="location-page__manual-btn"
          onClick={handleManualEntry}
          id="location-manual-entry-btn"
        >
          <MapPin size={16} />
          Enter location manually
        </button>

        {selected && (
          <motion.div
            className="location-page__confirm"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="location-page__selected">
              <span className="location-page__selected-label">
                Selected Location
              </span>

              <div className="location-page__selected-info">
                <MapPin
                  size={16}
                  className="location-page__selected-icon"
                />

                <span className="location-page__selected-name">
                  {selected.name}
                </span>

                <button
                  type="button"
                  className="location-page__change-btn"
                  onClick={handleChangeLocation}
                >
                  Change
                </button>
              </div>

              <div className="location-page__selected-fee-row">
                <span>Delivery Fee</span>

                <span className="location-page__selected-fee">
                  {Number(selected.delivery_fee) === 0
                    ? 'Free'
                    : `GH₵${Number(selected.delivery_fee).toFixed(2)}`}
                </span>
              </div>
            </div>

            <PrimaryButton
              onClick={handleConfirm}
              size="lg"
              id="location-continue-btn"
            >
              Continue
            </PrimaryButton>
          </motion.div>
        )}
      </div>

      <AnimatePresence>
        {showGpsModal && (
          <motion.div
            className="location-page__modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowGpsModal(false)}
          >
            <motion.div
              className="location-page__modal"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(event) => event.stopPropagation()}
            >
              <div className="location-page__modal-icon">
                <MapPin size={32} />
              </div>

              <h3 className="location-page__modal-title">
                Allow Location Access
              </h3>

              <p className="location-page__modal-text">
                We use your location to add a map link to your order.
                You can also enter your address manually.
              </p>

              <PrimaryButton
                onClick={handleAllowLocation}
                size="md"
                id="location-allow-btn"
              >
                Allow Location
              </PrimaryButton>

              <button
                type="button"
                className="location-page__modal-later"
                onClick={() => setShowGpsModal(false)}
              >
                Maybe Later
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
