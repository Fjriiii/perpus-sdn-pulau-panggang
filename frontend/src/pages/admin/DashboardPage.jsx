import { AlertTriangle, BarChart3, Bell, BookMarked, CheckCircle2, Clock, Hash, Search, Users } from 'lucide-react'
import { useEffect, useState } from 'react'
import Badge from '../../components/ui/Badge'
import SectionTitle from '../../components/ui/SectionTitle'
import StatCard from '../../components/ui/StatCard'
import api from '../../services/api'

export default function DashboardPage() {
  const [data, setData] = useState({ stats: {}, overdue_loans: [], smart_search_analytics: {} })

  useEffect(() => {
    api.get('/admin/stats').then(({ data }) => setData(data))
  }, [])

  const stats = data.stats || {}
  const smartSearch = data.smart_search_analytics || {}
  const topKeywords = smartSearch.top_keywords || smartSearch.most_searched_keywords || []
  const maxKeywordCount = Math.max(1, ...topKeywords.map((item) => item.count || 0))
  const overdueLoans = data.overdue_loans || []

  return (
    <section>
      <SectionTitle>Dashboard Admin</SectionTitle>
      <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <StatCard label="Total Buku" value={stats.total_books} suffix=" Buku" icon={BookMarked} iconBg="red" iconSize={28} />
        <StatCard label="Anggota Aktif" value={stats.active_members} suffix=" Siswa" icon={Users} iconBg="blue" iconSize={28} />
        <StatCard label="Sedang Dipinjam" value={stats.borrowed_books} icon={Clock} iconBg="gold" iconSize={28} />
        <StatCard label="Terlambat" value={stats.overdue_loans} icon={AlertTriangle} danger={stats.overdue_loans > 0} iconSize={28} />
        <StatCard label="Menunggu Approval" value={stats.pending_reservations} icon={Bell} iconBg="gold" danger={stats.pending_reservations > 0} iconSize={28} />
      </div>

      <div className="mt-7">
        <SectionTitle>Analitik Smart Search</SectionTitle>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard label="Total Pencarian" value={smartSearch.total_searches} icon={Search} iconBg="red" />
          <StatCard label="Rata-rata Waktu" value={`${smartSearch.avg_search_time || 0} ms`} icon={Clock} iconBg="gold" />
          <StatCard label="Keyword Terpopuler" value={smartSearch.most_used_keyword || '-'} icon={Hash} iconBg="blue" />
          <StatCard label="Rata-rata Hasil" value={smartSearch.avg_result_count || 0} icon={BarChart3} iconBg="green" />
        </div>
        <div className="app-card mt-4 p-4">
          <h3 className="font-display text-[19px] font-extrabold text-[var(--text)]">Kata Kunci Terpopuler</h3>
          <div className="mt-4 space-y-3">
            {topKeywords.length === 0 && <div className="empty-state"><Search size={40} />Belum ada data pencarian.</div>}
            {topKeywords.map((item) => (
              <div key={item.keyword} className="grid gap-2 sm:grid-cols-[150px_1fr_52px] sm:items-center">
                <span className="font-extrabold text-[var(--text-sec)]">{item.keyword}</span>
                <div className="h-3 overflow-hidden rounded-full bg-red-light">
                  <div className="h-full rounded-full bg-gold" style={{ width: `${Math.max(8, ((item.count || 0) / maxKeywordCount) * 100)}%` }} />
                </div>
                <span className="font-bold text-[var(--text-muted)]">{item.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-7">
        <SectionTitle>Peminjaman Terlambat</SectionTitle>
        <div className="table-shell mt-4">
          {overdueLoans.length === 0 ? (
            <div className="empty-state text-[var(--success)]"><CheckCircle2 size={40} />Tidak ada peminjaman terlambat</div>
          ) : (
            <table className="data-table min-w-[760px]">
              <thead>
                <tr>
                  <th>Nama</th>
                  <th>NISN</th>
                  <th>Judul Buku</th>
                  <th>Tgl Kembali</th>
                  <th>Hari Terlambat</th>
                </tr>
              </thead>
              <tbody>
                {overdueLoans.map((loan) => (
                  <tr key={loan.id}>
                    <td className="font-bold">{loan.member?.name}</td>
                    <td>{loan.member?.nisn}</td>
                    <td>{loan.book?.title}</td>
                    <td>{loan.return_due_date}</td>
                    <td><Badge variant="danger">{loan.days_late} hari</Badge></td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </section>
  )
}
