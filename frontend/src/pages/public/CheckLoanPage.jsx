import { ClipboardList, Search } from 'lucide-react'
import { useState } from 'react'
import Badge from '../../components/ui/Badge'
import SectionTitle from '../../components/ui/SectionTitle'
import api from '../../services/api'

function statusBadge(loan) {
  if (loan.status === 'returned') return <Badge variant="success">Dikembalikan</Badge>
  if (loan.status === 'overdue') return <Badge variant="danger">Terlambat</Badge>
  return <Badge variant="info">Aktif</Badge>
}

export default function CheckLoanPage() {
  const [nisn, setNisn] = useState('')
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')

  const submit = async (event) => {
    event.preventDefault()
    setError('')
    setResult(null)
    try {
      const { data } = await api.get(`/members/check/${nisn}`)
      setResult(data)
    } catch (err) {
      setError(err.response?.data?.message || 'Data tidak ditemukan')
    }
  }

  const hasRows = result && ((result.loans || []).length > 0 || (result.reservations || []).length > 0)

  return (
    <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[500px]">
        <SectionTitle>Cek Status Peminjaman</SectionTitle>
        <form onSubmit={submit} className="app-card mt-5 grid gap-3 p-5">
          <label className="grid gap-2 text-[15px] font-bold text-[var(--text-sec)]">
            NISN
            <input value={nisn} onChange={(event) => setNisn(event.target.value)} placeholder="Masukkan NISN" className="input-control" />
          </label>
          <button className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-[8px] bg-red px-4 text-[15px] font-extrabold text-white hover:bg-red-dark">
            <Search size={18} />
            Cek Sekarang
          </button>
        </form>
        {error && <p className="mt-4 rounded-[8px] border-[1.5px] border-[var(--warning-border)] bg-[var(--warning-bg)] px-4 py-3 font-bold text-gold-dark">{error}</p>}
      </div>

      {result && (
        <div className="table-shell mt-6">
          {hasRows ? (
            <table className="data-table min-w-[720px]">
              <thead>
                <tr>
                  <th>Judul Buku</th>
                  <th>Tgl Pinjam</th>
                  <th>Tgl Kembali</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {(result.loans || []).map((loan) => (
                  <tr key={`loan-${loan.id}`}>
                    <td className="font-bold">{loan.book?.title}</td>
                    <td>{loan.loan_date}</td>
                    <td>{loan.return_due_date}</td>
                    <td>{statusBadge(loan)}</td>
                  </tr>
                ))}
                {(result.reservations || []).map((reservation) => (
                  <tr key={`reservation-${reservation.id}`}>
                    <td className="font-bold">{reservation.book?.title}</td>
                    <td>{reservation.loan_date}</td>
                    <td>{reservation.return_due_date}</td>
                    <td><Badge variant="warning">Menunggu Approval</Badge></td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="empty-state"><ClipboardList size={40} />Tidak ada peminjaman aktif.</div>
          )}
        </div>
      )}
    </main>
  )
}
