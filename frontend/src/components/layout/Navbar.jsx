import { BookOpen, ClipboardCheck, Home, Library, LibraryBig, Lock } from 'lucide-react'
import { NavLink } from 'react-router-dom'

const links = [
  ['/', 'Cari Buku', Home],
  ['/koleksi', 'Koleksi Terbaru', LibraryBig],
  ['/tata-tertib', 'Tata Tertib', ClipboardCheck],
  ['/cek-pinjaman', 'Cek Pinjaman', BookOpen],
]

export default function Navbar() {
  return (
    <header className="sticky top-0 z-30 border-b-[2.5px] border-red bg-white">
      <div className="mx-auto flex min-h-[60px] max-w-7xl flex-wrap items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
        <NavLink to="/" className="flex items-center gap-3 py-2">
          <span className="grid h-[34px] w-[34px] place-items-center rounded-[8px] bg-red text-white">
            <Library size={18} strokeWidth={2} />
          </span>
          <span className="brand text-[18px] font-extrabold text-red-dark">Perpustakaan SDN</span>
        </NavLink>
        <nav className="flex flex-wrap items-center gap-1 pb-2 sm:pb-0">
          {links.map(([to, label, Icon]) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `inline-flex min-h-10 items-center gap-2 rounded-[8px] px-3 py-2 text-[14px] font-bold transition ${
                  isActive ? 'bg-red-light text-red' : 'text-[var(--text-sec)] hover:bg-red-light hover:text-red'
                }`
              }
            >
              <Icon size={18} strokeWidth={2} />
              {label}
            </NavLink>
          ))}
          <NavLink to="/admin/login" className="inline-flex min-h-10 items-center gap-2 rounded-[8px] bg-red px-3 py-2 text-[14px] font-extrabold text-white hover:bg-red-dark">
            <Lock size={18} strokeWidth={2} />
            Login Admin
          </NavLink>
        </nav>
      </div>
    </header>
  )
}
