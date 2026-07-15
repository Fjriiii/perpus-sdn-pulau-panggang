import { CheckCircle2, ClipboardList, X } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import WaLogModal from '../../components/admin/WaLogModal'
import Badge from '../../components/ui/Badge'
import SectionTitle from '../../components/ui/SectionTitle'
import api from '../../services/api'

const statusTone = {
  pending: ['warning', 'Menunggu'],
  approved: ['success', 'Disetujui'],
  rejected: ['danger', 'Ditolak'],
}

export default function RequestsPage() {
  const [reservations, setReservations] = useState([])
  const [waLog, setWaLog] = useState(null)

  const load = () => api.get('/admin/reservations').then(({ data }) => setReservations(data.data || []))

  useEffect(() => {
    load()
  }, [])

  const approve = async (id) => {
    const { data } = await api.post(`/admin/reservations/${id}/approve`)
    setWaLog(data.wa_log)
    load()
  }

  const reject = async (id) => {
    await api.post(`/admin/reservations/${id}/reject`)
    load()
  }

  const pendingCount = useMemo(() => reservations.filter((item) => item.status === 'pending').length, [reservations])

  return (
    <section>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <SectionTitle>Permintaan Pinjam</SectionTitle>
        <Badge variant="danger" size="md">{pendingCount} Menunggu</Badge>
      </div>
      <div className="table-shell mt-5">
        {reservations.length === 0 ? (
          <div className="empty-state"><ClipboardList size={40} />Belum ada permintaan pinjam.</div>
        ) : (
          <table className="data-table min-w-[1180px]">
            <thead>
              <tr>
                {['#', 'Nama Siswa', 'NISN', 'Kelas', 'Judul Buku', 'Tgl Pinjam', 'Tgl Kembali', 'No. WA Ortu', 'Status', 'Aksi'].map((head) => <th key={head}>{head}</th>)}
              </tr>
            </thead>
            <tbody>
              {reservations.map((item, index) => {
                const [variant, label] = statusTone[item.status] || statusTone.pending
                return (
                  <tr key={item.id}>
                    <td>{index + 1}</td>
                    <td className="font-bold">{item.student_name}</td>
                    <td>{item.nisn}</td>
                    <td>{item.kelas}</td>
                    <td>{item.book?.title}</td>
                    <td>{item.loan_date}</td>
                    <td>{item.return_due_date}</td>
                    <td>{item.parent_wa}</td>
                    <td><Badge variant={variant}>{label}</Badge></td>
                    <td>
                      {item.status === 'pending' && (
                        <div className="flex gap-2">
                          <button onClick={() => approve(item.id)} className="inline-flex items-center gap-1 rounded-[8px] bg-[var(--success)] px-3 py-2 font-bold text-white"><CheckCircle2 size={18} strokeWidth={2} /> Setujui</button>
                          <button onClick={() => reject(item.id)} className="inline-flex items-center gap-1 rounded-[8px] border-2 border-red px-3 py-2 font-bold text-red hover:bg-red-light"><X size={18} strokeWidth={2} /> Tolak</button>
                        </div>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}
      </div>
      <WaLogModal open={Boolean(waLog)} log={waLog} onClose={() => setWaLog(null)} />
    </section>
  )
}
