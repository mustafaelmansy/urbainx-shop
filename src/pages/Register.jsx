import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { signUp } from '../api/auth'
import AuthCard from '../components/AuthCard'

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const phoneRegex = /^[0-9()+\-\s]*$/

export default function Register() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    rePassword: '',
    phone: '',
    terms: false,
  })
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState({ loading: false, message: '', error: '' })
  const navigate = useNavigate()

  // 🌟 دالة مساعدة لتحديث قيمة الـ input وتصفير الأخطاء الخاصة به في نفس الوقت
  const handleInputChange = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }))
    
    // لو الـ field ده كان عليه خطأ قديم، شيله فوراً أول ما المستخدم يبدأ يكتب
    if (errors[field]) {
      setErrors((current) => {
        const next = { ...current }
        delete next[field]
        return next
      })
    }
  }

  const validate = () => {
    const nextErrors = {}
    if (!form.name.trim()) nextErrors.name = 'Name is required.'
    if (!form.email) nextErrors.email = 'Email is required.'
    else if (!emailRegex.test(form.email)) nextErrors.email = 'Enter a valid email.'
    if (!form.password) nextErrors.password = 'Password is required.'
    else if (form.password.length < 8) nextErrors.password = 'Password must be at least 8 characters.'
    if (!form.rePassword) nextErrors.rePassword = 'Confirm your password.'
    else if (form.password !== form.rePassword) nextErrors.rePassword = 'Passwords do not match.'
    if (!form.phone) nextErrors.phone = 'Phone number is required.'
    else if (!phoneRegex.test(form.phone)) nextErrors.phone = 'Enter a valid phone number.'
    if (!form.terms) nextErrors.terms = 'You must agree to the terms.'
    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    // بنصفر الـ status والـ error المسج القديم عشان الـ request الجديد يبدأ نظيف
    setStatus({ loading: false, message: '', error: '' })
    if (!validate()) return

    try {
      setStatus((prev) => ({ ...prev, loading: true }))
      const response = await signUp({
        name: form.name,
        email: form.email,
        password: form.password,
        rePassword: form.rePassword,
        phone: form.phone,
      })
      localStorage.setItem('freshcartToken', response?.data?.token ?? '')
      setStatus({ loading: false, message: 'Account created successfully!', error: '' })
      navigate('/login')
    } catch (error) {
      const message = error?.response?.data?.message || error.message || 'Unable to register.'
      setStatus({ loading: false, message: '', error: message })
    }
  }

  return (
    <div className="mx-auto flex min-h-[calc(100vh-80px)] max-w-7xl flex-col justify-center px-4 py-10 sm:px-6 lg:px-8">
      <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="rounded-[32px] bg-white p-8 shadow-[0_30px_70px_rgba(15,23,42,0.08)] sm:p-10">
          <div className="mb-8">
            {/* ✨ تعديل المسمى هنا لـ Urbainx */}
            <div className="mb-3 inline-flex items-center rounded-full bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700">
              Urbainx shop Register
            </div>
            {/* ✨ تعديل المسمى هنا لـ Urbainx */}
            <h1 className="text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl">
              Welcome to Urbainx shop
            </h1>
            <p className="mt-4 max-w-lg text-sm leading-7 text-slate-600 sm:text-base">
              Join thousands of happy customers who enjoy premium shopping delivered right to their doorstep.
            </p>
          </div>

          <div className="space-y-5 rounded-3xl border border-slate-200 bg-slate-50 p-6">
            <div className="flex items-start gap-4">
              <div className="mt-1 h-10 w-10 rounded-3xl bg-white text-emerald-600 grid place-items-center text-lg shadow-sm">✓</div>
              <div>
                <h2 className="font-semibold text-slate-900">Premium Quality</h2>
                <p className="mt-1 text-sm text-slate-600">Premium quality products sourced from trusted suppliers.</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="mt-1 h-10 w-10 rounded-3xl bg-white text-emerald-600 grid place-items-center text-lg shadow-sm">🚚</div>
              <div>
                <h2 className="font-semibold text-slate-900">Fast Delivery</h2>
                <p className="mt-1 text-sm text-slate-600">Same-day delivery available in most areas.</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="mt-1 h-10 w-10 rounded-3xl bg-white text-emerald-600 grid place-items-center text-lg shadow-sm">🔒</div>
              <div>
                <h2 className="font-semibold text-slate-900">Secure Shopping</h2>
                <p className="mt-1 text-sm text-slate-600">Your data and payments are completely secure.</p>
              </div>
            </div>
          </div>
        </div>

        <AuthCard
          title="Create Your Account"
          subtitle="Start your fresh journey with us today."
          status={status}
          footer={
            <p className="text-sm text-slate-600">
              Already have an account?{' '}
              <Link to="/login" className="font-semibold text-emerald-600 hover:text-emerald-700">
                Sign In
              </Link>
            </p>
          }
        >
          <form className="mt-6 space-y-5" onSubmit={handleSubmit} noValidate>
            <div className="grid gap-5 sm:grid-cols-2">
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-slate-700">Name</span>
                <input
                  type="text"
                  value={form.name}
                  onChange={(event) => handleInputChange('name', event.target.value)}
                  className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
                  placeholder="Ali"
                />
                {errors.name && <p className="mt-2 text-sm text-rose-600">{errors.name}</p>}
              </label>
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-slate-700">Email</span>
                <input
                  type="email"
                  value={form.email}
                  onChange={(event) => handleInputChange('email', event.target.value)}
                  className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
                  placeholder="ali@example.com"
                />
                {errors.email && <p className="mt-2 text-sm text-rose-600">{errors.email}</p>}
              </label>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-slate-700">Password</span>
                <input
                  type="password"
                  value={form.password}
                  onChange={(event) => handleInputChange('password', event.target.value)}
                  className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
                  placeholder="create a strong password"
                />
                {errors.password && <p className="mt-2 text-sm text-rose-600">{errors.password}</p>}
              </label>
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-slate-700">Confirm Password</span>
                <input
                  type="password"
                  value={form.rePassword}
                  onChange={(event) => handleInputChange('rePassword', event.target.value)}
                  className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
                  placeholder="confirm your password"
                />
                {errors.rePassword && <p className="mt-2 text-sm text-rose-600">{errors.rePassword}</p>}
              </label>
            </div>

            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-700">Phone Number</span>
              <input
                type="tel"
                value={form.phone}
                onChange={(event) => handleInputChange('phone', event.target.value)}
                className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
                placeholder="+1 234 567 8900"
              />
              {errors.phone && <p className="mt-2 text-sm text-rose-600">{errors.phone}</p>}
            </label>

            <label className="flex items-start gap-3 text-sm leading-6 text-slate-700">
              <input
                type="checkbox"
                checked={form.terms}
                onChange={(event) => handleInputChange('terms', event.target.checked)}
                className="mt-1 h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
              />
              <span>
                I agree to the <span className="font-semibold text-emerald-600">Terms of Service</span> and <span className="font-semibold text-emerald-600">Privacy Policy</span>.
              </span>
            </label>
            {errors.terms && <p className="text-sm text-rose-600">{errors.terms}</p>}

            <button
              type="submit"
              className="inline-flex w-full items-center justify-center rounded-3xl bg-emerald-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed"
              disabled={status.loading}
            >
              {status.loading ? 'Creating account…' : 'Create My Account'}
            </button>
          </form>
        </AuthCard>
      </div>
    </div>
  )
}