import { X } from 'lucide-react'

export default function Modal({ open, title, children, footer, onClose, size = 'max-w-lg' }) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/50 p-4">
      <section className={`max-h-[92vh] w-full ${size} overflow-hidden rounded-[13px] border-2 border-red bg-white`}>
        <header className="flex items-center justify-between bg-red px-5 py-4 text-white">
          <h2 className="font-display text-[20px] font-extrabold">{title}</h2>
          <button type="button" onClick={onClose} className="grid h-9 w-9 place-items-center rounded-[8px] text-white hover:bg-white/15" aria-label="Tutup">
            <X size={18} />
          </button>
        </header>
        <div className="max-h-[68vh] overflow-y-auto px-5 py-4">{children}</div>
        {footer && <footer className="flex flex-wrap justify-end gap-2 border-t-2 border-[var(--border)] px-5 py-4">{footer}</footer>}
      </section>
    </div>
  )
}
