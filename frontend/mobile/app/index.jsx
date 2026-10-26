import { motion } from 'motion/react'
import PrimaryButton from '../components/PrimaryButton'
import './index.css'

export default function SplashPage({ onGetStarted }) {
  return (
    <div className="splash" id="splash-page">
      {/* Background pattern */}
      <div className="splash__bg">
        <div className="splash__bg-circle splash__bg-circle--1"></div>
        <div className="splash__bg-circle splash__bg-circle--2"></div>
      </div>

      <div className="splash__content">
        <motion.div
          className="splash__logo-area"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          <div className="splash__logo-box">
            <span className="splash__logo-name">Magmay's</span>
            <span className="splash__logo-tagline">KITCHEN</span>
          </div>
        </motion.div>

        <motion.p
          className="splash__subtitle"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          Fresh Meals • Great Flavours • Always
        </motion.p>

        <motion.div
          className="splash__cta"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.5 }}
        >
          <PrimaryButton
            onClick={onGetStarted}
            size="lg"
            fullWidth={false}
            id="splash-get-started-btn"
          >
            Get Started
          </PrimaryButton>
        </motion.div>
      </div>
    </div>
  )
}