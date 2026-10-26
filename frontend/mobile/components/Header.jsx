import { ChevronLeft, ShoppingCart, Search } from 'lucide-react'
import { useCart } from '../context/useCart'
import './Header.css'

export default function Header({
  title,
  showBack = false,
  showCart = false,
  showSearch = false,
  showLogo = false,
  onBack,
  onSearch,
  onCartClick,
  rightAction,
  transparent = false,
  light = false,
}) {
  const { itemCount } = useCart()

  return (
    <header className={`header ${transparent ? 'header--transparent' : ''} ${light ? 'header--light' : ''}`}>
      <div className="header__left">
        {showBack && (
          <button
            className="header__btn header__back-btn"
            onClick={onBack}
            aria-label="Go back"
            id="header-back-btn"
          >
            <ChevronLeft size={22} />
          </button>
        )}
      </div>

      <div className="header__center">
        {showLogo ? (
          <div className="header__logo">
            <div className="header__logo-text-wrap">
              <span className="header__logo-text">Magmay's</span>
              <span className="header__logo-sub">KITCHEN</span>
            </div>
          </div>
        ) : (
          title && <h1 className="header__title">{title}</h1>
        )}
      </div>

      <div className="header__right">
        {showSearch && (
          <button
            className="header__btn"
            onClick={onSearch}
            aria-label="Search"
            id="header-search-btn"
          >
            <Search size={20} />
          </button>
        )}
        {showCart && (
          <button
            className="header__btn header__cart-btn"
            onClick={onCartClick}
            aria-label="Shopping cart"
            id="header-cart-btn"
          >
            <ShoppingCart size={20} />
            {itemCount > 0 && (
              <span className="header__cart-badge">{itemCount}</span>
            )}
          </button>
        )}
        {rightAction && rightAction}
      </div>
    </header>
  )
}
