import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'

const navItems = [
  { label: 'Home', to: '/' },
  { label: 'Sign In', to: '/login' },
  { label: 'Create Account', to: '/register' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [userName, setUserName] = useState('Guest')
  const { totalItems } = useCart()
  const navigate = useNavigate()

  useEffect(() => {
    const savedName = localStorage.getItem('userName') || localStorage.getItem('user');
    if (savedName) {
      setUserName(savedName);
    } else {
      setUserName('Guest');
    }
  }, []);

  const handleSignOut = (e) => {
    e.preventDefault();
    localStorage.removeItem('freshcartToken');
    localStorage.removeItem('userToken');
    localStorage.removeItem('token');
    localStorage.removeItem('userName');
    
    // 👇 التعديل السحري هنا: شيلنا الـ window.location واستخدمنا الـ navigate بتاعة الـ React
    navigate('/login'); 
  }

  return (
    <header className="sticky top-0 z-30 bg-white shadow-sm">
      <div className="border-b border-slate-100 bg-emerald-50 text-emerald-700">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-2 text-sm sm:px-6 lg:px-8">
          <div className="flex items-center gap-6">
            <div className="inline-flex items-center gap-2">
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none"><path d="M3 7h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
              <span>Free Shipping on Orders 500 EGP</span>
            </div>
            <div className="hidden sm:inline">New Arrivals Daily</div>
          </div>
          <div className="flex items-center gap-6">
            <div className="hidden sm:inline">+1 (800) 123-4567</div>
            <div className="hidden sm:inline">support@urbainx.com</div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium capitalize bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full">
                {userName}
              </span>
              <button 
                onClick={handleSignOut} 
                className="text-sm text-slate-700 hover:text-red-600 font-medium transition-colors cursor-pointer"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4">
          
          {/* 1. 🆕 تم تغيير اسم اللوجو والـ Brand إلى Urbainx shop مع تعديل الحرف الأول لـ U */}
          <Link to="/" className="flex items-center gap-2 text-emerald-600 shrink-0">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-100 text-xl font-bold text-emerald-700">U</div>
            <div>
              <p className="text-base font-bold text-slate-900 tracking-tight">Urbainx <span className="text-emerald-600 font-medium text-sm">shop</span></p>
            </div>
          </Link>

          <div className="flex-1 max-w-2xl">
            <div className="relative">
              <input
                className="w-full rounded-full border border-slate-200 bg-white px-4 py-2.5 pr-14 text-sm placeholder-slate-400 focus:outline-none focus:border-emerald-500"
                placeholder="Search for products, brands and more..."
              />
              <button className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-emerald-600 px-3 py-1.5 text-white text-xs">🔍</button>
            </div>
          </div>

          {/* 2. 🛠️ الحل السحري: شيلنا الـ hidden md:flex وخليناها flex على طول علشان الأيكونات تظهر في الموبايل والماك والشاشات الصغيرة */}
          <div className="flex items-center gap-2 sm:gap-4 text-slate-600 shrink-0">
            <button className="rounded-full p-2 hover:bg-slate-50 hidden xs:block">♡</button>
            
            {/* أيكونة الكارت الحالية بقت مرئية دائماً وفيها الـ Badge المظبوط بالعدد */}
            <Link to="/cart" className="relative inline-flex rounded-full p-2 hover:bg-slate-50">
              <span className="text-xl">🛒</span>
              {totalItems > 0 && (
                <span className="absolute right-0 top-0 inline-flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-emerald-600 px-[0.35rem] text-[10px] font-semibold text-white shadow-sm animate-pulse">
                  {totalItems}
                </span>
              )}
            </Link>
            
            <button className="rounded-full p-2 hover:bg-slate-50 hidden xs:block">👤</button>
            
            {/* زرار المنيو للموبايل فقط */}
            <button className="md:hidden inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700" onClick={() => setOpen((p) => !p)}>
              {open ? 'Close' : 'Menu'}
            </button>
          </div>

        </div>
      </div>

      {open && (
        <div className="border-t border-slate-200 bg-white px-4 py-5 md:hidden">
          <nav className="space-y-3">
            {navItems.map((item) => (
              <Link key={item.to} to={item.to} className="block rounded-2xl px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50" onClick={() => setOpen(false)}>{item.label}</Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  )
}