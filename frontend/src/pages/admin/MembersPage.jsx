import { Pencil, Plus, Search, Trash2, Users } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import Badge from '../../components/ui/Badge'
import Modal from '../../components/ui/Modal'
import SectionTitle from '../../components/ui/SectionTitle'
import api from '../../services/api'
import { CLASSES } from '../../utils/categories'

const emptyMember = { name: '', nisn: '', kelas: '1A', parent_wa: '' }

export default function MembersPage() {
  const [members, setMembers] = useState([])
  const [query, setQuery] = useState('')
  const [kelas, setKelas] = useState('')
  const [page, setPage] = useState(1)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(emptyMember)

  const load = () => api.get('/admin/members').then(({ data }) => setMembers(data.data || []))
  useEffect(() => { load() }, [])

  const filtered = useMemo(() => members.filter((member) => {
    const matchQuery = `${member.name} ${member.nisn}`.toLowerCase().includes(query.toLowerCase())
    return matchQuery && (!kelas || member.kelas === kelas)
  }), [members, query, kelas])
  const rows = filtered.slice((page - 1) * 10, page * 10)
  const pageCount = Math.max(1, Math.ceil(filtered.length / 10))

  const openForm = (member = null) => {
    setEditing(member)
    setForm(member ? { ...member } : { ...emptyMember })
  }

  const submit = async (event) => {
    event.preventDefault()
    if (editing) await api.put(`/admin/members/${editing.id}`, form)
    else await api.post('/admin/members', form)
    setEditing(null)
    setForm(emptyMember)
    load()
  }

  const remove = async (member) => {
    if (confirm(`Hapus anggota "${member.name}"?`)) {
      await api.delete(`/admin/members/${member.id}`)
      load()
    }
  }

  return (
    <section>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <SectionTitle count={`${filtered.length} anggota`}>Manajemen Anggota</SectionTitle>
        <button onClick={() => openForm()} className="inline-flex items-center gap-2 rounded-[8px] bg-red px-4 py-2 font-extrabold text-white hover:bg-red-dark"><Plus size={18} /> Tambah Anggota</button>
      </div>
      <div className="mt-5 grid gap-3 md:grid-cols-[1fr_180px]">
        <label className="relative">
          <Search size={17} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Cari nama atau NISN" className="input-control w-full pl-10" />
        </label>
        <select value={kelas} onChange={(e) => setKelas(e.target.value)} className="input-control">
          <option value="">Semua kelas</option>
          {CLASSES.map((item) => <option key={item}>{item}</option>)}
        </select>
      </div>
      <div className="table-shell mt-5">
        {rows.length === 0 ? (
          <div className="empty-state"><Users size={40} />Tidak ada data anggota.</div>
        ) : (
          <table className="data-table min-w-[820px]">
            <thead>
              <tr>{['#', 'Nama', 'NISN', 'Kelas', 'No. WA', 'Pinjaman Aktif', 'Aksi'].map((head) => <th key={head}>{head}</th>)}</tr>
            </thead>
            <tbody>
              {rows.map((member, index) => (
                <tr key={member.id}>
                  <td>{(page - 1) * 10 + index + 1}</td>
                  <td className="font-bold">{member.name}</td>
                  <td>{member.nisn}</td>
                  <td><Badge variant="warning">{member.kelas}</Badge></td>
                  <td>{member.parent_wa}</td>
                  <td><Badge variant={(member.active_loans_count || 0) > 0 ? 'info' : 'success'}>{member.active_loans_count || 0}</Badge></td>
                  <td>
                    <div className="flex gap-2">
                      <button onClick={() => openForm(member)} className="grid h-9 w-9 place-items-center rounded-[8px] border-2 border-[var(--border)] text-gold-dark hover:bg-gold-light" aria-label="Edit"><Pencil size={18} strokeWidth={2} /></button>
                      <button onClick={() => remove(member)} className="grid h-9 w-9 place-items-center rounded-[8px] border-2 border-red/30 text-red hover:bg-red-light" aria-label="Hapus"><Trash2 size={18} strokeWidth={2} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      <div className="mt-4 flex justify-end gap-2">
        <button disabled={page === 1} onClick={() => setPage(page - 1)} className="rounded-[8px] border-2 border-[var(--border)] px-3 py-2 font-bold disabled:opacity-40">Prev</button>
        <span className="px-3 py-2 text-[14px] font-bold">{page}/{pageCount}</span>
        <button disabled={page === pageCount} onClick={() => setPage(page + 1)} className="rounded-[8px] border-2 border-[var(--border)] px-3 py-2 font-bold disabled:opacity-40">Next</button>
      </div>
      <Modal open={Boolean(editing) || form !== emptyMember} title={editing ? 'Edit Anggota' : 'Tambah Anggota'} onClose={() => { setEditing(null); setForm(emptyMember) }} footer={<button form="member-form" className="rounded-[8px] bg-red px-4 py-2 font-bold text-white hover:bg-red-dark">Simpan</button>}>
        <form id="member-form" onSubmit={submit} className="grid gap-3">
          <label className="grid gap-1 text-[15px] font-bold text-[var(--text-sec)]">Nama
            <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input-control" />
          </label>
          <label className="grid gap-1 text-[15px] font-bold text-[var(--text-sec)]">NISN
            <input required value={form.nisn} onChange={(e) => setForm({ ...form, nisn: e.target.value })} className="input-control" />
          </label>
          <label className="grid gap-1 text-[15px] font-bold text-[var(--text-sec)]">Kelas
            <select value={form.kelas} onChange={(e) => setForm({ ...form, kelas: e.target.value })} className="input-control">{CLASSES.map((item) => <option key={item}>{item}</option>)}</select>
          </label>
          <label className="grid gap-1 text-[15px] font-bold text-[var(--text-sec)]">No. WA
            <input value={form.parent_wa || ''} onChange={(e) => setForm({ ...form, parent_wa: e.target.value })} className="input-control" />
          </label>
        </form>
      </Modal>
    </section>
  )
}
