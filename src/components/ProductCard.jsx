import React, { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'

function Stars({ value = 5 }) {
  const stars = []
  for (let i = 1; i <= 5; i++) {
    stars.push(
      <svg key={i} className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor" aria-hidden>
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.176 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.38 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>,
    )
  }
  return <div className="flex items-center gap-1 text-amber-400">{stars}</div>
}

export default function ProductCard({ product }) {
  const { addToCart } = useCart()
  const [addStatus, setAddStatus] = useState('idle')
  const timeoutRef = useRef(null)

  // الـ Fallback Chain المعدل
  const img = product.image || product.imageCover || product.images?.[0] || '/placeholder.png'
  const category = product.category?.name || product.category || 'Category'
  const title = product.title || product.name || 'Product'
  const price = product.price ? `${product.price} EGP` : '—'
  const rating = product.ratingsAverage || product.rating || 4.8
  const reviews = product.ratingsQuantity || product.reviews || 18

  const resetStatus = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    timeoutRef.current = setTimeout(() => setAddStatus('idle'), 2000)
  }

  const handleAdd = async (event) => {
    event.preventDefault()
    if (addStatus === 'loading') return
    setAddStatus('loading')

    const result = await addToCart(product._id || product.id, 1)
    if (result) {
      setAddStatus('success')
      resetStatus()
    } else {
      setAddStatus('idle')
    }
  }

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [])

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-lg border border-slate-100 bg-white p-4 transition-all duration-300 hover:shadow-xl hover:shadow-slate-100 hover:-translate-y-1">
      <div className="absolute right-3 top-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <button className="flex h-8 w-8 items-center justify-center rounded-full bg-white p-1 shadow-sm text-xs">❤</button>
        <button className="flex h-8 w-8 items-center justify-center rounded-full bg-white p-1 shadow-sm text-xs">⟳</button>
        <button className="flex h-8 w-8 items-center justify-center rounded-full bg-white p-1 shadow-sm text-xs">👁</button>
      </div>

      <Link to={`/product/${product.id || product._id || product.slug || ''}`} className="mx-auto mb-3 w-full no-underline">
        <div className="aspect-square flex items-center justify-center rounded-xl bg-slate-50 p-4">
          {/* إضافة الـ key الديناميكي هنا أيضاً */}
          <img 
            key={img}
            src={img} 
            alt={title} 
            className="max-h-full max-w-full object-contain" 
            onError={(e) => {
              e.target.onerror = null; 
              e.target.src = '/placeholder.png';
            }}
          />
        </div>
      </Link>

      <div className="mt-2 text-[10px] uppercase tracking-wider text-slate-400 font-semibold">{category}</div>
      <Link to={`/product/${product.id || product._id || product.slug || ''}`} className="no-underline">
        <h3 className="mt-1 text-sm font-medium text-slate-800" style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{title}</h3>
      </Link>

      <div className="mt-2 flex items-center gap-2 text-xs">
        <Stars value={Math.round(rating)} />
        <div className="text-xs text-slate-400">{rating} ({reviews})</div>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <div className="text-base font-bold text-slate-900">{price}</div>
        <button
          onClick={handleAdd}
          disabled={addStatus === 'loading'}
          className={`flex h-8 w-8 items-center justify-center rounded-full text-white shadow-sm text-xs transition-colors ${
            addStatus === 'success'
              ? 'bg-emerald-700 shadow-[0_0_0_4px_rgba(16,185,129,0.12)]'
              : 'bg-emerald-600 hover:bg-emerald-700'
          } ${addStatus === 'loading' ? 'cursor-not-allowed opacity-80' : ''}`}
        >
          {addStatus === 'loading' ? (
            <span className="h-4 w-4 animate-spin rounded-full border border-white/20 border-t-white" />
          ) : addStatus === 'success' ? (
            '✓'
          ) : (
            '+'
          )}
        </button>
      </div>
    </div>
  )
}