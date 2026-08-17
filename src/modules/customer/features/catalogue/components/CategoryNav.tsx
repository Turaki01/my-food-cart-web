import { useEffect, useRef, useState } from 'react'
import { cn } from '@shared/lib/utils'

interface CategoryNavProps {
  categories: string[]
}

export function CategoryNav({ categories }: CategoryNavProps) {
  const [active, setActive] = useState(categories[0] ?? '')
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (categories.length === 0) return

    const observers: IntersectionObserver[] = []

    categories.forEach(cat => {
      const el = document.getElementById(`cat-${CSS.escape(cat)}`)
      if (!el) return
      const observer = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActive(cat) },
        { rootMargin: '-20% 0px -65% 0px', threshold: 0 }
      )
      observer.observe(el)
      observers.push(observer)
    })

    return () => observers.forEach(o => o.disconnect())
  }, [categories])

  const scrollToCategory = (cat: string) => {
    const el = document.getElementById(`cat-${CSS.escape(cat)}`)
    if (!el) return
    const headerOffset = 120 // header + nav height
    const top = el.getBoundingClientRect().top + window.scrollY - headerOffset
    window.scrollTo({ top, behavior: 'smooth' })
  }

  return (
    <div
      ref={scrollRef}
      className="overflow-x-auto scrollbar-none py-3 border-b border-gray-100 bg-surface -mx-6 px-6"
    >
      <div className="flex gap-2 w-max">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => scrollToCategory(cat)}
            className={cn(
              'px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all duration-150',
              active === cat
                ? 'bg-spice-500 text-white shadow-sm'
                : 'bg-white border border-gray-200 text-gray-600 hover:border-spice-300 hover:text-gray-800'
            )}
          >
            {cat}
          </button>
        ))}
      </div>
    </div>
  )
}
