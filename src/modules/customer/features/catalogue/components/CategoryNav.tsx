import { useEffect, useState } from 'react'
import { cn } from '@shared/lib/utils'

interface CategoryNavProps {
  categories: string[]
}

export function CategoryNav({ categories }: CategoryNavProps) {
  const [active, setActive] = useState(categories[0] ?? '')

  useEffect(() => {
    if (categories.length === 0) return

    const observers: IntersectionObserver[] = []

    categories.forEach(category => {
      const element = document.getElementById(`cat-${CSS.escape(category)}`)
      if (!element) return

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActive(category)
        },
        { rootMargin: '-20% 0px -65% 0px', threshold: 0 }
      )

      observer.observe(element)
      observers.push(observer)
    })

    return () => observers.forEach(observer => observer.disconnect())
  }, [categories])

  const scrollToCategory = (category: string) => {
    const element = document.getElementById(`cat-${CSS.escape(category)}`)
    if (!element) return
    const headerOffset = 120
    const top = element.getBoundingClientRect().top + window.scrollY - headerOffset
    window.scrollTo({ top, behavior: 'smooth' })
  }

  return (
    <div className="sticky top-0 z-10 -mx-5 border-y border-ink/10 bg-white px-5 py-3 shadow-sm scrollbar-none md:-mx-6 md:px-6">
      <div className="flex w-max gap-6 overflow-x-auto scrollbar-none">
        {categories.map(category => (
          <button
            key={category}
            onClick={() => scrollToCategory(category)}
            className={cn(
              'shrink-0 whitespace-nowrap border-b-2 pb-0.5 text-xs font-semibold uppercase tracking-[0.06em] transition-colors',
              active === category ? 'border-brand-600 text-brand-700' : 'border-transparent text-ink/45 hover:text-ink/70'
            )}
          >
            {category}
          </button>
        ))}
      </div>
    </div>
  )
}
