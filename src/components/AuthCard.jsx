export default function AuthCard({ title, subtitle, status, children, footer }) {
  return (
    <div className="rounded-[32px] bg-white p-8 shadow-[0_30px_70px_rgba(15,23,42,0.08)] sm:p-10">
      <div className="mb-8">
        <div className="text-sm font-semibold uppercase tracking-[0.24em] text-emerald-600">FreshCart</div>
        <h2 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">{title}</h2>
        <p className="mt-3 text-sm leading-6 text-slate-600">{subtitle}</p>
      </div>

      {status?.error && (
        <div className="rounded-3xl bg-rose-50 p-4 text-sm text-rose-700">{status.error}</div>
      )}
      {status?.message && (
        <div className="rounded-3xl bg-emerald-50 p-4 text-sm text-emerald-700">{status.message}</div>
      )}

      <div className="mt-6">{children}</div>

      {footer && <div className="mt-6 text-center text-sm text-slate-600">{footer}</div>}
    </div>
  )
}
