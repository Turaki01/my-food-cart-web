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
    <div className="-mx-5 overflow-x-auto px-5 py-2 scrollbar-none md:-mx-6 md:px-6">
      <div className="flex w-max gap-2">
        {categories.map(category => (
          <button
            key={category}
            onClick={() => scrollToCategory(category)}
            className={cn(
              'rounded-full border px-4 py-2 text-xs font-semibold transition-all',
              active === category
                ? 'border-brand-200 bg-brand-50 text-brand-700'
                : 'border-slate-200 bg-white text-slate-500 hover:border-slate-300 hover:text-slate-900'
            )}
          >
            {category}
          </button>
        ))}
      </div>
    </div>
  )
}
