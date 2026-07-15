import { Check } from 'lucide-react'
import Modal from './Modal'

export default function ReserveSuccessModal({ open, onClose }) {
  return (
    <Modal
      open={open}
      title="Permintaan Terkirim"
      onClose={onClose}
      footer={<button type="button" onClick={onClose} className="w-full rounded-[8px] bg-red px-5 py-2 font-bold text-white hover:bg-red-dark">OK</button>}
    >
      <div className="py-4 text-center">
        <div className="mx-auto grid h-[60px] w-[60px] place-items-center rounded-full bg-[var(--success)] text-white">
          <Check size={34} />
        </div>
        <h3 className="mt-4 font-display text-[22px] font-extrabold text-[var(--text)]">Permintaan Terkirim!</h3>
        <p className="mx-auto mt-2 max-w-sm text-[15px] leading-6 text-[var(--text-sec)]">
          Petugas perpustakaan akan memproses permintaan dan mengkonfirmasi status peminjaman.
        </p>
      </div>
    </Modal>
  )
}
