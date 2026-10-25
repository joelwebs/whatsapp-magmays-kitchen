import { useState } from 'react'
import { motion } from 'motion/react'
import { ChevronLeft, Heart, Minus, Plus } from 'lucide-react'
import { useCart } from '../../context/useCart'
import PrimaryButton from '../../components/PrimaryButton'
import { toast } from 'sonner'
import './[id].css'

export default function FoodDetailPage({ food, onBack }) {
  const [quantity, setQuantity] = useState(1)
  const { addItem } = useCart()

  if (!food) return null

  const API_BASE_URL =
    import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api/v1'
  const baseUrl = API_BASE_URL.replace('/api/v1', '')

  const imageUrl = food.image_url
    ? food.image_url.startsWith('http')
      ? food.image_url
      : `${baseUrl}${food.image_url}`
    : null

  function handleAddToCart() {
    addItem(food, quantity)
    toast.success(`${food.name} added to cart!`)
    onBack()
  }

  return (
    <div className="food-detail" id="food-detail-page">
      {/* Hero Image */}
      <div className="food-detail__hero">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={food.name}
            className="food-detail__hero-img"
          />
        ) : (
          <div className="food-detail__hero-placeholder">🍽️</div>
        )}

        {/* Overlay buttons */}
        <div className="food-detail__hero-overlay">
          <button
            className="food-detail__hero-btn"
            onClick={onBack}
            aria-label="Go back"
            id="food-detail-back-btn"
          >
            <ChevronLeft size={24} />
          </button>
          <button
            className="food-detail__hero-btn"
            aria-label="Add to favourites"
            id="food-detail-fav-btn"
          >
            <Heart size={20} />
          </button>
        </div>
      </div>

      {/* Content */}
      <motion.div
        className="food-detail__content"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h1 className="food-detail__name">{food.name}</h1>
        <p className="food-detail__price">
          GH₵{Number(food.price).toFixed(2)}
        </p>

        {food.description && (
          <p className="food-detail__desc">{food.description}</p>
        )}

        {/* Quantity Selector */}
        <div className="food-detail__quantity-section">
          <span className="food-detail__quantity-label">Quantity</span>
          <div className="food-detail__quantity-control">
            <button
              className="food-detail__qty-btn"
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              disabled={quantity <= 1}
              aria-label="Decrease quantity"
              id="food-detail-qty-minus"
            >
              <Minus size={18} />
            </button>
            <span className="food-detail__qty-value">{quantity}</span>
            <button
              className="food-detail__qty-btn"
              onClick={() => setQuantity((q) => q + 1)}
              aria-label="Increase quantity"
              id="food-detail-qty-plus"
            >
              <Plus size={18} />
            </button>
          </div>
        </div>

        {/* Add to Cart */}
        <div className="food-detail__action">
          <PrimaryButton
            onClick={handleAddToCart}
            size="lg"
            id="food-detail-add-btn"
          >
            Add to Menu
          </PrimaryButton>
        </div>
      </motion.div>
    </div>
  )
}
