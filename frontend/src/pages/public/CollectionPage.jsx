import { BookOpen } from 'lucide-react'
import { useEffect, useState } from 'react'
import BookCard from '../../components/ui/BookCard'
import ReserveModal from '../../components/ui/ReserveModal'
import ReserveSuccessModal from '../../components/ui/ReserveSuccessModal'
import SectionTitle from '../../components/ui/SectionTitle'
import api from '../../services/api'

export default function CollectionPage() {
  const [books, setBooks] = useState([])
  const [selectedBook, setSelectedBook] = useState(null)
  const [successOpen, setSuccessOpen] = useState(false)

  useEffect(() => {
    api.get('/books/recent').then(({ data }) => setBooks(data.data || []))
  }, [])

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <SectionTitle count={`${books.length} buku`}>20 Buku Terbaru Ditambahkan</SectionTitle>
      {books.length === 0 ? (
        <div className="empty-state app-card mt-5"><BookOpen size={40} />Belum ada koleksi terbaru.</div>
      ) : (
        <div className="mt-5 grid grid-cols-[repeat(auto-fill,minmax(175px,1fr))] gap-[13px]">
          {books.map((book) => <BookCard key={book.id} book={book} onReserve={setSelectedBook} isNew />)}
        </div>
      )}
      <ReserveModal book={selectedBook} open={Boolean(selectedBook)} onClose={() => setSelectedBook(null)} onSuccess={() => setSuccessOpen(true)} />
      <ReserveSuccessModal open={successOpen} onClose={() => setSuccessOpen(false)} />
    </main>
  )
}
