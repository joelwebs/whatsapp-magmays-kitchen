import { motion } from 'motion/react'
import { Plus } from 'lucide-react'
import { useCart } from '../context/useCart'
import { toast } from 'sonner'
import './FoodCard.css'

export default function FoodCard({ food, onClick, layout = 'horizontal' }) {
  const API_BASE_URL =
    import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api/v1'

  const baseUrl = API_BASE_URL.replace('/api/v1', '')
  const { addItem } = useCart()

  const imageUrl = food.image_url
    ? food.image_url.startsWith('http')
      ? food.image_url
      : `${baseUrl}${food.image_url}`
    : null

  function handleQuickAdd(e) {
    e.stopPropagation()
    addItem(food, 1)
    toast.success(`${food.name} added!`)
  }

  function handleCardKeyDown(e) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      onClick?.(food)
    }
  }

  const isFeatured = layout === 'featured'

  return (
    <motion.div
      className={`food-card food-card--${layout}`}
      onClick={() => onClick?.(food)}
      onKeyDown={handleCardKeyDown}
      role="button"
      tabIndex={0}
      whileTap={{ scale: isFeatured ? 0.97 : 0.98 }}
      id={`food-card${isFeatured ? '-featured' : ''}-${food.id}`}
    >
      <div
        className={`food-card__img-wrap${
          isFeatured ? ' food-card__img-wrap--featured' : ''
        }`}
      >
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={food.name}
            className="food-card__img"
            loading="lazy"
          />
        ) : (
          <div className="food-card__img-placeholder">🍽️</div>
        )}

        {isFeatured && (
          <button
            type="button"
            className="food-card__quick-add"
            onClick={handleQuickAdd}
            aria-label={`Add ${food.name} to cart`}
          >
            <Plus size={14} strokeWidth={3} />
          </button>
        )}
      </div>

      <div
        className={`food-card__info${
          isFeatured ? ' food-card__info--featured' : ''
        }`}
      >
        <p className="food-card__name">{food.name}</p>

        {!isFeatured && food.description && (
          <p className="food-card__desc">{food.description}</p>
        )}

        <div className="food-card__bottom">
          <p className="food-card__price">
            GH₵{Number(food.price).toFixed(2)}
          </p>

          {!isFeatured && (
            <button
              type="button"
              className="food-card__add-btn"
              onClick={handleQuickAdd}
              aria-label={`Add ${food.name} to cart`}
            >
              <Plus size={14} strokeWidth={3} />
            </button>
          )}
        </div>
      </div>
    </motion.div>
  )
}
