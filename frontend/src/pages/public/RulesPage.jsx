import { AlertTriangle, BookOpenCheck, Clock, MapPin, MessageCircle, ShieldCheck } from 'lucide-react'
import SectionTitle from '../../components/ui/SectionTitle'

const ruleGroups = [
  {
    title: 'Peminjaman Buku',
    icon: BookOpenCheck,
    items: [
      'Siswa mengisi data peminjaman dengan NISN dan kelas yang benar.',
      'Masa pinjam buku adalah 7 hari kalender.',
      'Peminjaman berikutnya dapat dilakukan setelah pinjaman aktif selesai.',
    ],
  },
  {
    title: 'Kewajiban Siswa',
    icon: ShieldCheck,
    items: [
      'Buku wajib dikembalikan dalam kondisi baik.',
      'Buku tidak boleh dicoret, dilipat berlebihan, atau dihilangkan.',
      'Siswa menjaga ketertiban saat berada di area perpustakaan.',
    ],
  },
]

export default function RulesPage() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <SectionTitle>Tata Tertib Perpustakaan</SectionTitle>
      <div className="mt-5 grid gap-4 lg:grid-cols-2">
        {ruleGroups.map(({ title, icon: Icon, items }) => (
          <section key={title} className="app-card border-l-4 border-l-red p-5">
            <h2 className="flex items-center gap-2 font-display text-[20px] font-bold text-red">
              <Icon size={22} />
              {title}
            </h2>
            <ul className="mt-4 space-y-3 text-[15px] leading-7 text-[var(--text-sec)]">
              {items.map((item) => <li key={item}>- {item}</li>)}
            </ul>
          </section>
        ))}
        <section className="rounded-[13px] border-2 border-red bg-red-light p-5">
          <h2 className="flex items-center gap-2 font-display text-[20px] font-bold text-red-dark">
            <MapPin size={22} />
            Lokasi & Jam Operasional
          </h2>
          <div className="mt-4 space-y-3 text-[15px] leading-7 text-[var(--text-sec)]">
            <p>Perpustakaan SDN Pulau Panggang 02 Pagi.</p>
            <p className="flex items-center gap-2 font-bold"><Clock size={18} /> Senin - Jumat, mengikuti jam sekolah.</p>
            <p className="flex items-center gap-2"><MessageCircle size={18} /> Konfirmasi peminjaman diproses oleh petugas perpustakaan.</p>
          </div>
        </section>
        <section className="rounded-[13px] border-2 border-gold bg-gold-light p-5">
          <h2 className="flex items-center gap-2 font-display text-[20px] font-bold text-gold-dark">
            <AlertTriangle size={22} />
            Perhatian
          </h2>
          <ul className="mt-4 space-y-3 text-[15px] leading-7 text-[var(--text-sec)]">
            <li>- Keterlambatan pengembalian akan dicatat oleh sistem.</li>
            <li>- Buku rusak atau hilang wajib dilaporkan kepada petugas.</li>
            <li>- Data WhatsApp orang tua digunakan untuk konfirmasi peminjaman.</li>
          </ul>
        </section>
      </div>
    </main>
  )
}
