import { BookCopy, ClipboardList, Home, LogOut, RotateCcw, Users, WalletCards } from 'lucide-react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'

const links = [
  ['/admin', 'Dashboard', Home],
  ['/admin/requests', 'Permintaan Pinjam', ClipboardList],
  ['/admin/books', 'Manajemen Buku', BookCopy],
  ['/admin/members', 'Manajemen Anggota', Users],
  ['/admin/loans', 'Peminjaman', WalletCards],
  ['/admin/returns', 'Pengembalian', RotateCcw],
]

export default function Sidebar() {
  const { logout, username } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate('/admin/login')
  }

  return (
    <aside className="bg-red-dark text-white lg:min-h-screen lg:w-72">
      <div className="flex items-center justify-between gap-3 px-5 py-5 lg:block">
        <div>
          <p className="brand text-[22px] font-extrabold">Admin Library</p>
          <p className="mt-1 text-[13px] font-bold text-white/70">{username || 'admin'}</p>
        </div>
        <button onClick={handleLogout} className="grid h-10 w-10 place-items-center rounded-[8px] border border-white/15 text-white/70 hover:bg-white/10 hover:text-white lg:hidden" aria-label="Logout">
          <LogOut size={20} strokeWidth={2} />
        </button>
      </div>
      <nav className="flex gap-1 overflow-x-auto px-3 pb-3 lg:block lg:space-y-1 lg:overflow-visible">
        {links.map(([to, label, Icon]) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/admin'}
            className={({ isActive }) =>
              `flex min-w-max items-center gap-3 rounded-[8px] border-l-[3px] px-3 py-3 text-[14px] font-bold transition ${
                isActive ? 'border-l-gold bg-white/15 text-white' : 'border-l-transparent text-white/75 hover:bg-white/10 hover:text-white'
              }`
            }
          >
            <Icon size={20} strokeWidth={2} />
            {label}
          </NavLink>
        ))}
      </nav>
      <div className="hidden border-t border-white/15 p-3 lg:block">
        <button onClick={handleLogout} className="flex w-full items-center gap-3 rounded-[8px] px-3 py-3 text-left text-[14px] font-bold text-white/60 hover:bg-white/10 hover:text-white">
          <LogOut size={20} strokeWidth={2} />
          Logout
        </button>
      </div>
    </aside>
  )
}
