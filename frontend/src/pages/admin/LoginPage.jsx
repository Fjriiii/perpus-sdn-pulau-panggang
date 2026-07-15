import { Library, Lock, User } from 'lucide-react'
import { useState } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'

export default function LoginPage() {
  const { login, isAuthenticated } = useAuth()
  const [form, setForm] = useState({ username: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  if (isAuthenticated) return <Navigate to="/admin" replace />

  const submit = async (event) => {
    event.preventDefault()
    setLoading(true)
    setError('')
    try {
      await login(form)
    } catch (err) {
      setError(err.response?.data?.error || 'Login gagal')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="grid min-h-screen place-items-center bg-[var(--bg)] px-4">
      <form onSubmit={submit} className="w-full max-w-[380px] rounded-[14px] border-2 border-[var(--border)] bg-white p-6">
        <div className="text-center">
          <div className="mx-auto grid h-[60px] w-[60px] place-items-center rounded-[14px] bg-red text-white">
            <Library size={28} />
          </div>
          <h1 className="mt-4 font-display text-[28px] font-extrabold text-[var(--text)]">Login Admin</h1>
          <p className="mt-1 text-[15px] text-[var(--text-sec)]">Petugas Perpustakaan SDN Pulau Panggang 02 Pagi</p>
        </div>
        {error && <p className="mt-4 rounded-[8px] border-[1.5px] border-[var(--danger-border)] bg-[var(--danger-bg)] px-3 py-2 text-[14px] font-bold text-[var(--danger)]">{error}</p>}
        <label className="mt-5 grid gap-2 text-[15px] font-bold text-[var(--text-sec)]">Username
          <span className="flex items-center gap-2 rounded-[8px] border-2 border-[var(--border)] px-3 focus-within:border-red focus-within:shadow-[0_0_0_4px_rgba(192,57,43,0.15)]">
            <User size={18} className="text-[var(--text-muted)]" />
            <input autoComplete="username" value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} className="h-11 flex-1 border-0 outline-none focus:shadow-none" />
          </span>
        </label>
        <label className="mt-3 grid gap-2 text-[15px] font-bold text-[var(--text-sec)]">Password
          <span className="flex items-center gap-2 rounded-[8px] border-2 border-[var(--border)] px-3 focus-within:border-red focus-within:shadow-[0_0_0_4px_rgba(192,57,43,0.15)]">
            <Lock size={18} className="text-[var(--text-muted)]" />
            <input type="password" autoComplete="current-password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className="h-11 flex-1 border-0 outline-none focus:shadow-none" />
          </span>
        </label>
        <button disabled={loading} className="mt-5 h-11 w-full rounded-[8px] bg-red text-[15px] font-extrabold text-white hover:bg-red-dark disabled:opacity-60">Login</button>
      </form>
    </main>
  )
}
