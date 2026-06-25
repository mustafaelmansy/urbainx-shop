import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import client from '../api/api'

const CartContext = createContext(null)

function getAuthToken() {
  if (typeof window === 'undefined') return null
  return (
    localStorage.getItem('freshcartToken') ||
    localStorage.getItem('userToken') ||
    localStorage.getItem('token') ||
    null
  )
}

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([])
  const [totalCartPrice, setTotalCartPrice] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [initialized, setInitialized] = useState(false)

  const [token, setToken] = useState(() => getAuthToken())

  useEffect(() => {
    const handleStorage = () => setToken(getAuthToken())
    window.addEventListener('storage', handleStorage)
    return () => window.removeEventListener('storage', handleStorage)
  }, [])

  const getHeaders = () => {
    const currentToken = getAuthToken()
    if (!currentToken) return null
    return {
      headers: {
        token: currentToken,
        'Content-Type': 'application/json',
      },
    }
  }

  const normalizeCartItems = (items) => {
    if (Array.isArray(items)) return items
    if (Array.isArray(items?.products)) return items.products
    return []
  }

  const fetchCart = async () => {
    setLoading(true)
    setError(null)
    const headersConfig = getHeaders()
    if (!headersConfig) {
      console.error('Cart fetch failed: missing auth token. Please log in first.')
      setError(new Error('Authentication required'))
      setCartItems([])
      setTotalCartPrice(0)
      setLoading(false)
      setInitialized(true)
      return
    }

    try {
      const res = await client.get('/cart', headersConfig)
      const cartData = res?.data?.data || {}
      setCartItems(normalizeCartItems(cartData))
      setTotalCartPrice(cartData?.totalCartPrice ?? 0)
    } catch (err) {
      setError(err)
      setCartItems([])
      setTotalCartPrice(0)
    } finally {
      setLoading(false)
      setInitialized(true)
    }
  }

  const addToCart = async (productId, count = 1) => {
    if (!productId) return null
    const headersConfig = getHeaders()
    if (!headersConfig) {
      console.error('Add to cart failed: missing auth token. Please log in first.')
      setError(new Error('Authentication required'))
      return null
    }

    setLoading(true)
    try {
      const res = await client.post('/cart', { productId, count }, headersConfig)
      const success = res?.status === 200 || res?.status === 201 || res?.data?.status === 'success'
      if (success) {
        const cartData = res?.data?.data || {}
        setCartItems(normalizeCartItems(cartData))
        setTotalCartPrice(cartData?.totalCartPrice ?? 0)
        return res?.data
      }
      setError(new Error('Add to cart request failed'))
      return null
    } catch (err) {
      setError(err)
      return null
    } finally {
      setLoading(false)
    }
  }

  const updateQuantity = async (cartItemId, count) => {
    if (!cartItemId) return null
    const headersConfig = getHeaders()
    if (!headersConfig) {
      console.error('Update quantity failed: missing auth token. Please log in first.')
      setError(new Error('Authentication required'))
      return null
    }
    setLoading(true)
    try {
      const numCount = Number(count)
      if (isNaN(numCount) || numCount < 1) {
        throw new Error('Invalid count value')
      }
      const payload = { count: numCount }
      console.log('Updating Cart Item:', cartItemId, 'New Count:', numCount, 'Payload:', payload)
      const res = await client.put(`/cart/${cartItemId}`, payload, headersConfig)
      const data = res?.data?.data || null
      const success = res?.status === 200 || res?.status === 201 || res?.data?.status === 'success'
      if (success && data) {
        setCartItems(normalizeCartItems(data))
        return res?.data
      }
      setError(new Error('Update quantity request failed'))
      return null
    } catch (err) {
      console.error('Cart update error:', err?.response?.status, err?.response?.data || err?.message)
      setError(err)
      return null
    } finally {
      setLoading(false)
    }
  }

  const removeItem = async (cartItemId) => {
    if (!cartItemId) return null
    const headersConfig = getHeaders()
    if (!headersConfig) {
      console.error('Remove cart item failed: missing auth token. Please log in first.')
      setError(new Error('Authentication required'))
      return null
    }
    setLoading(true)
    try {
      const res = await client.delete(`/cart/${cartItemId}`, headersConfig)
      const cartData = res?.data?.data || {}
      setCartItems(normalizeCartItems(cartData))
      setTotalCartPrice(cartData?.totalCartPrice ?? 0)
      return res?.data
    } catch (err) {
      setError(err)
      return null
    } finally {
      setLoading(false)
    }
  }

  const clearCart = async () => {
    const headersConfig = getHeaders()
    if (!headersConfig) {
      console.error('Clear cart failed: missing auth token. Please log in first.')
      setError(new Error('Authentication required'))
      return null
    }
    setLoading(true)
    try {
      const res = await client.delete('/cart', headersConfig)
      setCartItems([])
      return res?.data
    } catch (err) {
      setError(err)
      return null
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!token) {
      setCartItems([])
      setInitialized(true)
      return
    }
    fetchCart()
  }, [token])

  const totalItems = useMemo(() => {
    const itemsArray = Array.isArray(cartItems) ? cartItems : Array.isArray(cartItems?.products) ? cartItems.products : []
    return itemsArray.reduce((sum, item) => sum + (item.count ?? item.quantity ?? 1), 0)
  }, [cartItems])

  const subtotal = useMemo(() => {
    const itemsArray = Array.isArray(cartItems) ? cartItems : Array.isArray(cartItems?.products) ? cartItems.products : []
    return itemsArray.reduce((sum, item) => {
      const product = item.product || item
      const unitPrice = product?.price ?? product?.priceAfterDiscount ?? 0
      return sum + ((item.count ?? item.quantity ?? 1) * unitPrice)
    }, 0)
  }, [cartItems])

  const value = {
    cartItems,
    loading,
    error,
    initialized,
    totalItems,
    totalCartPrice,
    subtotal,
    addToCart,
    fetchCart,
    updateQuantity,
    removeItem,
    clearCart,
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used inside a CartProvider')
  }
  return context
}
