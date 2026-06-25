import React from 'react'

export default function CategoryCard({ category }) {
  const name = category.name || category.title || 'Category'
  const img = category.image || category.icon || '/category-placeholder.png'

  return (
    <div className="group flex flex-col items-center justify-center gap-2 rounded-2xl border border-slate-50 bg-white p-4 text-center shadow-sm transition-shadow hover:shadow-md">
      <div className="w-20">
        <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-slate-100 p-1 bg-white mb-2 shadow-sm transition-transform duration-300 group-hover:scale-105">
          <img src={img} alt={name} className="h-full w-full object-cover" />
        </div>
      </div>
      <div className="text-xs font-semibold text-slate-700 group-hover:text-emerald-600 transition-colors">{name}</div>
    </div>
  )
}
