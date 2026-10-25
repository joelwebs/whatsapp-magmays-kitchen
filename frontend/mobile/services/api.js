
const API_BASE_URL =
  import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api/v1'

async function request(endpoint, options = {}) {
  const isFormData =
    typeof FormData !== 'undefined' && options.body instanceof FormData

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      ...(options.body && !isFormData
        ? { 'Content-Type': 'application/json' }
        : {}),
      ...options.headers,
    },
  })

  if (response.status === 204) return null

  const contentType = response.headers.get('content-type') || ''
  const data = contentType.includes('application/json')
    ? await response.json()
    : await response.text()

  if (!response.ok) {
    const message =
      typeof data === 'object' && data !== null
        ? data.detail ||
          data.message ||
          Object.values(data).flat().join(' ')
        : data

    throw new Error(message || `Request failed (${response.status})`)
  }

  return data
}

export const api = {
  get: (endpoint, options = {}) => request(endpoint, options),

  post: (endpoint, body, options = {}) =>
    request(endpoint, {
      ...options,
      method: 'POST',
      body:
        body instanceof FormData ? body : JSON.stringify(body),
    }),

  patch: (endpoint, body, options = {}) =>
    request(endpoint, {
      ...options,
      method: 'PATCH',
      body:
        body instanceof FormData ? body : JSON.stringify(body),
    }),

  put: (endpoint, body, options = {}) =>
    request(endpoint, {
      ...options,
      method: 'PUT',
      body:
        body instanceof FormData ? body : JSON.stringify(body),
    }),

  delete: (endpoint, options = {}) =>
    request(endpoint, { ...options, method: 'DELETE' }),
}

export const getCategories = () => api.get('/menu/categories/')
export const getFoods = () => api.get('/menu/foods/')
export const getBusiness = () => api.get('/business/')
export const getDeliveryLocations = () =>
  api.get('/business/delivery-locations/')
