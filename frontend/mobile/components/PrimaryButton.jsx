import { motion } from 'motion/react'
import './PrimaryButton.css'

export default function PrimaryButton({
  children,
  onClick,
  type = 'button',
  disabled = false,
  variant = 'primary', // 'primary' | 'secondary' | 'outline'
  fullWidth = true,
  size = 'md', // 'sm' | 'md' | 'lg'
  icon,
  id,
  className = '',
}) {
  return (
    <motion.button
      whileTap={{ scale: disabled ? 1 : 0.97 }}
      type={type}
      onClick={onClick}
      disabled={disabled}
      id={id}
      className={`primary-btn primary-btn--${variant} primary-btn--${size} ${fullWidth ? 'primary-btn--full' : ''} ${className}`}
    >
      {icon && <span className="primary-btn__icon">{icon}</span>}
      {children}
    </motion.button>
  )
}
