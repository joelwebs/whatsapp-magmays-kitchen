
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { getFoods } from '../../services/api'
import './edit-food.css'

function asList(data) {
  if (Array.isArray(data)) return data
  if (Array.isArray(data?.results)) return data.results
  if (Array.isArray(data?.data)) return data.data
  return []
}

export default function EditFood() {
  const { id } = useParams()
  const [food, setFood] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true

    getFoods()
      .then((response) => {
        if (!active) return

        const match = asList(response).find(
          (item) => String(item.id ?? item.pk) === String(id)
        )

        if (!match) {
          setError('Food item not found in the menu ')
          return
        }

        setFood({
          name: match.name ?? '',
          description: match.description ?? '',
          price: match.price ?? '',
          category: match.category?.id ?? match.category_id ?? match.category ?? '',
          image_url: match.image_url ?? '',
          available:
            match.is_available ??
            match.available ??
            match.is_active ??
            true,
        })
      })
      .catch((err) => {
        if (active) setError(err.message || 'Unable to load this food item.')
      })
      .finally(() => {
        if (active) setLoading(false)
      })

    return () => {
      active = false
    }
  }, [id])

  function updateField(event) {
    const { name, value, type, checked } = event.target

    setFood((current) => ({
      ...current,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  if (loading) {
    return <main className="edit-food-page">Loading food item…</main>
  }

  if (!food) {
    return (
      <main className="edit-food-page">
        <div className="edit-food-alert">
          {error || 'Food item could not be loaded.'}
        </div>
      </main>
    )
  }

  return (
    <main className="edit-food-page">
      <header className="edit-food-header">
        <p className="edit-food-eyebrow">OWNER WORKSPACE</p>
        <h1>Edit food item</h1>
        <p>Review the item's existing information.</p>
      </header>

      {error && <div className="edit-food-alert">{error}</div>}

      <form
        className="edit-food-card"
        onSubmit={(event) => {
          event.preventDefault()
          setError(
            'Saving is not connected yet. Confirm the backend update endpoint and owner authentication first.'
          )
        }}
      >
        <label>
          Food name
          <input
            name="name"
            value={food.name}
            onChange={updateField}
            required
          />
        </label>

        <label>
          Description
          <textarea
            name="description"
            value={food.description}
            onChange={updateField}
            rows={4}
          />
        </label>

        <label>
          Price (GH₵)
          <input
            name="price"
            type="number"
            min="0"
            step="0.01"
            value={food.price}
            onChange={updateField}
            required
          />
        </label>

        <label>
          Image URL
          <input
            name="image_url"
            type="url"
            value={food.image_url}
            onChange={updateField}
            placeholder="https://..."
          />
        </label>

        {food.image_url && (
          <img
            className="edit-food-preview"
            src={food.image_url}
            alt="Current food"
          />
        )}

        <label className="edit-food-checkbox">
          <input
            name="available"
            type="checkbox"
            checked={Boolean(food.available)}
            onChange={updateField}
          />
          Available for customers
        </label>

        <button type="submit" disabled>
          Save changes
        </button>
      </form>
    </main>
  )
}
