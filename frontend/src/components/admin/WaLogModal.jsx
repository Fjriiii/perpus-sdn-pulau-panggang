import Modal from '../ui/Modal'

export default function WaLogModal({ open, onClose, log }) {
  const payload = log?.payload || {}
  const response = log?.response || {}

  return (
    <Modal
      open={open}
      title="WhatsApp Gateway Log"
      onClose={onClose}
      size="max-w-3xl"
      footer={<button type="button" onClick={onClose} className="rounded-[8px] bg-red px-5 py-2 font-bold text-white hover:bg-red-dark">OK</button>}
    >
      <div className="rounded-[8px] border-[1.5px] border-[var(--success-border)] bg-[var(--success-bg)] p-4 font-mono text-[13px]">
        <div className="mb-2 font-bold text-[var(--success)]">WhatsApp Gateway Log - Fonnte API</div>
        <pre className="max-h-[56vh] overflow-auto whitespace-pre-wrap break-words text-[13px] leading-6 text-[var(--text)]">
{`[POST] ${log?.endpoint || 'https://api.fonnte.com/send'}
Authorization: Bearer YOUR_FONNTE_TOKEN

Payload:
${JSON.stringify(payload, null, 2)}

Response (200 OK):
${JSON.stringify(response, null, 2)}`}
        </pre>
        <p className="mt-2 text-[12px] italic text-[var(--text-sec)]">
          Catatan: pada project lokal saat ini log ini masih simulasi backend, bukan pengiriman WhatsApp sungguhan.
        </p>
      </div>
    </Modal>
  )
}
