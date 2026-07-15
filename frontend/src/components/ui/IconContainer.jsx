const sizes = {
  sm: 'h-9 w-9 rounded-lg p-2',
  md: 'h-12 w-12 rounded-xl p-2.5',
  lg: 'h-14 w-14 rounded-xl p-3',
}

export default function IconContainer({ children, size = 'md', className = '', style }) {
  return (
    <span
      aria-hidden="true"
      style={style}
      className={`inline-grid shrink-0 place-items-center border-2 ${sizes[size] || sizes.md} ${className}`}
    >
      {children}
    </span>
  )
}
