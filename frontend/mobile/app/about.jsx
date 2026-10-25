import { useState, useEffect } from 'react'
import { motion } from 'motion/react'
import { Phone, Clock, CreditCard } from 'lucide-react'
import { FaWhatsapp } from 'react-icons/fa'
import Header from '../components/Header'
import LoadingState, { ErrorState } from '../components/LoadingState'
import { getBusiness } from '../services/api'
import './about.css'

export default function AboutPage({ onNavigate }) {
  const [business, setBusiness] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    loadBusiness()
  }, [])

  async function loadBusiness() {
    setLoading(true)
    setError(null)
    try {
      const data = await getBusiness()
      setBusiness(data)
    } catch (err) {
      setError(err.message || 'Failed to load business info')
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <LoadingState message="Loading..." />
  if (error) return <ErrorState message={error} onRetry={loadBusiness} />

  return (
    <div className="about" id="about-page">
      <Header
        title="About Us"
        showBack
        onBack={() => onNavigate('home')}
      />

      <div className="about__content">
        {/* Logo & Brand */}
        <motion.div
          className="about__brand"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="about__logo-box">
            <span className="about__logo-name">Magmay's</span>
            <span className="about__logo-sub">KITCHEN</span>
          </div>
          <p className="about__tagline">
            Fresh Meals • Great Flavours • Always
          </p>
        </motion.div>

        {/* Contact */}
        <div className="about__section">
          <h3 className="about__section-title">Contact</h3>
          <div className="about__info-list">
            {business?.phone_number && (
              <a
                href={`tel:${business.phone_number}`}
                className="about__info-item"
              >
                <Phone size={18} className="about__info-icon" />
                <span>{business.phone_number}</span>
              </a>
            )}
            {business?.whatsapp_number && (
              <a
                href={`https://wa.me/${business.whatsapp_number.replace(/\D/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="about__info-item"
              >
                <FaWhatsapp size={18} className="about__info-icon" />
                <span>WhatsApp</span>
              </a>
            )}
          </div>
        </div>

        {/* Mobile Money */}
        <div className="about__section">
          <h3 className="about__section-title">Mobile Money (MoMo)</h3>
          <div className="about__info-list">
            <div className="about__info-item">
              <CreditCard size={18} className="about__info-icon" />
              <div className="about__info-column">
                <span className="about__info-label">Name</span>
                <span className="about__info-value">
                  {business?.name || "Magmay's Kitchen"}
                </span>
              </div>
            </div>
            {business?.phone_number && (
              <div className="about__info-item">
                <Phone size={18} className="about__info-icon" />
                <div className="about__info-column">
                  <span className="about__info-label">Number</span>
                  <span className="about__info-value">
                    {business.phone_number}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Opening Hours */}
        <div className="about__section">
          <h3 className="about__section-title">Opening Hours</h3>
          <div className="about__info-list">
            <div className="about__info-item">
              <Clock size={18} className="about__info-icon" />
              <span>Mon – Sun: 8:00 AM – 10:00 PM</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="about__footer">
          <p>Thank you for supporting</p>
          <p className="about__footer-brand">Magmay's Kitchen!</p>
        </div>
      </div>
    </div>
  )
}
