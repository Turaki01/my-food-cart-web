import { useState } from 'react'
import { ArrowRight, Search } from 'lucide-react'
import { useAuthStore } from '@shared/stores/auth.store'
import { StoreCard } from './components/StoreCard'
import { MOCK_STORES } from './mock'

export function HomePage() {
  const { deliveryArea } = useAuthStore()
  const [query, setQuery] = useState('')

  const filtered = query.trim()
    ? MOCK_STORES.filter(s =>
        s.name.toLowerCase().includes(query.toLowerCase()) ||
        s.categoryTags.some(t => t.toLowerCase().includes(query.toLowerCase()))
      )
    : MOCK_STORES

  const openCount = filtered.filter(s => s.isOpen).length

  return (
    <div className="space-y-8">
      <HeroBanner />

      {/* Stores section */}
      <section>
        <div className="flex items-end justify-between mb-4">
          <div>
            <h2 className="text-base font-semibold text-gray-900">Stores near you</h2>
            <p className="text-xs text-gray-500 mt-0.5">
              {openCount} partner {openCount === 1 ? 'store' : 'stores'} delivering
              {deliveryArea ? ` to ${deliveryArea}` : ' in South London'}
            </p>
          </div>
          <button className="flex items-center gap-1 text-xs font-medium text-brand-600 hover:text-brand-700">
            View all <ArrowRight size={13} />
          </button>
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
            <p className="text-sm">No stores match &ldquo;{query}&rdquo;</p>
            <button onClick={() => setQuery('')} className="mt-1.5 text-xs text-brand-600 hover:underline">
              Clear filter
            </button>
          </div>
        )}
      </section>

      <HowItWorks />
    </div>
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
      <div className="relative flex items-center justify-between px-10 py-9">
        <div className="max-w-sm">
          <span className="inline-block text-[10px] font-semibold tracking-[0.12em] uppercase bg-white/15 text-white/80 rounded-full px-3 py-1 mb-4">
            Now live in South London
          </span>
          <h1 className="text-2xl font-bold text-white leading-snug mb-2">
            Your market,<br />at your door.
          </h1>
          <p className="text-brand-200 text-sm leading-relaxed mb-6">
            Authentic African groceries from the stores you trust in Peckham &amp; Brixton.
            Shop one store per order for now, with same-day delivery and a smooth launch experience.
          </p>
          <button className="inline-flex items-center gap-1.5 bg-white text-brand-700 font-semibold px-5 py-2.5 rounded-xl hover:bg-brand-50 transition-colors text-sm">
            Start shopping <ArrowRight size={14} />
          </button>
        </div>

        <div className="hidden lg:flex w-64 h-44 rounded-2xl bg-brand-600/40 border border-white/10 items-center justify-center shrink-0">
          <span className="text-brand-300 text-xs font-mono">[ market hero photo ]</span>
        </div>
      </div>
    </section>
  )
}

const HOW_IT_WORKS = [
  { step: '01', title: 'Choose your store', body: 'Browse partner stores near you in Peckham, Brixton, Lewisham and beyond.' },
  { step: '02', title: 'Build your basket', body: 'Add your yams, plantain, palm oil and more from one store per order.' },
  { step: '03', title: 'We deliver',        body: 'Same-day delivery straight to your door. No faff.' },
]

function HowItWorks() {
  return (
    <section className="border-t border-gray-100 pt-8">
      <h2 className="text-base font-semibold text-gray-900 mb-4">How it works</h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {HOW_IT_WORKS.map(({ step, title, body }) => (
          <div key={step} className="bg-white rounded-2xl p-5 border border-gray-100">
            <span className="text-[10px] font-bold tracking-widest text-brand-400 uppercase">{step}</span>
            <h3 className="text-sm font-semibold text-gray-900 mt-2 mb-1">{title}</h3>
            <p className="text-xs text-gray-500 leading-relaxed">{body}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
