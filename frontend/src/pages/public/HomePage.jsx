import { BookOpen, CheckCircle2, Clock, Lightbulb, Search } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import BookCard from '../../components/ui/BookCard'
import ReserveModal from '../../components/ui/ReserveModal'
import ReserveSuccessModal from '../../components/ui/ReserveSuccessModal'
import SectionTitle from '../../components/ui/SectionTitle'
import { useSmartSearch } from '../../hooks/useSmartSearch'
import api from '../../services/api'

export default function HomePage() {
  const [books, setBooks] = useState([])
  const [allBooks, setAllBooks] = useState([])
  const [selectedBook, setSelectedBook] = useState(null)
  const [successOpen, setSuccessOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [searchMeta, setSearchMeta] = useState({
    tokens: [],
    total: 0,
    search_time_ms: 0,
    engine_name: 'Tokenization-Based Search Engine',
  })
  const { query, setQuery, category, setCategory, tokens } = useSmartSearch()

  const categories = useMemo(() => [...new Set(allBooks.map((book) => book.category).filter(Boolean))].sort(), [allBooks])
  const totalCopies = useMemo(() => allBooks.reduce((sum, book) => sum + (book.total_qty || 0), 0), [allBooks])

  const loadBooks = async (params = {}) => {
    setLoading(true)
    try {
      const { data } = await api.get('/books', { params })
      const items = data.data || []
      setBooks(items)
      setSearchMeta({
        tokens: data.tokens || [],
        total: data.total || items.length,
        search_time_ms: data.search_time_ms || 0,
        engine_name: data.engine_name || 'Tokenization-Based Search Engine',
      })
      return items
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadBooks({ skip_log: 1 }).then((items) => setAllBooks(items))
  }, [])

  const submitSearch = (event) => {
    event.preventDefault()
    loadBooks({ q: query, category: category || undefined })
  }

  return (
    <main>
      <section className="bg-red text-white">
        <div className="mx-auto max-w-7xl px-4 pb-11 pt-9 sm:px-6 lg:px-8">
          <div className="max-w-4xl">
            <div className="inline-flex items-center rounded-full border border-white/35 bg-white/10 px-3 py-1 text-[13px] font-bold">
              {allBooks.length || 90} Judul - {totalCopies || 255} Eksemplar - {categories.length || 10} Kategori
            </div>
            <h1 className="mt-4 max-w-3xl font-display text-[30px] font-extrabold leading-tight text-white sm:text-[36px]">
              Perpustakaan SDN Pulau Panggang
              <span className="block text-[#FFD700]">Temukan buku lebih cepat</span>
            </h1>
            <p className="mt-3 max-w-2xl text-[15px] leading-7 text-white/85">
              Cari koleksi perpustakaan dengan Smart Search berbasis token kata kunci untuk judul, pengarang, penerbit, dan kategori.
            </p>
          </div>

          <form onSubmit={submitSearch} className="mt-6 rounded-[12px] border-[2.5px] border-white/50 bg-white p-3 text-[var(--text)]">
            <div className="grid gap-3 lg:grid-cols-[1fr_1px_260px_120px] lg:items-center">
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Contoh: reptil sains"
                className="min-h-12 rounded-[8px] border-0 px-2 text-[15px] outline-none focus:shadow-none"
              />
              <span className="hidden h-8 bg-[var(--border)] lg:block" aria-hidden="true" />
              <select value={category} onChange={(event) => setCategory(event.target.value)} className="min-h-12 rounded-[8px] border-2 border-[var(--border)] px-3">
                <option value="">Semua kategori</option>
                {categories.map((item) => <option key={item}>{item}</option>)}
              </select>
              <button type="submit" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-[8px] bg-gold px-4 font-extrabold text-white hover:bg-gold-dark">
                <Search size={16} />
                CARI
              </button>
            </div>
          </form>

          <div className="mt-3 flex flex-wrap items-center gap-2 text-white/75">
            <Lightbulb size={14} />
            <span className="text-[13px] font-bold">Smart Search memecah query menjadi token dan mengurutkan hasil berdasarkan skor relevansi.</span>
          </div>
          {tokens.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {tokens.map((token) => <span key={token} className="rounded-full border border-white/25 bg-white/15 px-3 py-1 text-[12px] font-extrabold text-white">{token}</span>)}
            </div>
          )}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="grid gap-[13px] md:grid-cols-3">
          <div className="app-card flex items-center gap-4 p-4">
            <span className="grid h-11 w-11 place-items-center rounded-[10px] border-2 border-red bg-red-light text-red"><BookOpen size={22} /></span>
            <div><p className="font-bold text-[var(--text-muted)]">Total Koleksi</p><p className="font-display text-[21px] font-extrabold text-[var(--text)]">{allBooks.length || books.length} Judul</p></div>
          </div>
          <div className="app-card flex items-center gap-4 p-4">
            <span className="grid h-11 w-11 place-items-center rounded-[10px] border-2 border-[var(--success-border)] bg-[var(--success-bg)] text-[var(--success)]"><CheckCircle2 size={22} /></span>
            <div><p className="font-bold text-[var(--text-muted)]">Total Eksemplar</p><p className="font-display text-[21px] font-extrabold text-[var(--text)]">{totalCopies || '-'} Buku</p></div>
          </div>
          <div className="app-card flex items-center gap-4 p-4">
            <span className="grid h-11 w-11 place-items-center rounded-[10px] border-2 border-gold bg-gold-light text-gold-dark"><Clock size={22} /></span>
            <div><p className="font-bold text-[var(--text-muted)]">Durasi Pinjam</p><p className="font-display text-[21px] font-extrabold text-[var(--text)]">7 Hari</p></div>
          </div>
        </div>

        <div className="mt-7 flex flex-wrap items-center justify-between gap-3">
          <SectionTitle count={`${searchMeta.total || books.length} buku`}>Hasil Pencarian</SectionTitle>
          <p className="text-[13px] font-bold text-[var(--text-muted)]">{searchMeta.search_time_ms} ms</p>
        </div>

        {loading ? (
          <div className="empty-state app-card mt-5">Memuat koleksi...</div>
        ) : books.length === 0 ? (
          <div className="empty-state app-card mt-5"><BookOpen size={40} />Tidak ada buku yang cocok.</div>
        ) : (
          <div className="mt-5 grid grid-cols-[repeat(auto-fill,minmax(175px,1fr))] gap-[13px]">
            {books.map((book) => <BookCard key={book.id} book={book} onReserve={setSelectedBook} />)}
          </div>
        )}
      </section>

      <ReserveModal book={selectedBook} open={Boolean(selectedBook)} onClose={() => setSelectedBook(null)} onSuccess={() => setSuccessOpen(true)} />
      <ReserveSuccessModal open={successOpen} onClose={() => setSuccessOpen(false)} />
    </main>
  )
}
