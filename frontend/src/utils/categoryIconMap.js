import {
  Atom,
  BookOpen,
  Brain,
  Cpu,
  Feather,
  Landmark,
  Languages,
  LibraryBig,
  Palette,
  ScrollText,
  Users,
} from 'lucide-react'

const unknownCategory = {
  icon: BookOpen,
  label: 'Kategori',
  background: '#FDECEA',
  color: '#96281B',
  border: '#F5B7B1',
}

export const categoryIconMap = {
  Agama: {
    icon: Landmark,
    label: 'Agama',
    background: '#FEF3C7',
    color: '#92400E',
    border: '#FCD34D',
  },
  Bahasa: {
    icon: Languages,
    label: 'Bahasa',
    background: '#ECFEFF',
    color: '#155E75',
    border: '#A5F3FC',
  },
  'Sains & Matematika': {
    icon: Atom,
    label: 'Sains & Matematika',
    background: '#EFF6FF',
    color: '#1D4ED8',
    border: '#BFDBFE',
  },
  Sains: {
    icon: Atom,
    label: 'Sains',
    background: '#EFF6FF',
    color: '#1D4ED8',
    border: '#BFDBFE',
  },
  'Teknologi dan Ilmu Terapan': {
    icon: Cpu,
    label: 'Teknologi',
    background: '#F3E8FF',
    color: '#6B21A8',
    border: '#D8B4FE',
  },
  'Teknologi (Ilmu Terapan)': {
    icon: Cpu,
    label: 'Teknologi',
    background: '#F3E8FF',
    color: '#6B21A8',
    border: '#D8B4FE',
  },
  'Ilmu Sosial': {
    icon: Users,
    label: 'Ilmu Sosial',
    background: '#FFF7ED',
    color: '#9A3412',
    border: '#FDBA74',
  },
  Sastra: {
    icon: Feather,
    label: 'Sastra',
    background: '#FDF2F8',
    color: '#9D174D',
    border: '#FBCFE8',
  },
  'Sejarah dan Geografi': {
    icon: ScrollText,
    label: 'Sejarah & Geografi',
    background: '#FEF3C7',
    color: '#78350F',
    border: '#FDE68A',
  },
  'Sejarah & Geografi': {
    icon: ScrollText,
    label: 'Sejarah & Geografi',
    background: '#FEF3C7',
    color: '#78350F',
    border: '#FDE68A',
  },
  'Filsafat & Psikologi': {
    icon: Brain,
    label: 'Filsafat & Psikologi',
    background: '#EDE9FE',
    color: '#5B21B6',
    border: '#C4B5FD',
  },
  Psikologi: {
    icon: Brain,
    label: 'Psikologi',
    background: '#EDE9FE',
    color: '#5B21B6',
    border: '#C4B5FD',
  },
  'Karya Umum': {
    icon: LibraryBig,
    label: 'Karya Umum',
    background: '#EFF6FF',
    color: '#1E40AF',
    border: '#BFDBFE',
  },
  'Karya Umum / Komputer': {
    icon: LibraryBig,
    label: 'Karya Umum / Komputer',
    background: '#EFF6FF',
    color: '#1E40AF',
    border: '#BFDBFE',
  },
  'Karya Umum/Komputer': {
    icon: LibraryBig,
    label: 'Karya Umum / Komputer',
    background: '#EFF6FF',
    color: '#1E40AF',
    border: '#BFDBFE',
  },
  'Kesenian & Rekreasi': {
    icon: Palette,
    label: 'Seni & Rekreasi',
    background: '#ECFDF5',
    color: '#047857',
    border: '#A7F3D0',
  },
  'Seni & Rekreasi': {
    icon: Palette,
    label: 'Seni & Rekreasi',
    background: '#ECFDF5',
    color: '#047857',
    border: '#A7F3D0',
  },
}

export function getCategoryConfig(category) {
  if (!category) return unknownCategory
  return categoryIconMap[category] || unknownCategory
}

export function getCategoryIcon(category) {
  return getCategoryConfig(category).icon
}

export function getCategoryStyle(category) {
  const config = getCategoryConfig(category)
  return {
    backgroundColor: config.background,
    borderColor: config.border,
    color: config.color,
  }
}

export function getCategoryLabel(category) {
  return category || getCategoryConfig(category).label
}
