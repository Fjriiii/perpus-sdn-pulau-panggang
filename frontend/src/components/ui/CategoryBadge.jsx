import { getCategoryStyle } from '../../utils/categoryIconMap'
import CategoryIcon from './CategoryIcon'

export default function CategoryBadge({ category, size = 'sm', className = '' }) {
  const sizeClass = size === 'md' ? 'px-3 py-1.5 text-[13px]' : 'px-2.5 py-1 text-[12px]'

  return (
    <span
      style={getCategoryStyle(category)}
      className={`inline-flex items-center gap-1.5 rounded-full border-[1.5px] font-bold leading-none ${sizeClass} ${className}`}
    >
      <CategoryIcon category={category} size={16} showContainer={false} />
      <span>{category || 'Kategori'}</span>
    </span>
  )
}
