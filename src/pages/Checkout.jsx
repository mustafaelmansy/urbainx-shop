import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'

function formatPrice(value) {
  return `${Number(value || 0).toLocaleString()} EGP`
}

export default function Checkout() {
  const { cartItems, totalItems, totalCartPrice, clearCart, loading } = useCart()
  const navigate = useNavigate()

  const [paymentMethod, setPaymentMethod] = useState('card')
  const [submitting, setSubmitting] = useState(false)
  const [formError, setFormError] = useState(null)

  const [form, setForm] = useState({
    fullName: '',
    phone: '',
    city: '',
    address: '',
    details: '',
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setFormError(null)

    if (!form.fullName || !form.phone || !form.city || !form.address) {
      setFormError('Please fill in all required shipping fields.')
      return
    }

    setSubmitting(true)
    try {
      await clearCart()
      navigate('/order-success')
    } catch (err) {
      setFormError('Something went wrong while placing your order. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return <div className="flex h-screen items-center justify-center text-emerald-600 font-semibold">Loading Checkout...</div>
  }

  if (!cartItems || cartItems.length === 0) {
    return (
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-center gap-4 px-4 py-24 text-center">
        <h1 className="text-2xl font-bold text-slate-900">Your cart is empty</h1>
        <p className="text-slate-500">Add some products before proceeding to checkout.</p>
        <Link to="/" className="rounded-full bg-emerald-600 px-6 py-3 text-sm font-semibold text-white hover:bg-emerald-700">
          ← Continue Shopping
        </Link>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-col gap-4 rounded-3xl bg-white p-6 shadow-sm sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm text-slate-500">Home / Cart / Checkout</p>
          <h1 className="mt-4 flex items-center gap-3 text-3xl font-bold text-slate-900">
            <span className="inline-flex h-12 w-12 items-center justify-center rounded-3xl bg-emerald-100 text-emerald-700">🔒</span>
            Checkout
          </h1>
          <p className="mt-2 text-sm text-slate-600">Complete your order in just a few steps</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid gap-8 xl:grid-cols-[1.8fr_1fr]">
        <div className="space-y-6">
          {/* Shipping details */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-5 flex items-center gap-3 text-lg font-semibold text-slate-900">
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">📦</span>
              Shipping Details
            </h2>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-1">
                <label className="mb-1.5 block text-sm font-medium text-slate-700">Full Name *</label>
                <input
                  name="fullName"
                  value={form.fullName}
                  onChange={handleChange}
                  placeholder="John Doe"
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-emerald-300 focus:ring-2 focus:ring-emerald-100"
                />
              </div>

              <div className="sm:col-span-1">
                <label className="mb-1.5 block text-sm font-medium text-slate-700">Phone Number *</label>
                <input
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="01xxxxxxxxx"
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-emerald-300 focus:ring-2 focus:ring-emerald-100"
                />
              </div>

              <div className="sm:col-span-1">
                <label className="mb-1.5 block text-sm font-medium text-slate-700">City *</label>
                <input
                  name="city"
                  value={form.city}
                  onChange={handleChange}
                  placeholder="Cairo"
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-emerald-300 focus:ring-2 focus:ring-emerald-100"
                />
              </div>

              <div className="sm:col-span-1">
                <label className="mb-1.5 block text-sm font-medium text-slate-700">Street Address *</label>
                <input
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                  placeholder="123 Main St, Apt 4"
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-emerald-300 focus:ring-2 focus:ring-emerald-100"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="mb-1.5 block text-sm font-medium text-slate-700">Additional Details (optional)</label>
                <textarea
                  name="details"
                  value={form.details}
                  onChange={handleChange}
                  rows={3}
                  placeholder="Landmark, delivery notes, etc."
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-emerald-300 focus:ring-2 focus:ring-emerald-100"
                />
              </div>
            </div>
          </div>

          {/* Payment method */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-5 flex items-center gap-3 text-lg font-semibold text-slate-900">
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">💳</span>
              Payment Method
            </h2>

            <div className="grid gap-4 sm:grid-cols-2">
              <button
                type="button"
                onClick={() => setPaymentMethod('card')}
                className={`flex items-center gap-3 rounded-2xl border p-4 text-left transition ${
                  paymentMethod === 'card'
                    ? 'border-emerald-400 bg-emerald-50 ring-2 ring-emerald-100'
                    : 'border-slate-200 bg-slate-50 hover:border-slate-300'
                }`}
              >
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-white text-emerald-700 shadow-sm">💳</span>
                <div>
                  <p className="text-sm font-semibold text-slate-900">Credit / Debit Card</p>
                  <p className="text-xs text-slate-500">Visa, MasterCard, etc.</p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('cash')}
                className={`flex items-center gap-3 rounded-2xl border p-4 text-left transition ${
                  paymentMethod === 'cash'
                    ? 'border-emerald-400 bg-emerald-50 ring-2 ring-emerald-100'
                    : 'border-slate-200 bg-slate-50 hover:border-slate-300'
                }`}
              >
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-white text-emerald-700 shadow-sm">💵</span>
                <div>
                  <p className="text-sm font-semibold text-slate-900">Cash on Delivery</p>
                  <p className="text-xs text-slate-500">Pay when your order arrives</p>
                </div>
              </button>
            </div>

            {paymentMethod === 'card' && (
              <div className="mt-5 grid gap-4 border-t border-slate-200 pt-5 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">Card Number</label>
                  <input
                    placeholder="1234 5678 9012 3456"
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-emerald-300 focus:ring-2 focus:ring-emerald-100"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">Expiry Date</label>
                  <input
                    placeholder="MM/YY"
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-emerald-300 focus:ring-2 focus:ring-emerald-100"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">CVV</label>
                  <input
                    placeholder="123"
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-emerald-300 focus:ring-2 focus:ring-emerald-100"
                  />
                </div>
              </div>
            )}
          </div>

          {formError && (
            <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">
              {formError}
            </div>
          )}

          <Link to="/cart" className="inline-block text-sm font-semibold text-emerald-600 hover:underline">
            ← Back to Cart
          </Link>
        </div>

        {/* Order summary */}
        <aside className="space-y-4">
          <div className="rounded-3xl border border-slate-200 bg-white shadow-sm">
            <div className="rounded-t-3xl bg-emerald-600 px-6 py-6 text-white">
              <h2 className="text-sm font-semibold uppercase tracking-[0.24em]">Order Summary</h2>
              <p className="mt-3 text-3xl font-semibold">{totalItems} items</p>
            </div>

            <div className="space-y-4 p-6">
              <div className="max-h-64 space-y-3 overflow-y-auto pr-1">
                {cartItems.map((item) => {
                  const product = item.product || item
                  const quantity = item.count ?? item.quantity ?? 1
                  const price = item.price ?? 0
                  const image = product?.image || product?.imageCover || product?.images?.[0] || '/placeholder.png'

                  return (
                    <div key={item._id || product._id || product.id} className="flex items-center gap-3">
                      <img src={image} alt={product?.name || product?.title} className="h-12 w-12 rounded-xl border border-slate-200 object-contain" />
                      <div className="flex-1">
                        <p className="line-clamp-1 text-sm font-medium text-slate-900">{product?.name || product?.title}</p>
                        <p className="text-xs text-slate-500">Qty: {quantity}</p>
                      </div>
                      <p className="text-sm font-semibold text-slate-900">{formatPrice(price * quantity)}</p>
                    </div>
                  )
                })}
              </div>

              <div className="space-y-2 border-t border-slate-200 pt-4 text-sm text-slate-600">
                <div className="flex items-center justify-between">
                  <span>Subtotal</span>
                  <span>{formatPrice(totalCartPrice)}</span>
                </div>
                <div className="flex items-center justify-between text-emerald-700">
                  <span>Shipping</span>
                  <span className="font-semibold">FREE</span>
                </div>
              </div>

              <div className="border-t border-slate-200 pt-4 text-sm text-slate-900">
                <div className="flex items-center justify-between text-base font-semibold">
                  <span>Total</span>
                  <span>{formatPrice(totalCartPrice)}</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full rounded-3xl bg-emerald-600 px-4 py-4 text-sm font-semibold uppercase tracking-[0.08em] text-white shadow-sm transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitting ? 'Placing Order...' : '🔒 Place Order'}
              </button>

              <div className="grid gap-3 text-sm text-slate-500">
                <div className="flex items-center gap-2">
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">💳</span>
                  Secure Payment
                </div>
                <div className="flex items-center gap-2">
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">⚡</span>
                  Fast Delivery
                </div>
              </div>
            </div>
          </div>
        </aside>
      </form>
    </div>
  )
}