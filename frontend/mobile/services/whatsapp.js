export function sendWhatsAppOrder({
  business,
  items,
  customerName,
  phone,
  location,
  address,
  deliveryFee,
  notes,
}) {
  if (!business?.whatsapp_number) {
    throw new Error('The business WhatsApp number is not configured.')
  }

  const subtotal = items.reduce(
    (total, item) => total + Number(item.price) * item.quantity,
    0,
  )

  const lines = [
    `Hello ${business.name || "Magmay's Kitchen"}! I'd like to place an order.`,
    '',
    `Customer: ${customerName}`,
    `Phone: ${phone}`,
    `Delivery location: ${location}`,
    `Address/details: ${address || 'Not provided'}`,
    '',
    'ORDER:',
    ...items.map(
      (item) =>
        `${item.quantity} x ${item.name} — GHS ${(Number(item.price) * item.quantity).toFixed(2)}`,
    ),
    '',
    `Subtotal: GHS ${subtotal.toFixed(2)}`,
    `Delivery fee: GHS ${Number(deliveryFee).toFixed(2)}`,
    `TOTAL: GHS ${(subtotal + Number(deliveryFee)).toFixed(2)}`,
    `Notes: ${notes || 'None'}`,
  ]

  const number = business.whatsapp_number.replace(/\D/g, '')
  const url = `https://wa.me/${number}?text=${encodeURIComponent(lines.join('\n'))}`

  window.open(url, '_blank', 'noopener,noreferrer')
}