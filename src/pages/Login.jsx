import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { signIn } from '../api/auth'
import AuthCard from '../components/AuthCard'

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' })
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState({ loading: false, message: '', error: '' })
  const navigate = useNavigate()

  const validate = () => {
    const nextErrors = {}
    if (!form.email) nextErrors.email = 'Email is required.'
    else if (!emailRegex.test(form.email)) nextErrors.email = 'Enter a valid email.'
    if (!form.password) nextErrors.password = 'Password is required.'
    else if (form.password.length < 8) nextErrors.password = 'Password must be at least 8 characters.'
    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setStatus({ loading: false, message: '', error: '' })
    if (!validate()) return

    try {
      setStatus((prev) => ({ ...prev, loading: true }))
      const response = await signIn(form)
      localStorage.setItem('freshcartToken', response?.data?.token ?? '')
      setStatus({ loading: false, message: 'Signed in successfully!', error: '' })
      navigate('/')
    } catch (error) {
      const message = error?.response?.data?.message || error.message || 'Unable to sign in.'
      setStatus({ loading: false, message: '', error: message })
    }
  }

  return (
    <div className="mx-auto flex min-h-[calc(100vh-80px)] max-w-7xl flex-col justify-center px-4 py-10 sm:px-6 lg:px-8">
      <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="hidden rounded-[32px] bg-white p-10 shadow-[0_30px_70px_rgba(15,23,42,0.08)] lg:block">
          <div className="max-w-xl">
            <div className="mb-8 inline-flex items-center rounded-full bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700">
              FreshCart Sign In
            </div>
            <h1 className="text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl">
              Welcome Back!
            </h1>
            <p className="mt-4 text-sm leading-7 text-slate-600 sm:text-base">
              Sign in to continue your fresh shopping experience.
            </p>

            <div className="mt-10 space-y-5 rounded-3xl border border-slate-200 bg-slate-50 p-6">
              <div className="flex items-start gap-4">
                <div className="mt-1 h-10 w-10 rounded-3xl bg-emerald-600 text-white grid place-items-center text-xl">✓</div>
                <div>
                  <h2 className="font-semibold text-slate-900">Free delivery updates</h2>
                  <p className="mt-1 text-sm text-slate-600">Get notified about the latest offers and delivery status.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="mt-1 h-10 w-10 rounded-3xl bg-emerald-600 text-white grid place-items-center text-xl">★</div>
                <div>
                  <h2 className="font-semibold text-slate-900">Secure payments</h2>
                  <p className="mt-1 text-sm text-slate-600">Your data stays safe with encryption and secure endpoints.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="mt-1 h-10 w-10 rounded-3xl bg-emerald-600 text-white grid place-items-center text-xl">⏱</div>
                <div>
                  <h2 className="font-semibold text-slate-900">24/7 support</h2>
                  <p className="mt-1 text-sm text-slate-600">Our team is available to help you whenever you need it.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <AuthCard
          title="Sign in to FreshCart"
          subtitle="Access your account and start shopping with ease."
          status={status}
          footer={
            <p className="text-sm text-slate-600">
              New to FreshCart?{' '}
              <Link to="/register" className="font-semibold text-emerald-600 hover:text-emerald-700">
                Create an account
              </Link>
            </p>
          }
        >
          <div className="grid gap-3 sm:grid-cols-2">
            <button className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50">
              <span className="text-red-500">G</span> Continue with Google
            </button>
            <button className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50">
              <span className="text-blue-600">f</span> Continue with Facebook
            </button>
          </div>

          <div className="relative my-8">
            <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 border-t border-slate-200" />
            <div className="relative mx-auto w-fit bg-white px-3 text-sm text-slate-500">or continue with email</div>
          </div>

          <form className="mt-6 space-y-5" onSubmit={handleSubmit} noValidate>
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-700">Email Address</span>
              <input
                type="email"
                value={form.email}
                onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
                className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
                placeholder="Enter your email"
              />
              {errors.email && <p className="mt-2 text-sm text-rose-600">{errors.email}</p>}
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-700">Password</span>
              <input
                type="password"
                value={form.password}
                onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))}
                className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
                placeholder="Enter your password"
              />
              {errors.password && <p className="mt-2 text-sm text-rose-600">{errors.password}</p>}
            </label>

            <div className="flex items-center justify-between text-sm leading-6 text-slate-600">
              <label className="flex items-center gap-3">
                <input type="checkbox" className="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500" />
                Keep me signed in
              </label>
              <button type="button" className="text-emerald-600 hover:text-emerald-700">
                Forgot Password?
              </button>
            </div>

            <button
              type="submit"
              className="inline-flex w-full items-center justify-center rounded-3xl bg-emerald-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
              disabled={status.loading}
            >
              {status.loading ? 'Signing in…' : 'Sign In'}
            </button>
          </form>
        </AuthCard>
      </div>
    </div>
  )
}
