const variants = {
  default: 'border-[var(--border)] bg-white text-[var(--text-sec)]',
  success: 'border-[var(--success-border)] bg-[var(--success-bg)] text-[var(--success)]',
  danger: 'border-[var(--danger-border)] bg-[var(--danger-bg)] text-[var(--danger)]',
  warning: 'border-[var(--warning-border)] bg-[var(--warning-bg)] text-[var(--gold-dark)]',
  info: 'border-[var(--info-border)] bg-[var(--info-bg)] text-[var(--info)]',
}

const toneMap = {
  slate: 'default',
  green: 'success',
  red: 'danger',
  yellow: 'warning',
  blue: 'info',
}

export default function Badge({ children, variant = 'default', tone, size = 'sm', className = '', style }) {
  const resolvedVariant = tone ? toneMap[tone] || tone : variant
  const sizeClass = size === 'md' ? 'px-3 py-1.5 text-[13px]' : 'px-2.5 py-1 text-[12px]'

  return (
    <span style={style} className={`inline-flex items-center gap-1 rounded-full border-[1.5px] font-bold leading-none ${sizeClass} ${variants[resolvedVariant] || variants.default} ${className}`}>
      {children}
    </span>
  )
}
