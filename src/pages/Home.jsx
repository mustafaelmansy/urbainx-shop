import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getCategories, getProducts } from '../api/api'
import ProductCard from '../components/ProductCard'
import CategoryCard from '../components/CategoryCard'

const fallbackCategories = [
  'Music', "Men's Fashion", "Women's Fashion", 'SuperMarket', 'Baby & Toys', 'Home', 'Books', 'Beauty & Health', 'Mobiles', 'Electronics',
]

export default function Home() {
  const [categories, setCategories] = useState([])
  const [products, setProducts] = useState([])
  const [loadingCategories, setLoadingCategories] = useState(true)
  const [loadingProducts, setLoadingProducts] = useState(true)

  useEffect(() => {
    let mounted = true
    getCategories()
      .then((res) => {
        if (!mounted) return
        const data = res?.data?.data || res?.data || []
        if (Array.isArray(data) && data.length) setCategories(data)
        else setCategories(fallbackCategories.map((c) => ({ name: c })))
      })
      .catch(() => setCategories(fallbackCategories.map((c) => ({ name: c }))))
      .finally(() => setLoadingCategories(false))

    // fetch all products (no pagination/limit) and render them all in the grid
    getProducts()
      .then((res) => {
        if (!mounted) return
        const data = res?.data?.data || res?.data || []
        if (Array.isArray(data) && data.length) setProducts(data)
        else setProducts([])
      })
      .catch(() => setProducts([]))
      .finally(() => setLoadingProducts(false))

    return () => {
      mounted = false
    }
  }, [])

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Hero / Slider */}
      <section className="mb-8">
        <div className="relative overflow-hidden rounded-2xl bg-emerald-600 text-white">
          <div className="absolute inset-0 opacity-80" style={{ backgroundImage: 'url(/hero.jpg)', backgroundSize: 'cover', backgroundPosition: 'center' }} />
          <div className="relative z-10 grid gap-6 p-8 md:grid-cols-[1fr_auto] md:items-center">
            <div className="max-w-2xl">
              <h1 className="text-4xl font-bold">Fresh Products Delivered to your Door</h1>
              <p className="mt-3 text-lg">Get 20% off your first order</p>
              <div className="mt-5 flex gap-4">
                <button className="rounded-full bg-white px-6 py-3 text-emerald-600">Shop Now</button>
                <button className="rounded-full border border-white px-5 py-3">View Deals</button>
              </div>
            </div>
            <div className="hidden md:block">
              <div className="flex gap-3">
                <button className="h-12 w-12 rounded-full bg-white/20">❮</button>
                <button className="h-12 w-12 rounded-full bg-white/20">❯</button>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-lg border border-slate-200 bg-white p-4">Free Shipping <div className="text-sm text-slate-500">On orders over 500 EGP</div></div>
          <div className="rounded-lg border border-slate-200 bg-white p-4">Secure Payment <div className="text-sm text-slate-500">100% secure transactions</div></div>
          <div className="rounded-lg border border-slate-200 bg-white p-4">Easy Returns <div className="text-sm text-slate-500">14-day return policy</div></div>
          <div className="rounded-lg border border-slate-200 bg-white p-4">24/7 Support <div className="text-sm text-slate-500">Dedicated support team</div></div>
        </div>
      </section>

      {/* Shop By Category */}
      <section className="my-12">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="flex items-center gap-3 text-2xl font-semibold text-slate-900"><span className="h-8 w-1 rounded bg-emerald-600"/>Shop By Category</h2>
          <Link to="#" className="text-emerald-600">View All Categories →</Link>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6">
          {loadingCategories ? (
            Array.from({ length: 8 }).map((_, i) => <div key={i} className="h-36 rounded-xl bg-slate-50" />)
          ) : (
            categories.map((c, idx) => <CategoryCard key={idx} category={c} />)
          )}
        </div>
      </section>

      {/* Promo banners */}
      <section className="my-12 grid gap-6 md:grid-cols-2">
        <div className="rounded-2xl bg-gradient-to-br from-emerald-600 to-emerald-500 p-8 text-white">
          <div className="rounded-xl bg-white/10 p-2 text-sm">🔥 Deal of the Day</div>
          <h3 className="mt-4 text-3xl font-bold">Fresh Organic Fruits</h3>
          <p className="mt-2">Get up to 40% off on selected organic fruits</p>
          <div className="mt-6 flex items-end gap-4">
            <div className="text-3xl font-bold">40% OFF</div>
            <div className="ml-auto">
              <button className="rounded-full bg-white px-6 py-3 text-emerald-600">Shop Now →</button>
            </div>
          </div>
        </div>
        <div className="rounded-2xl bg-gradient-to-br from-orange-500 to-rose-500 p-8 text-white">
          <div className="rounded-xl bg-white/10 p-2 text-sm">✨ New Arrivals</div>
          <h3 className="mt-4 text-3xl font-bold">Exotic Vegetables</h3>
          <p className="mt-2">Discover our latest collection of premium vegetables</p>
          <div className="mt-6 flex items-end gap-4">
            <div className="text-3xl font-bold">25% OFF</div>
            <div className="ml-auto">
              <button className="rounded-full bg-white px-6 py-3 text-orange-600">Explore Now →</button>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="my-12">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="flex items-center gap-3 text-2xl font-semibold text-slate-900"><span className="h-8 w-1 rounded bg-emerald-600"/>Featured Products</h2>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {loadingProducts ? (
            Array.from({ length: 10 }).map((_, i) => <div key={i} className="h-56 rounded-lg bg-slate-50" />)
          ) : (
            products.map((p) => <ProductCard key={p.id || p._id || p.slug || p.name} product={p} />)
          )}
        </div>
      </section>
    </div>
  )
}
