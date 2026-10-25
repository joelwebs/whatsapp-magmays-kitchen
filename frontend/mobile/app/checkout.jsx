import { useState, useEffect } from 'react'
import { motion } from 'motion/react'
import {
  MapPin,
  Minus,
  Plus,
  Trash2,
  CheckCircle,
  ExternalLink,
} from 'lucide-react'
import Header from '../components/Header'
import PrimaryButton from '../components/PrimaryButton'
import { EmptyState } from '../components/LoadingState'
import { useCart } from '../context/useCart'
import { getBusiness } from '../services/api'
import { sendWhatsAppOrder } from '../services/whatsapp'
import { toast } from 'sonner'
import './checkout.css'

export default function CheckoutPage({ onNavigate }) {
  const {
    items,
    subtotal,
    deliveryFee,
    total,
    deliveryLocation,
    customerLocation,
    orderType,
    updateQuantity,
    setOrderType,
  } = useCart()

  const [business, setBusiness] = useState(null)
  const [customerName, setCustomerName] = useState('')
  const [phone, setPhone] = useState('')
  const [notes, setNotes] = useState('')
  const [step, setStep] = useState('checkout') // 'checkout' | 'preview'
  const [errors, setErrors] = useState({})

  const API_BASE_URL =
    import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api/v1'
  const baseUrl = API_BASE_URL.replace('/api/v1', '')

  useEffect(() => {
    getBusiness()
      .then(setBusiness)
      .catch(() => {})
  }, [])

  function validate() {
    const errs = {}
    if (!customerName.trim()) errs.name = 'Name is required'
    if (!phone.trim()) errs.phone = 'Phone number is required'
    if (orderType === 'delivery' && !deliveryLocation)
      errs.location = 'Please select a delivery location'
    if (items.length === 0) errs.items = 'Your cart is empty'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  function handleContinue() {
    if (!validate()) {
      const firstError = Object.values(errors)[0]
      if (firstError) toast.error(firstError)
      return
    }
    setStep('preview')
  }

  function handleSendWhatsApp() {
    if (!business) {
      toast.error('Business info not loaded yet')
      return
    }
    try {
      sendWhatsAppOrder({
        business,
        items,
        customerName: customerName.trim(),
        phone: phone.trim(),
        location: deliveryLocation?.name || 'Pickup',
        address: customerLocation || '',
        deliveryFee,
        notes: notes.trim(),
      })
    } catch (err) {
      toast.error(err.message)
    }
  }

  function getImageUrl(food) {
    if (!food.image_url) return null
    return food.image_url.startsWith('http')
      ? food.image_url
      : `${baseUrl}${food.image_url}`
  }

  // Empty cart
  if (items.length === 0 && step === 'checkout') {
    return (
      <div className="checkout" id="checkout-page-empty">
        <Header
          title="Checkout"
          showBack
          onBack={() => onNavigate('home')}
        />
        <EmptyState message="Your cart is empty" icon="🛒" />
        <div className="checkout__empty-action">
          <PrimaryButton
            onClick={() => onNavigate('menu')}
            variant="outline"
            id="checkout-browse-btn"
          >
            Browse Menu
          </PrimaryButton>
        </div>
      </div>
    )
  }

  // Order Preview (Screen 10)
  if (step === 'preview') {
    return (
      <div className="checkout checkout--preview" id="checkout-preview-page">
        <Header
          title="Order Ready!"
          showBack
          onBack={() => setStep('checkout')}
        />
        <div className="checkout__preview-content">
          <motion.div
            className="checkout__preview-header"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
          >
            <div className="checkout__preview-check">
              <CheckCircle size={48} />
            </div>
            <p className="checkout__preview-note">
              Your order details will be sent to Magmay's Kitchen on WhatsApp.
            </p>
          </motion.div>

          <div className="checkout__summary-card">
            <h3 className="checkout__summary-title">Order Summary</h3>
            {items.map((item) => (
              <div key={item.id} className="checkout__summary-row">
                <span className="checkout__summary-item-name">
                  {item.name}
                </span>
                <span className="checkout__summary-item-qty">
                  x{item.quantity}
                </span>
                <span className="checkout__summary-item-price">
                  GH₵{(Number(item.price) * item.quantity).toFixed(2)}
                </span>
              </div>
            ))}

            <div className="checkout__summary-divider" />

            <div className="checkout__summary-row">
              <span>Subtotal</span>
              <span>GH₵{subtotal.toFixed(2)}</span>
            </div>
            <div className="checkout__summary-row">
              <span>Delivery Fee</span>
              <span>GH₵{deliveryFee.toFixed(2)}</span>
            </div>
            <div className="checkout__summary-row checkout__summary-row--total">
              <span>Total</span>
              <span>GH₵{total.toFixed(2)}</span>
            </div>
          </div>

          {orderType === 'delivery' && deliveryLocation && (
            <div className="checkout__preview-info">
              <MapPin size={16} />
              <div>
                <p className="checkout__preview-info-label">
                  Delivery Location
                </p>
                <p className="checkout__preview-info-value">
                  {deliveryLocation.name}
                  {Number(deliveryLocation.delivery_fee) === 0 &&
                    ' (Free Delivery)'}
                </p>
              </div>
            </div>
          )}

          {customerLocation && (
            <div className="checkout__preview-info">
              <MapPin size={16} />
              <div>
                <p className="checkout__preview-info-label">
                  Customer Location
                </p>
                {customerLocation.startsWith('http') ? (
                  <a
                    href={customerLocation}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="checkout__preview-link"
                  >
                    {customerLocation}
                    <ExternalLink size={12} />
                  </a>
                ) : (
                  <p className="checkout__preview-info-value">
                    {customerLocation}
                  </p>
                )}
              </div>
            </div>
          )}

          <p className="checkout__preview-redirect">
            You will be redirected to WhatsApp to send your order.
          </p>

          <PrimaryButton
            onClick={handleSendWhatsApp}
            size="lg"
            id="checkout-whatsapp-btn"
            icon={
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
            }
          >
            Open WhatsApp
          </PrimaryButton>
        </div>
      </div>
    )
  }

  // Main Checkout (Screen 7)
  return (
    <div className="checkout" id="checkout-page">
      <Header
        title="Checkout"
        showBack
        onBack={() => onNavigate('menu')}
      />

      <div className="checkout__content">
        {/* Order Type Toggle */}
        <div className="checkout__section">
          <h3 className="checkout__section-title">Order Type</h3>
          <div className="checkout__toggle">
            <button
              className={`checkout__toggle-btn ${orderType === 'delivery' ? 'checkout__toggle-btn--active' : ''}`}
              onClick={() => setOrderType('delivery')}
              id="checkout-type-delivery"
            >
              Delivery
            </button>
            <button
              className={`checkout__toggle-btn ${orderType === 'pickup' ? 'checkout__toggle-btn--active' : ''}`}
              onClick={() => setOrderType('pickup')}
              id="checkout-type-pickup"
            >
              Pickup
            </button>
          </div>
        </div>

        {/* Customer Info */}
        <div className="checkout__section">
          <h3 className="checkout__section-title">Your Details</h3>
          <div className="checkout__field">
            <input
              type="text"
              className={`checkout__input ${errors.name ? 'checkout__input--error' : ''}`}
              placeholder="Your name"
              value={customerName}
              onChange={(e) => {
                setCustomerName(e.target.value)
                setErrors((prev) => ({ ...prev, name: null }))
              }}
              id="checkout-name-input"
            />
          </div>
          <div className="checkout__field">
            <input
              type="tel"
              className={`checkout__input ${errors.phone ? 'checkout__input--error' : ''}`}
              placeholder="Phone number"
              value={phone}
              onChange={(e) => {
                setPhone(e.target.value)
                setErrors((prev) => ({ ...prev, phone: null }))
              }}
              id="checkout-phone-input"
            />
          </div>
        </div>

        {/* Delivery Location */}
        {orderType === 'delivery' && (
          <div className="checkout__section">
            <h3 className="checkout__section-title">Delivery Location</h3>
            {deliveryLocation ? (
              <div className="checkout__location-card">
                <MapPin size={16} className="checkout__location-icon" />
                <div className="checkout__location-info">
                  <span className="checkout__location-name">
                    {deliveryLocation.name}
                  </span>
                  <span className="checkout__location-fee">
                    {Number(deliveryLocation.delivery_fee) === 0
                      ? 'Free Delivery'
                      : `GH₵${Number(deliveryLocation.delivery_fee).toFixed(2)}`}
                  </span>
                </div>
                <button
                  className="checkout__location-change"
                  onClick={() => onNavigate('location')}
                >
                  Change
                </button>
              </div>
            ) : (
              <button
                className={`checkout__location-select ${errors.location ? 'checkout__location-select--error' : ''}`}
                onClick={() => onNavigate('location')}
                id="checkout-select-location-btn"
              >
                <MapPin size={16} />
                Select delivery location
              </button>
            )}
          </div>
        )}

        {/* Order Summary */}
        <div className="checkout__section">
          <h3 className="checkout__section-title">Order Summary</h3>
          <div className="checkout__items">
            {items.map((item) => (
              <div key={item.id} className="checkout__item">
                <div className="checkout__item-img-wrap">
                  {getImageUrl(item) ? (
                    <img
                      src={getImageUrl(item)}
                      alt={item.name}
                      className="checkout__item-img"
                    />
                  ) : (
                    <div className="checkout__item-img-placeholder">🍽️</div>
                  )}
                </div>
                <div className="checkout__item-info">
                  <span className="checkout__item-name">{item.name}</span>
                  <span className="checkout__item-price">
                    GH₵{(Number(item.price) * item.quantity).toFixed(2)}
                  </span>
                </div>
                <div className="checkout__item-qty">
                  <button
                    className="checkout__qty-btn"
                    onClick={() =>
                      updateQuantity(item.id, item.quantity - 1)
                    }
                    aria-label="Decrease"
                  >
                    {item.quantity === 1 ? (
                      <Trash2 size={14} />
                    ) : (
                      <Minus size={14} />
                    )}
                  </button>
                  <span className="checkout__qty-val">{item.quantity}</span>
                  <button
                    className="checkout__qty-btn"
                    onClick={() =>
                      updateQuantity(item.id, item.quantity + 1)
                    }
                    aria-label="Increase"
                  >
                    <Plus size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Notes */}
        <div className="checkout__section">
          <textarea
            className="checkout__notes"
            placeholder="Any special instructions? (optional)"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={2}
            id="checkout-notes-input"
          />
        </div>

        {/* Totals */}
        <div className="checkout__totals">
          <div className="checkout__total-row">
            <span>Subtotal</span>
            <span>GH₵{subtotal.toFixed(2)}</span>
          </div>
          <div className="checkout__total-row">
            <span>Delivery Fee</span>
            <span>GH₵{deliveryFee.toFixed(2)}</span>
          </div>
          <div className="checkout__total-row checkout__total-row--total">
            <span>Total</span>
            <span>GH₵{total.toFixed(2)}</span>
          </div>
        </div>

        {/* CTA */}
        <div className="checkout__action">
          <PrimaryButton
            onClick={handleContinue}
            size="lg"
            id="checkout-continue-btn"
          >
            Continue to WhatsApp
          </PrimaryButton>
        </div>
      </div>
    </div>
  )
}
