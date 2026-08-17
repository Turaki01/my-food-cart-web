import { useState } from 'react'
import { ArrowRight, Search } from 'lucide-react'
import { useLocationStore } from '@shared/stores/location.store'
import { cn } from '@shared/lib/utils'
import { StoreCard } from './components/StoreCard'
import { MOCK_STORES } from './mock'

const ALL_TAGS = [...new Set(MOCK_STORES.flatMap(s => s.categoryTags))]

export function HomePage() {
  const deliveryArea = useLocationStore(s => s.deliveryArea)
  const [query, setQuery] = useState('')
  const [activeTag, setActiveTag] = useState<string | null>(null)

  const filtered = MOCK_STORES.filter(s => {
    const matchesQuery = query.trim()
      ? s.name.toLowerCase().includes(query.toLowerCase()) ||
        s.categoryTags.some(t => t.toLowerCase().includes(query.toLowerCase()))
      : true
    const matchesTag = activeTag ? s.categoryTags.includes(activeTag) : true
    return matchesQuery && matchesTag
  })

  const openCount = filtered.filter(s => s.isOpen).length

  return (
    <div className="space-y-8">
      <HeroBanner />

      {/* Category browse */}
      <section>
        <h2 className="text-sm font-semibold text-gray-900 mb-3">Shop by category</h2>
        <div className="flex gap-2 overflow-x-auto scrollbar-none pb-1">
          <TagPill label="All" active={activeTag === null} onClick={() => setActiveTag(null)} />
          {ALL_TAGS.map(tag => (
            <TagPill key={tag} label={tag} active={activeTag === tag} onClick={() => setActiveTag(tag === activeTag ? null : tag)} />
          ))}
        </div>
      </section>

      {/* Stores section */}
      <section id="stores-near-you" className="scroll-mt-20">
        <div className="flex items-end justify-between mb-4">
          <div>
            <h2 className="text-base font-semibold text-gray-900">Stores near you</h2>
            <p className="text-xs text-gray-500 mt-0.5">
              {openCount} partner {openCount === 1 ? 'store' : 'stores'} delivering
              {deliveryArea ? ` to ${deliveryArea}` : ''}
            </p>
          </div>
        </div>

        {/* Filter */}
        <div className="relative mb-5">
          <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          <input
            type="search"
            placeholder="Filter by store name or cuisine..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-2xl border border-gray-200 bg-white text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-600/20 focus:border-brand-300 transition-all"
          />
        </div>

        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map(store => (
              <StoreCard key={store.id} store={store} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-gray-400">
            <Search size={28} className="mb-2 opacity-30" />
            <p className="text-sm">No stores match your filters</p>
            <button onClick={() => { setQuery(''); setActiveTag(null) }} className="mt-1.5 text-xs text-brand-600 hover:underline">
              Clear filters
            </button>
          </div>
        )}
      </section>

      <HowItWorks />
    </div>
  )
}

function TagPill({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'shrink-0 px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all duration-150',
        active
          ? 'bg-spice-500 text-white shadow-sm'
          : 'bg-white border border-gray-200 text-gray-600 hover:border-spice-300 hover:text-gray-800'
      )}
    >
      {label}
    </button>
  )
}

function HeroBanner() {
  return (
    <section className="relative bg-brand-700 rounded-3xl overflow-hidden">
      <div
        className="absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage: `repeating-linear-gradient(
            -45deg, #fff 0px, #fff 1px, transparent 1px, transparent 12px
          )`,
        }}
      />
      <div className="absolute -bottom-20 -right-16 h-64 w-64 rounded-full bg-spice-500/20 blur-3xl pointer-events-none" />
      <div className="relative flex items-center justify-between px-10 py-9">
        <div className="max-w-sm">
          <span className="inline-block text-[10px] font-semibold tracking-[0.12em] uppercase bg-spice-500/25 text-spice-100 rounded-full px-3 py-1 mb-4">
            Now live near you
          </span>
          <h1 className="font-display text-3xl font-semibold text-white leading-snug mb-2">
            Every store,<br />one app.
          </h1>
          <p className="text-brand-200 text-sm leading-relaxed mb-6">
            Authentic African &amp; Caribbean groceries from the stores you trust,
            delivered same-day. Free delivery on your first&nbsp;3&nbsp;orders.
          </p>
          <a
            href="#stores-near-you"
            className="inline-flex items-center gap-1.5 bg-white text-brand-700 font-semibold px-5 py-2.5 rounded-xl hover:bg-brand-50 transition-colors text-sm"
          >
            Start shopping <ArrowRight size={14} />
          </a>
        </div>

        <div className="hidden lg:flex w-64 h-44 rounded-2xl bg-brand-600/40 border border-white/10 items-center justify-center shrink-0">
          <span className="text-brand-300 text-xs font-mono">[ market hero photo ]</span>
        </div>
      </div>
    </section>
  )
}

const HOW_IT_WORKS = [
  { step: '01', title: 'Enter your postcode', body: 'We show you every partner store that delivers to your door.' },
  { step: '02', title: 'Build your basket',   body: 'Yams, plantain, palm oil and more — pick a store and load up.' },
  { step: '03', title: 'We deliver',          body: 'Same-day delivery straight to your door. No faff.' },
]

function HowItWorks() {
  return (
    <section className="border-t border-gray-100 pt-8">
      <h2 className="text-base font-semibold text-gray-900 mb-4">How it works</h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {HOW_IT_WORKS.map(({ step, title, body }) => (
          <div key={step} className="bg-white rounded-2xl p-5 border border-gray-100">
            <span className="text-[10px] font-bold tracking-widest text-spice-500 uppercase">{step}</span>
            <h3 className="text-sm font-semibold text-gray-900 mt-2 mb-1">{title}</h3>
            <p className="text-xs text-gray-500 leading-relaxed">{body}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
