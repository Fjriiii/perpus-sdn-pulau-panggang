import { Navigate, Route, Routes } from 'react-router-dom'
import Sidebar from './components/admin/Sidebar'
import Navbar from './components/layout/Navbar'
import { useAuth } from './hooks/useAuth'
import DashboardPage from './pages/admin/DashboardPage'
import BooksPage from './pages/admin/BooksPage'
import LoansPage from './pages/admin/LoansPage'
import LoginPage from './pages/admin/LoginPage'
import MembersPage from './pages/admin/MembersPage'
import RequestsPage from './pages/admin/RequestsPage'
import ReturnsPage from './pages/admin/ReturnsPage'
import CheckLoanPage from './pages/public/CheckLoanPage'
import CollectionPage from './pages/public/CollectionPage'
import HomePage from './pages/public/HomePage'
import RulesPage from './pages/public/RulesPage'

function PublicLayout({ children }) {
  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)]">
      <Navbar />
      {children}
    </div>
  )
}

function AdminLayout({ children }) {
  const { isAuthenticated } = useAuth()
  if (!isAuthenticated) return <Navigate to="/admin/login" replace />

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)] lg:flex">
      <Sidebar />
      <main className="min-w-0 flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
    </div>
  )
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<PublicLayout><HomePage /></PublicLayout>} />
      <Route path="/koleksi" element={<PublicLayout><CollectionPage /></PublicLayout>} />
      <Route path="/tata-tertib" element={<PublicLayout><RulesPage /></PublicLayout>} />
      <Route path="/cek-pinjaman" element={<PublicLayout><CheckLoanPage /></PublicLayout>} />
      <Route path="/admin/login" element={<LoginPage />} />
      <Route path="/admin" element={<AdminLayout><DashboardPage /></AdminLayout>} />
      <Route path="/admin/requests" element={<AdminLayout><RequestsPage /></AdminLayout>} />
      <Route path="/admin/books" element={<AdminLayout><BooksPage /></AdminLayout>} />
      <Route path="/admin/members" element={<AdminLayout><MembersPage /></AdminLayout>} />
      <Route path="/admin/loans" element={<AdminLayout><LoansPage /></AdminLayout>} />
      <Route path="/admin/returns" element={<AdminLayout><ReturnsPage /></AdminLayout>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
