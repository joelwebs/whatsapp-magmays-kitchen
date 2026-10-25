import { motion } from 'motion/react'
import './FoodCard.css'

export default function FoodCard({ food, onClick, layout = 'horizontal' }) {
  const API_BASE_URL =
    import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api/v1'
  const baseUrl = API_BASE_URL.replace('/api/v1', '')

  const imageUrl = food.image_url
    ? food.image_url.startsWith('http')
      ? food.image_url
      : `${baseUrl}${food.image_url}`
    : null

  if (layout === 'featured') {
    return (
      <motion.button
        className="food-card food-card--featured"
        onClick={() => onClick?.(food)}
        whileTap={{ scale: 0.97 }}
        id={`food-card-featured-${food.id}`}
      >
        <div className="food-card__img-wrap food-card__img-wrap--featured">
          {imageUrl ? (
            <img src={imageUrl} alt={food.name} className="food-card__img" loading="lazy" />
          ) : (
            <div className="food-card__img-placeholder">🍽️</div>
          )}
        </div>
        <div className="food-card__info food-card__info--featured">
          <p className="food-card__name">{food.name}</p>
          <p className="food-card__price">GH₵{Number(food.price).toFixed(2)}</p>
        </div>
      </motion.button>
    )
  }

  return (
    <motion.button
      className={`food-card food-card--${layout}`}
      onClick={() => onClick?.(food)}
      whileTap={{ scale: 0.98 }}
      id={`food-card-${food.id}`}
    >
      <div className="food-card__img-wrap">
        {imageUrl ? (
          <img src={imageUrl} alt={food.name} className="food-card__img" loading="lazy" />
        ) : (
          <div className="food-card__img-placeholder">🍽️</div>
        )}
      </div>
      <div className="food-card__info">
        <p className="food-card__name">{food.name}</p>
        {food.description && (
          <p className="food-card__desc">{food.description}</p>
        )}
        <p className="food-card__price">GH₵{Number(food.price).toFixed(2)}</p>
      </div>
    </motion.button>
  )
}
