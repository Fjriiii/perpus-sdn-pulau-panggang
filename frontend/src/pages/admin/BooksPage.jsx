import { BookOpen, Pencil, Plus, Search, Trash2 } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import Badge from '../../components/ui/Badge'
import CategoryBadge from '../../components/ui/CategoryBadge'
import Modal from '../../components/ui/Modal'
import SectionTitle from '../../components/ui/SectionTitle'
import api from '../../services/api'

const emptyBook = { title: '', author: '', publisher: '', year: new Date().getFullYear(), isbn: '', category: 'Karya Umum', dewey_code: '', total_qty: 1, borrowed_qty: 0 }

export default function BooksPage() {
  const [books, setBooks] = useState([])
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('')
  const [page, setPage] = useState(1)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(emptyBook)

  const load = () => api.get('/admin/books').then(({ data }) => setBooks(data.data || []))

  useEffect(() => {
    load()
  }, [])

  const categories = useMemo(() => [...new Set(books.map((book) => book.category))].sort(), [books])
  const filtered = books.filter((book) => {
    const haystack = `${book.title} ${book.author}`.toLowerCase()
    return haystack.includes(query.toLowerCase()) && (!category || book.category === category)
  })
  const rows = filtered.slice((page - 1) * 15, page * 15)
  const pageCount = Math.max(1, Math.ceil(filtered.length / 15))

  const openForm = (book = null) => {
    setEditing(book)
    setForm(book ? { ...book } : { ...emptyBook })
  }

  const submit = async (event) => {
    event.preventDefault()
    if (editing) await api.put(`/admin/books/${editing.id}`, form)
    else await api.post('/admin/books', form)
    setEditing(null)
    setForm(emptyBook)
    load()
  }

  const remove = async (book) => {
    if (confirm(`Hapus buku "${book.title}"?`)) {
      await api.delete(`/admin/books/${book.id}`)
      load()
    }
  }

  return (
    <section>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <SectionTitle count={`${filtered.length} buku`}>Manajemen Buku</SectionTitle>
        <button onClick={() => openForm()} className="inline-flex items-center gap-2 rounded-[8px] bg-red px-4 py-2 font-extrabold text-white hover:bg-red-dark"><Plus size={18} /> Tambah Buku</button>
      </div>
      <div className="mt-5 grid gap-3 md:grid-cols-[1fr_240px]">
        <label className="relative">
          <Search size={17} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Cari judul atau pengarang" className="input-control w-full pl-10" />
        </label>
        <select value={category} onChange={(e) => setCategory(e.target.value)} className="input-control">
          <option value="">Semua kategori</option>
          {categories.map((item) => <option key={item}>{item}</option>)}
        </select>
      </div>
      <div className="table-shell mt-5">
        {rows.length === 0 ? (
          <div className="empty-state"><BookOpen size={40} />Tidak ada data buku.</div>
        ) : (
          <table className="data-table min-w-[940px]">
            <thead>
              <tr>{['#', 'Judul', 'Pengarang', 'Kategori', 'Tahun', 'Stok', 'Aksi'].map((head) => <th key={head}>{head}</th>)}</tr>
            </thead>
            <tbody>
              {rows.map((book, index) => {
                const available = book.available_qty ?? Math.max(0, (book.total_qty || 0) - (book.borrowed_qty || 0))
                return (
                  <tr key={book.id}>
                    <td>{(page - 1) * 15 + index + 1}</td>
                    <td className="font-bold">{book.title}</td>
                    <td>{book.author}</td>
                    <td><CategoryBadge category={book.category} /></td>
                    <td>{book.year}</td>
                    <td><Badge variant={available > 0 ? 'success' : 'danger'}>{available}/{book.total_qty}</Badge></td>
                    <td>
                      <div className="flex gap-2">
                        <button onClick={() => openForm(book)} className="grid h-9 w-9 place-items-center rounded-[8px] border-2 border-[var(--border)] text-gold-dark hover:bg-gold-light" aria-label="Edit"><Pencil size={18} strokeWidth={2} /></button>
                        <button onClick={() => remove(book)} className="grid h-9 w-9 place-items-center rounded-[8px] border-2 border-red/30 text-red hover:bg-red-light" aria-label="Hapus"><Trash2 size={18} strokeWidth={2} /></button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}
      </div>
      <div className="mt-4 flex justify-end gap-2">
        <button disabled={page === 1} onClick={() => setPage(page - 1)} className="rounded-[8px] border-2 border-[var(--border)] px-3 py-2 font-bold disabled:opacity-40">Prev</button>
        <span className="px-3 py-2 text-[14px] font-bold">{page}/{pageCount}</span>
        <button disabled={page === pageCount} onClick={() => setPage(page + 1)} className="rounded-[8px] border-2 border-[var(--border)] px-3 py-2 font-bold disabled:opacity-40">Next</button>
      </div>
      <Modal
        open={Boolean(editing) || form !== emptyBook}
        title={editing ? 'Edit Buku' : 'Tambah Buku'}
        onClose={() => { setEditing(null); setForm(emptyBook) }}
        footer={<button form="book-form" className="rounded-[8px] bg-red px-4 py-2 font-bold text-white hover:bg-red-dark">Simpan</button>}
      >
        <form id="book-form" onSubmit={submit} className="grid gap-3">
          {['title', 'author', 'publisher', 'category', 'isbn', 'dewey_code'].map((field) => (
            <label key={field} className="grid gap-1 text-[15px] font-bold capitalize text-[var(--text-sec)]">{field.replace('_', ' ')}
              <input value={form[field] || ''} onChange={(e) => setForm({ ...form, [field]: e.target.value })} className="input-control" required={['title', 'author', 'publisher', 'category'].includes(field)} />
            </label>
          ))}
          <div className="grid gap-3 sm:grid-cols-3">
            {['year', 'total_qty', 'borrowed_qty'].map((field) => (
              <label key={field} className="grid gap-1 text-[15px] font-bold capitalize text-[var(--text-sec)]">{field.replace('_', ' ')}
                <input type="number" value={form[field] ?? 0} onChange={(e) => setForm({ ...form, [field]: Number(e.target.value) })} className="input-control" />
              </label>
            ))}
          </div>
        </form>
      </Modal>
    </section>
  )
}
