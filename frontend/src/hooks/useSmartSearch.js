import { useMemo, useState } from 'react'

export function useSmartSearch() {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('')

  const tokens = useMemo(
    () => query.trim().split(/\s+/).filter((keyword) => keyword.length > 1),
    [query],
  )

  return { query, setQuery, category, setCategory, tokens }
}
