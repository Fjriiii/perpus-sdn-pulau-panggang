export default function SectionTitle({ children, count, className = '' }) {
  return (
    <div className={`flex flex-wrap items-center gap-3 ${className}`}>
      <span className="h-[22px] w-1 rounded-full bg-red" aria-hidden="true" />
      <h2 className="font-display text-[20px] font-extrabold text-[var(--text)]">{children}</h2>
      {count !== undefined && (
        <span className="rounded-full border-[1.5px] border-red/25 bg-red-light px-3 py-1 text-[12px] font-extrabold text-red-dark">
          {count}
        </span>
      )}
    </div>
  )
}
