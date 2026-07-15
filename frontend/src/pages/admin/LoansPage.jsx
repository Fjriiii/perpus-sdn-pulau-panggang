import { BookOpen, Plus } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import Badge from '../../components/ui/Badge'
import Modal from '../../components/ui/Modal'
import SectionTitle from '../../components/ui/SectionTitle'
import api from '../../services/api'

function todayString(offset = 0) {
  const date = new Date()
  date.setDate(date.getDate() + offset)
  return date.toISOString().slice(0, 10)
}

function loanBadge(status) {
  if (status === 'returned') return <Badge variant="success">Dikembalikan</Badge>
  if (status === 'overdue') return <Badge variant="danger">Terlambat</Badge>
  return <Badge variant="info">Aktif</Badge>
}

export default function LoansPage() {
  const [loans, setLoans] = useState([])
  const [members, setMembers] = useState([])
  const [books, setBooks] = useState([])
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState({ member_id: '', book_id: '', loan_date: todayString(), return_due_date: todayString(7) })

  const load = async () => {
    const [loanRes, memberRes, bookRes] = await Promise.all([
      api.get('/admin/loans'),
      api.get('/admin/members'),
      api.get('/admin/books'),
    ])
    setLoans(loanRes.data.data || [])
    setMembers(memberRes.data.data || [])
    setBooks(bookRes.data.data || [])
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void load()
  }, [])

  const availableBooks = useMemo(() => books.filter((book) => (book.available_qty ?? 0) > 0), [books])

  const setLoanDate = (value) => {
    const date = new Date(value)
    date.setDate(date.getDate() + 7)
    setForm({ ...form, loan_date: value, return_due_date: date.toISOString().slice(0, 10) })
  }

  const submit = async (event) => {
    event.preventDefault()
    await api.post('/admin/loans', form)
    setOpen(false)
    setForm({ member_id: '', book_id: '', loan_date: todayString(), return_due_date: todayString(7) })
    load()
  }

  return (
    <section>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <SectionTitle count={`${loans.length} data`}>Peminjaman</SectionTitle>
        <button onClick={() => setOpen(true)} className="inline-flex items-center gap-2 rounded-[8px] bg-gold px-4 py-2 font-extrabold text-white hover:bg-gold-dark"><Plus size={18} /> Pinjam Buku</button>
      </div>
      <div className="table-shell mt-6">
        {loans.length === 0 ? (
          <div className="empty-state"><BookOpen size={40} />Belum ada data peminjaman.</div>
        ) : (
          <table className="data-table min-w-[920px]">
            <thead>
              <tr>{['#', 'Nama', 'NISN', 'Judul Buku', 'Tgl Pinjam', 'Tgl Kembali', 'Status'].map((head) => <th key={head}>{head}</th>)}</tr>
            </thead>
            <tbody>
              {loans.map((loan, index) => (
                <tr key={loan.id}>
                  <td>{index + 1}</td>
                  <td className="font-bold">{loan.member?.name}</td>
                  <td>{loan.member?.nisn}</td>
                  <td>{loan.book?.title}</td>
                  <td>{loan.loan_date}</td>
                  <td>{loan.return_due_date}</td>
                  <td>{loanBadge(loan.status)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      <Modal open={open} title="Pinjam Buku" onClose={() => setOpen(false)} footer={<button form="loan-form" className="rounded-[8px] bg-gold px-4 py-2 font-bold text-white hover:bg-gold-dark">Simpan</button>}>
        <form id="loan-form" onSubmit={submit} className="grid gap-3">
          <label className="grid gap-1 text-[15px] font-bold text-[var(--text-sec)]">Anggota
            <select required value={form.member_id} onChange={(e) => setForm({ ...form, member_id: e.target.value })} className="input-control">
              <option value="">Pilih anggota</option>
              {members.map((member) => <option key={member.id} value={member.id}>{member.name} - {member.nisn}</option>)}
            </select>
          </label>
          <label className="grid gap-1 text-[15px] font-bold text-[var(--text-sec)]">Buku
            <select required value={form.book_id} onChange={(e) => setForm({ ...form, book_id: e.target.value })} className="input-control">
              <option value="">Pilih buku tersedia</option>
              {availableBooks.map((book) => <option key={book.id} value={book.id}>{book.title} ({book.available_qty})</option>)}
            </select>
          </label>
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="grid gap-1 text-[15px] font-bold text-[var(--text-sec)]">Tgl Pinjam
              <input type="date" value={form.loan_date} onChange={(e) => setLoanDate(e.target.value)} className="input-control" />
            </label>
            <label className="grid gap-1 text-[15px] font-bold text-[var(--text-sec)]">Tgl Kembali
              <input readOnly value={form.return_due_date} className="input-control bg-slate-100" />
            </label>
          </div>
        </form>
      </Modal>
    </section>
  )
}
