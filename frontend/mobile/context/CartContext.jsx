
import { useState, useCallback, useMemo } from 'react'
import { CartContext } from './CartContextValue'

export function CartProvider({ children }) {
  const [items, setItems] = useState([])
  const [deliveryLocation, setDeliveryLocation] = useState(null)
  const [customerLocation, setCustomerLocation] = useState(null)
  const [orderType, setOrderType] = useState('delivery')

  const addItem = useCallback((food, quantity = 1) => {
    setItems((prev) => {
      const existing = prev.find((item) => item.id === food.id)

      if (existing) {
        return prev.map((item) =>
          item.id === food.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        )
      }

      return [...prev, { ...food, quantity }]
    })
  }, [])

  const updateQuantity = useCallback((foodId, quantity) => {
    if (quantity <= 0) {
      setItems((prev) => prev.filter((item) => item.id !== foodId))
      return
    }

    setItems((prev) =>
      prev.map((item) =>
        item.id === foodId ? { ...item, quantity } : item
      )
    )
  }, [])

  const removeItem = useCallback((foodId) => {
    setItems((prev) => prev.filter((item) => item.id !== foodId))
  }, [])

  const clearCart = useCallback(() => {
    setItems([])
    setDeliveryLocation(null)
    setCustomerLocation(null)
    setOrderType('delivery')
  }, [])

  const itemCount = useMemo(
    () => items.reduce((sum, item) => sum + item.quantity, 0),
    [items]
  )

  const subtotal = useMemo(
    () =>
      items.reduce(
        (sum, item) => sum + Number(item.price) * item.quantity,
        0
      ),
    [items]
  )

  const deliveryFee = useMemo(() => {
    if (orderType === 'pickup') return 0

    return deliveryLocation
      ? Number(deliveryLocation.delivery_fee)
      : 0
  }, [orderType, deliveryLocation])

  const total = useMemo(
    () => subtotal + deliveryFee,
    [subtotal, deliveryFee]
  )

  const value = useMemo(
    () => ({
      items,
      itemCount,
      subtotal,
      deliveryFee,
      total,
      deliveryLocation,
      customerLocation,
      orderType,
      addItem,
      updateQuantity,
      removeItem,
      clearCart,
      setDeliveryLocation,
      setCustomerLocation,
      setOrderType,
    }),
    [
      items,
      itemCount,
      subtotal,
      deliveryFee,
      total,
      deliveryLocation,
      customerLocation,
      orderType,
      addItem,
      updateQuantity,
      removeItem,
      clearCart,
    ]
  )

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  )
}
