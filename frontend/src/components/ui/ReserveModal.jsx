import { useMemo, useState } from 'react'
import api from '../../services/api'
import { CLASSES } from '../../utils/categories'
import CategoryBadge from './CategoryBadge'
import CategoryIcon from './CategoryIcon'
import Modal from './Modal'

const initialForm = {
  student_name: '',
  nisn: '',
  kelas: '1A',
  parent_wa: '',
}

function toDateInput(date) {
  return date.toISOString().slice(0, 10)
}

export default function ReserveModal({ book, open, onClose, onSuccess }) {
  const [form, setForm] = useState(initialForm)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const dates = useMemo(() => {
    const loan = new Date()
    const due = new Date()
    due.setDate(loan.getDate() + 7)
    return { loan_date: toDateInput(loan), return_due_date: toDateInput(due) }
  }, [])

  const update = (field, value) => setForm((current) => ({ ...current, [field]: value }))

  const submit = async (event) => {
    event.preventDefault()
    setLoading(true)
    setError('')

    try {
      await api.post('/reservations', { ...form, ...dates, book_id: book.id })
      setForm(initialForm)
      onClose()
      onSuccess()
    } catch (err) {
      setError(err.response?.data?.message || 'Permintaan belum bisa dikirim.')
    } finally {
      setLoading(false)
    }
  }

  if (!book) return null

  return (
    <Modal
      open={open}
      title="Pesan Buku"
      onClose={onClose}
      footer={
        <>
          <button type="button" onClick={onClose} className="rounded-[8px] border-2 border-[var(--border)] px-4 py-2 font-bold text-[var(--text-sec)] hover:bg-red-light">Batal</button>
          <button form="reserve-form" type="submit" disabled={loading} className="rounded-[8px] bg-gold px-5 py-2 font-extrabold text-white hover:bg-gold-dark disabled:opacity-60">
            Ajukan
          </button>
        </>
      }
    >
      <div className="mb-4 flex gap-3 rounded-[8px] border-[1.5px] border-red/25 bg-red-light p-4">
        <CategoryIcon category={book.category} size={28} containerSize="md" />
        <div>
          <p className="font-extrabold text-red-dark">{book.title}</p>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <CategoryBadge category={book.category} />
            <span className="text-[13px] font-bold text-[var(--text-sec)]">Stok tersedia {book.available_qty}</span>
          </div>
        </div>
      </div>
      {error && <p className="mb-3 rounded-[8px] border-[1.5px] border-[var(--danger-border)] bg-[var(--danger-bg)] px-3 py-2 text-[14px] font-bold text-[var(--danger)]">{error}</p>}
      <form id="reserve-form" onSubmit={submit} className="grid gap-3">
        <label className="grid gap-1 text-[15px] font-bold text-[var(--text-sec)]">Nama Lengkap *
          <input required value={form.student_name} onChange={(e) => update('student_name', e.target.value)} className="input-control" />
        </label>
        <label className="grid gap-1 text-[15px] font-bold text-[var(--text-sec)]">NISN *
          <input required maxLength={10} value={form.nisn} onChange={(e) => update('nisn', e.target.value)} className="input-control" />
        </label>
        <label className="grid gap-1 text-[15px] font-bold text-[var(--text-sec)]">Kelas *
          <select value={form.kelas} onChange={(e) => update('kelas', e.target.value)} className="input-control">
            {CLASSES.map((kelas) => <option key={kelas}>{kelas}</option>)}
          </select>
        </label>
        <label className="grid gap-1 text-[15px] font-bold text-[var(--text-sec)]">No. WA Ortu *
          <input required value={form.parent_wa} onChange={(e) => update('parent_wa', e.target.value)} className="input-control" />
        </label>
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="grid gap-1 text-[15px] font-bold text-[var(--text-sec)]">Tanggal Pinjam
            <input readOnly value={dates.loan_date} className="input-control bg-slate-100" />
          </label>
          <label className="grid gap-1 text-[15px] font-bold text-[var(--text-sec)]">Tanggal Kembali
            <input readOnly value={dates.return_due_date} className="input-control bg-slate-100" />
          </label>
        </div>
      </form>
    </Modal>
  )
}
