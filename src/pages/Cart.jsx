import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'

function formatPrice(value) {
    
  return `${Number(value || 0).toLocaleString()} EGP`
}

export default function Cart() {
  const { cartItems, loading, error, totalItems, totalCartPrice, removeItem, clearCart } = useCart()

  if (loading) {
    return <div className="flex h-screen items-center justify-center text-emerald-600 font-semibold">Loading Cart...</div>
  }

  if (error) {
    return <div className="flex h-screen items-center justify-center text-red-500 font-semibold">Unable to load cart. Please try again.</div>
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-col gap-4 rounded-3xl bg-white p-6 shadow-sm sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm text-slate-500">Home / Shopping Cart</p>
          <h1 className="mt-4 flex items-center gap-3 text-3xl font-bold text-slate-900">
            <span className="inline-flex h-12 w-12 items-center justify-center rounded-3xl bg-emerald-100 text-emerald-700">🛒</span>
            Shopping Cart
          </h1>
          <p className="mt-2 text-sm text-slate-600">You have {totalItems} items in your cart</p>
        </div>
      </div>

      <div className="grid gap-8 xl:grid-cols-[1.8fr_1fr]">
        <div className="space-y-4">
          {cartItems.map((item) => {
            const product = item.product || item
            const quantity = item.count ?? item.quantity ?? 1
            const price = item.price ?? 0
            const itemTotal = price * quantity
            const image = product?.image || product?.imageCover || product?.images?.[0] || '/placeholder.png'
            const category = product?.category?.name || product?.category || "Women's Fashion"
            const sku = product?.sku || product?._id?.slice(-6).toUpperCase() || 'SKU-0000'

            return (
              <div key={item._id || product._id || product.id || sku} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="grid gap-4 lg:grid-cols-[120px_1fr_auto] lg:items-center">
                  <div className="flex flex-col items-center gap-3 rounded-3xl border border-slate-200 bg-slate-50 p-4">
                    <img src={image} alt={product?.name || product?.title} className="h-24 w-24 object-contain" />
                    <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">In Stock</span>
                  </div>

                  <div className="space-y-3">
                    <div className="text-sm text-slate-500">{category}</div>
                    <h2 className="text-base font-semibold text-slate-900">{product?.name || product?.title}</h2>
                    <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                      <span className="rounded-full bg-emerald-50 px-2 py-1 text-emerald-700">{category}</span>
                      <span>SKU: {sku}</span>
                    </div>
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between sm:pr-4">
                      <div className="text-sm font-semibold text-slate-900">{formatPrice(price)} per unit</div>
                      <span className="text-sm font-medium text-slate-600">Qty: {quantity}</span>
                    </div>
                  </div>

                  <div className="space-y-3 text-right">
                    <div className="text-sm text-slate-500">Total</div>
                    <div className="text-lg font-semibold text-slate-900">{formatPrice(itemTotal)}</div>
                    <button
                      className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-rose-200 bg-rose-50 text-sm font-semibold text-rose-700 transition hover:bg-rose-100"
                      onClick={() => removeItem(product._id || product.id)}
                      title="Remove from cart"
                    >
                      🗑
                    </button>
                  </div>
                </div>
              </div>
            )
          })}

          <div className="flex flex-col gap-3 border-t border-slate-200 pt-4 sm:flex-row sm:items-center sm:justify-between">
            <Link to="/" className="text-sm font-semibold text-emerald-600 hover:underline">← Continue Shopping</Link>
            <button
              onClick={clearCart}
              className="inline-flex items-center justify-center rounded-full border border-rose-200 bg-rose-50 px-4 py-2 text-sm font-semibold text-rose-700 transition hover:bg-rose-100"
            >
              🗑 Clear all items
            </button>
          </div>
        </div>

        <aside className="space-y-4">
          <div className="rounded-3xl border border-slate-200 bg-white shadow-sm">
            <div className="rounded-t-3xl bg-emerald-600 px-6 py-6 text-white">
              <h2 className="text-sm font-semibold uppercase tracking-[0.24em]">Order Summary</h2>
              <p className="mt-3 text-3xl font-semibold">{totalItems} items</p>
            </div>
            <div className="space-y-4 p-6">
              <div className="rounded-3xl bg-emerald-50 p-4 text-sm text-emerald-700">
                <div className="flex items-center gap-3">
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">🚚</span>
                  <div>
                    <p className="font-semibold">Free Shipping!</p>
                    <p className="text-sm text-emerald-700/80">You qualify for free delivery</p>
                  </div>
                </div>
              </div>

              <div className="space-y-2 text-sm text-slate-600">
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

              <div className="rounded-3xl border border-dashed border-slate-200 p-4">
                <label className="mb-2 block text-sm font-semibold text-slate-700">Apply Promo Code</label>
                <div className="flex gap-2">
                  <input
                    className="flex-1 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-emerald-300 focus:ring-2 focus:ring-emerald-100"
                    placeholder="Promo code"
                  />
                  <button className="rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white">Apply</button>
                </div>
              </div>

              <button className="w-full rounded-3xl bg-emerald-600 px-4 py-4 text-sm font-semibold uppercase tracking-[0.08em] text-white shadow-sm transition hover:bg-emerald-700">
                🔒 Secure Checkout
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
      </div>
    </div>
  )
}
