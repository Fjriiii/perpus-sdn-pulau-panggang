import { CheckCircle2, RotateCcw } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import Badge from '../../components/ui/Badge'
import SectionTitle from '../../components/ui/SectionTitle'
import api from '../../services/api'

export default function ReturnsPage() {
  const [loans, setLoans] = useState([])

  const load = () => api.get('/admin/loans').then(({ data }) => setLoans(data.data || []))
  useEffect(() => { load() }, [])

  const activeLoans = useMemo(() => loans.filter((loan) => loan.status !== 'returned'), [loans])

  const processReturn = async (loan) => {
    await api.post(`/admin/loans/${loan.id}/return`)
    load()
  }

  return (
    <section>
      <SectionTitle count={`${activeLoans.length} aktif`}>Peminjaman Aktif</SectionTitle>
      <div className="table-shell mt-6">
        {activeLoans.length === 0 ? (
          <div className="empty-state text-[var(--success)]"><CheckCircle2 size={40} />Tidak ada peminjaman aktif</div>
        ) : (
          <table className="data-table min-w-[880px]">
            <thead>
              <tr>{['#', 'Nama', 'NISN', 'Judul Buku', 'Tgl Kembali', 'Status', 'Aksi'].map((head) => <th key={head}>{head}</th>)}</tr>
            </thead>
            <tbody>
              {activeLoans.map((loan, index) => (
                <tr key={loan.id}>
                  <td>{index + 1}</td>
                  <td className="font-bold">{loan.member?.name}</td>
                  <td>{loan.member?.nisn}</td>
                  <td>{loan.book?.title}</td>
                  <td>{loan.return_due_date}</td>
                  <td><Badge variant={loan.status === 'overdue' ? 'danger' : 'info'}>{loan.status === 'overdue' ? 'Terlambat' : 'Aktif'}</Badge></td>
                  <td>
                    <button onClick={() => processReturn(loan)} className="inline-flex items-center gap-2 rounded-[8px] bg-[var(--success)] px-3 py-2 font-bold text-white hover:opacity-90">
                      <RotateCcw size={18} strokeWidth={2} />
                      Kembalikan
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </section>
  )
}
