import IconContainer from './IconContainer'

const iconStyles = {
  red: { borderColor: 'var(--red)', backgroundColor: 'var(--red-light)', color: 'var(--red)' },
  gold: { borderColor: 'var(--gold)', backgroundColor: 'var(--gold-light)', color: 'var(--gold-dark)' },
  green: { borderColor: 'var(--success-border)', backgroundColor: 'var(--success-bg)', color: 'var(--success)' },
  blue: { borderColor: 'var(--info-border)', backgroundColor: 'var(--info-bg)', color: 'var(--info)' },
}

export default function StatCard({ label, value, icon: Icon, iconBg = 'red', iconSize = 26, danger = false, suffix = '' }) {
  const resolvedIcon = danger ? 'red' : iconBg

  return (
    <div className="app-card p-4">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-[12px] font-bold uppercase text-[var(--text-muted)]">{label}</p>
          <p className={`mt-2 font-display text-[21px] font-extrabold leading-tight ${danger ? 'text-[var(--danger)]' : 'text-[var(--text)]'}`}>
            {value ?? 0}{suffix}
          </p>
        </div>
        {Icon && (
          <IconContainer size="md" style={iconStyles[resolvedIcon] || iconStyles.red}>
            <Icon size={iconSize} strokeWidth={2} />
          </IconContainer>
        )}
      </div>
    </div>
  )
}
