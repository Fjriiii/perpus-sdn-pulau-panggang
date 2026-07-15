import { Bookmark, PackageCheck } from 'lucide-react'
import { getCategoryConfig } from '../../utils/categoryIconMap'
import Badge from './Badge'
import CategoryBadge from './CategoryBadge'
import CategoryIcon from './CategoryIcon'

export default function BookCard({ book, title, author, category, year, isAvailable, onReserve, isNew = false }) {
  const item = book || { title, author, category, year, is_available: isAvailable }
  const available = item.available_qty ?? Math.max(0, (item.total_qty || 0) - (item.borrowed_qty || 0))
  const availableState = item.is_available ?? isAvailable ?? available > 0
  const matchedTokens = item.matched_tokens || []
  const categoryConfig = getCategoryConfig(item.category)

  return (
    <article className="app-card interactive-card relative flex min-h-[332px] flex-col p-[13px]">
      {isNew && (
        <span className="absolute right-3 top-3 rounded-full border-[1.5px] border-[var(--warning-border)] bg-gold-light px-2.5 py-1 text-[12px] font-extrabold text-gold-dark">
          BARU
        </span>
      )}
      <div className="grid h-24 place-items-center rounded-[10px] border-2 border-white" style={{ backgroundColor: categoryConfig.background }}>
        <CategoryIcon category={item.category} size={32} containerSize="lg" />
      </div>
      <div className="mt-3 flex items-start justify-between gap-2">
        <CategoryBadge category={item.category} />
        <Badge variant={availableState ? 'success' : 'danger'}>
          <PackageCheck size={13} strokeWidth={2} />
          {availableState ? available : 0}
        </Badge>
      </div>
      <h3 className="line-clamp-2 mt-3 min-h-[40px] text-[14px] font-extrabold leading-snug text-[var(--text)]">{item.title}</h3>
      <p className="line-clamp-1 mt-2 text-[13px] font-bold text-[var(--text-sec)]">{item.author}</p>
      <p className="line-clamp-2 mt-2 text-[13px] leading-5 text-[var(--text-muted)]">
        {item.year}{item.publisher ? ` - ${item.publisher}` : ''}
      </p>
      {matchedTokens.length > 0 && (
        <div className="mt-3 rounded-[8px] border-[1.5px] border-[var(--warning-border)] bg-gold-light p-3">
          <div className="flex items-center justify-between gap-2">
            <p className="text-[12px] font-extrabold uppercase text-gold-dark">Token Cocok</p>
            <span className="rounded-full bg-white px-2 py-1 text-[12px] font-extrabold text-red-dark">Score {item.relevance_score}</span>
          </div>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {matchedTokens.map((token) => (
              <span key={token} className="rounded-full bg-white px-2.5 py-1 text-[12px] font-bold text-gold-dark">{token}</span>
            ))}
          </div>
        </div>
      )}
      <div className="mt-auto pt-4">
        <button
          type="button"
          disabled={!availableState}
          onClick={() => onReserve?.(item)}
          className={`inline-flex h-11 w-full items-center justify-center gap-2 rounded-[8px] border-2 px-4 text-[15px] font-extrabold transition ${
            availableState ? 'border-red bg-red text-white hover:bg-red-dark' : 'border-slate-300 bg-slate-100 text-slate-500'
          }`}
        >
          <Bookmark size={18} strokeWidth={2} />
          {availableState ? 'Pesan Buku' : 'Stok Habis'}
        </button>
      </div>
    </article>
  )
}
