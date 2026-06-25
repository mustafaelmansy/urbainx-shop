import { useEffect, useState, useRef } from 'react'
import { useParams, Link } from 'react-router-dom'
import axios from 'axios'
import { useCart } from '../context/CartContext'

export default function ProductDetails() {
  const { id } = useParams()
  const [product, setProduct] = useState(null)
  const [activeImage, setActiveImage] = useState(null)
  const [qty, setQty] = useState(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [addStatus, setAddStatus] = useState('idle')
  const abortRef = useRef(null)
  const timeoutRef = useRef(null)
  const { addToCart } = useCart()

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [])

  const resetAddStatus = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    timeoutRef.current = setTimeout(() => setAddStatus('idle'), 2000)
  }

  useEffect(() => {
    if (!id) {
      setLoading(false)
      setError(true)
      return
    }

    if (abortRef.current) abortRef.current.abort()
    const controller = new AbortController()
    abortRef.current = controller

    setLoading(true)
    setError(false)
    setProduct(null)

    axios
      .get(`https://ecommerce.routemisr.com/api/v1/products/${id}`, {
        signal: controller.signal,
      })
      .then((res) => {
        const data = res?.data?.data || null
        setProduct(data)
        setActiveImage(data?.imageCover || data?.images?.[0] || data?.image || '')
        setLoading(false)
      })
      .catch((err) => {
        if (axios.isCancel(err) || err.name === 'CanceledError') return
        console.error(err)
        setError(true)
        setProduct(null)
        setLoading(false)
      })

    return () => controller.abort()
  }, [id])

  if (loading) return <div className="flex h-screen items-center justify-center text-emerald-600 font-semibold">Loading Product Details...</div>
  if (error || !product) return <div className="flex h-screen items-center justify-center text-red-500 font-semibold">Product not found or API Error.</div>

  const images = product?.images?.length ? product.images : product?.image ? [product.image] : []
  const price = product?.price || product?.priceAfterDiscount || 0
  const stock = product?.available || product?.count || 220
  const total = (price * qty).toFixed(2)

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <nav className="mb-4 text-sm text-slate-500">
        <Link to="/">Home</Link> &gt; <span>Women's Fashion</span> &gt; <span>Women's Clothing</span> &gt; <span className="text-slate-900">{product?.name || product?.title}</span>
      </nav>

      <div className="grid gap-8 lg:grid-cols-2">
        <div>
          <div className="rounded-xl border border-slate-100 bg-white p-4">
            <div className="aspect-[4/5] mb-4 flex items-center justify-center bg-slate-50 p-6">
              <img src={activeImage} alt={product?.name} className="max-h-full max-w-full object-contain" />
            </div>
            <div className="flex gap-3 overflow-x-auto">
              {(images || []).map((img, idx) => (
                <button key={idx} onClick={() => setActiveImage(img)} className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-xl border border-slate-100 bg-white p-1">
                  <img src={img} alt={`thumb-${idx}`} className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          </div>
        </div>

        <div>
          <div className="rounded-xl border border-slate-100 bg-white p-6">
            <div className="flex items-center gap-2">
              <div className="rounded-full bg-emerald-50 px-3 py-1 text-xs text-emerald-700">{product?.category?.name || "Women's Fashion"}</div>
              {/* ✅ التعديل الأول هنا */}
              <div className="rounded-full bg-slate-50 px-3 py-1 text-xs text-slate-600">{product?.brand?.name || 'DeFacto'}</div>
            </div>

            <h1 className="mt-4 text-2xl font-bold text-slate-900">{product?.name || product?.title}</h1>
            <div className="mt-2 flex items-center gap-3 text-sm text-amber-400">★★★★ <span className="text-slate-500">4.8 (18 reviews)</span></div>

            <div className="mt-4 text-3xl font-bold text-slate-900">{price} EGP</div>
            <div className="mt-2 flex items-center gap-2 text-sm">
              <span className="inline-block h-2 w-2 rounded-full bg-emerald-500"/> <span className="text-slate-600">In Stock</span>
            </div>

            <p className="mt-4 text-sm text-slate-600">{product?.description || product?.shortDescription || 'Material Polyester Blend Colour Name Multicolour Department Women'}</p>

            <div className="mt-6 flex items-center gap-3">
              <div className="flex items-center gap-2 rounded-lg border border-slate-100 bg-white p-2">
                <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="h-7 w-7 rounded-md bg-slate-50">−</button>
                <div className="px-3 text-sm">{qty}</div>
                <button onClick={() => setQty((q) => q + 1)} className="h-7 w-7 rounded-md bg-slate-50">+</button>
              </div>
              <div className="text-sm text-slate-500">{stock} available</div>
            </div>

            <div className="mt-6 rounded-lg bg-slate-50 p-4">
              <div className="flex items-center justify-between">
                <div className="text-sm text-slate-600">Total Price:</div>
                <div className="text-lg font-bold text-emerald-600">{total} EGP</div>
              </div>
            </div>

            <div className="mt-6 grid gap-3 md:grid-cols-2">
              <button
                onClick={async () => {
                  if (addStatus === 'loading') return
                  setAddStatus('loading')
                  const result = await addToCart(product?._id || product?.id, qty)
                  if (result) {
                    setAddStatus('success')
                    resetAddStatus()
                  } else {
                    setAddStatus('idle')
                  }
                }}
                disabled={addStatus === 'loading'}
                className={`flex items-center justify-center gap-2 rounded-md px-4 py-3 text-white transition ${
                  addStatus === 'success'
                    ? 'bg-emerald-700 shadow-[0_0_0_6px_rgba(16,185,129,0.12)]'
                    : 'bg-emerald-600 hover:bg-emerald-700'
                } ${addStatus === 'loading' ? 'cursor-not-allowed opacity-80' : ''}`}
              >
                {addStatus === 'loading' ? (
                  <span className="inline-flex items-center gap-2">
                    <span className="h-4 w-4 animate-spin rounded-full border border-white/20 border-t-white" />
                    Adding...
                  </span>
                ) : addStatus === 'success' ? (
                  <span className="inline-flex items-center gap-2">✓ Added</span>
                ) : (
                  <>
                    <span>🛒</span> Add to Cart
                  </>
                )}
              </button>
              <button className="flex items-center justify-center gap-2 rounded-md bg-slate-900 px-4 py-3 text-white">⚡ Buy Now</button>
            </div>

            <div className="mt-4 flex items-center gap-3">
              <button className="flex-1 rounded-md border border-slate-200 bg-white px-4 py-3">♡ Add to Wishlist</button>
              <button className="rounded-md border border-slate-200 bg-white px-3 py-3">⤴</button>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
              <div className="rounded-md bg-slate-50 p-3 text-sm">Free Delivery <div className="text-xs text-slate-500">Orders over 50</div></div>
              <div className="rounded-md bg-slate-50 p-3 text-sm">30 Days Return <div className="text-xs text-slate-500">Money back</div></div>
              <div className="rounded-md bg-slate-50 p-3 text-sm">Secure Payment <div className="text-xs text-slate-500">100% Protected</div></div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 rounded-xl border border-slate-100 bg-white">
        <div className="border-b">
          <nav className="flex text-sm">
            <button className="px-6 py-3 text-emerald-600 border-b-2 border-emerald-600">Product Details</button>
            <button className="px-6 py-3 text-slate-600">Reviews (18)</button>
            <button className="px-6 py-3 text-slate-600">Shipping & Returns</button>
          </nav>
        </div>

        <div className="p-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <h3 className="text-sm font-semibold text-slate-700">Product Information</h3>
              <div className="mt-4 grid gap-3">
                <div className="flex justify-between text-sm text-slate-600"><span>Category</span><span>{product?.category?.name || "Women's Fashion"}</span></div>
                <div className="flex justify-between text-sm text-slate-600"><span>Subcategory</span><span>Women's Clothing</span></div>
                {/* ✅ التعديل التاني هنا */}
                <div className="flex justify-between text-sm text-slate-600"><span>Brand</span><span>{product?.brand?.name || 'DeFacto'}</span></div>
                <div className="flex justify-between text-sm text-slate-600"><span>Items Sold</span><span>{product?.sold || '4.56k+'}</span></div>
              </div>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-slate-700">Key Features</h3>
              <ul className="mt-4 space-y-2 text-sm text-slate-600">
                <li>✓ Premium Quality Product</li>
                <li>✓ 100% Authentic Guarantee</li>
                <li>✓ Fast & Secure Packaging</li>
                <li>✓ Quality Tested</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
