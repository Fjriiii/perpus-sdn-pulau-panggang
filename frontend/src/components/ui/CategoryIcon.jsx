import { getCategoryConfig } from '../../utils/categoryIconMap'
import IconContainer from './IconContainer'

export default function CategoryIcon({ category, size = 32, containerSize = 'lg', className = '', showContainer = true }) {
  const config = getCategoryConfig(category)
  const Icon = config.icon

  if (!showContainer) {
    return <Icon aria-hidden="true" className={className} size={size} strokeWidth={2} />
  }

  return (
    <IconContainer
      size={containerSize}
      style={{ backgroundColor: config.background, borderColor: config.border, color: config.color }}
      className={className}
    >
      <Icon size={size} strokeWidth={2} />
    </IconContainer>
  )
}
