import { useState } from 'react'
import { ArrowRight, MapPin, Search } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { MOCK_PRODUCTS } from '@modules/customer/features/catalogue/mock'
import { useLocationStore } from '@shared/stores/location.store'
import { cn } from '@shared/lib/utils'
import { StoreCard } from './components/StoreCard'
import { MOCK_STORES } from './mock'

const ALL_TAGS = [...new Set(MOCK_STORES.flatMap(store => store.categoryTags))]
const STORE_SEARCH_TERMS = Object.fromEntries(
  MOCK_STORES.map(store => [
    store.id,
    [
      store.name,
      store.area,
      ...store.categoryTags,
      ...(MOCK_PRODUCTS[store.id] ?? []).flatMap(product => [product.name, product.category, product.hint]),
    ].map(value => value.toLowerCase()),
  ])
)

export function HomePage() {
  const navigate = useNavigate()
  const deliveryArea = useLocationStore(s => s.deliveryArea)
  const [query, setQuery] = useState('')
  const [activeTag, setActiveTag] = useState<string | null>(null)
  const normalizedQuery = query.trim().toLowerCase()

  const filtered = MOCK_STORES.filter(store => {
    const matchesQuery = normalizedQuery
      ? STORE_SEARCH_TERMS[store.id]?.some(term => term.includes(normalizedQuery))
      : true
    const matchesTag = activeTag ? store.categoryTags.includes(activeTag) : true
    return matchesQuery && matchesTag
  })

  const openCount = filtered.filter(store => store.isOpen).length

  const featuredCategories = ALL_TAGS.slice(0, 6).map(tag => ({
    tag,
    count: MOCK_STORES.filter(store => store.categoryTags.includes(tag)).length,
  }))

  return (
    <div className="space-y-14 md:space-y-20">
      <HeroBanner deliveryArea={deliveryArea} openCount={openCount} onCheckArea={() => navigate('/customer/zone-check')} />

      <section className="space-y-7 border-b border-ink/10 pb-14 md:pb-20">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="section-kicker text-[11px] font-semibold text-ink/45">01 — Departments</p>
            <h2 className="mt-2 font-display text-2xl font-medium tracking-[-0.01em] text-ink md:text-3xl">
              Shop by what you need
            </h2>
          </div>
          <button className="underline-hover shrink-0 text-sm font-semibold text-ink/60 hover:text-ink">
            View all
          </button>
        </div>

        <div className="grid grid-cols-2 border-l border-t border-ink/10 sm:grid-cols-3 xl:grid-cols-6">
          {featuredCategories.map(({ tag, count }, index) => (
            <button
              key={tag}
              onClick={() => setActiveTag(tag === activeTag ? null : tag)}
              className={cn(
                'border-b border-r border-ink/10 p-5 text-left transition-colors',
                activeTag === tag ? 'bg-ink' : 'hover:bg-ink/[0.03]'
              )}
            >
              <span className={cn('tabular font-display text-2xl font-medium', activeTag === tag ? 'text-[var(--paper)]' : 'text-ink/25')}>
                {String(index + 1).padStart(2, '0')}
              </span>
              <p className={cn('mt-4 text-sm font-semibold', activeTag === tag ? 'text-[var(--paper)]' : 'text-ink')}>{tag}</p>
              <p className={cn('mt-1 text-xs', activeTag === tag ? 'text-[var(--paper)]/65' : 'text-ink/45')}>
                {count} partner stores
              </p>
            </button>
          ))}
        </div>
      </section>

      <section id="stores-near-you" className="scroll-mt-24">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="section-kicker text-[11px] font-semibold text-ink/45">02 — Popular stores</p>
            <h2 className="mt-2 font-display text-2xl font-medium tracking-[-0.01em] text-ink md:text-3xl">
              Stores near you
            </h2>
            <p className="mt-2 text-sm text-ink/55">
              {openCount} partner {openCount === 1 ? 'store' : 'stores'} delivering
              {deliveryArea ? ` to ${deliveryArea}` : ''}
            </p>
          </div>
          <button className="underline-hover shrink-0 text-sm font-semibold text-ink/60 hover:text-ink">
            View all
          </button>
        </div>

        <div className="mb-8 flex flex-col gap-5 border-y border-ink/10 py-5 md:flex-row md:items-center md:justify-between">
          <div className="relative w-full md:max-w-xs">
            <Search size={14} className="pointer-events-none absolute left-0 top-1/2 -translate-y-1/2 text-ink/35" />
            <input
              type="search"
              placeholder="Search for food, stores, cuisines…"
              value={query}
              onChange={e => setQuery(e.target.value)}
              className="w-full border-b border-ink/15 bg-transparent py-1.5 pl-6 text-sm text-ink placeholder:text-ink/35 focus:border-ink/50 focus:outline-none"
            />
          </div>

          <div className="flex gap-6 overflow-x-auto pb-1 scrollbar-none">
            <TagTab label="All" active={activeTag === null} onClick={() => setActiveTag(null)} />
            {ALL_TAGS.map(tag => (
              <TagTab key={tag} label={tag} active={activeTag === tag} onClick={() => setActiveTag(tag === activeTag ? null : tag)} />
            ))}
          </div>
        </div>

        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {filtered.map(store => (
              <StoreCard key={store.id} store={store} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center border border-ink/10 py-16 text-ink/50">
            <Search size={22} className="mb-2 opacity-40" />
            <p className="text-sm">No stores match your filters</p>
            <button
              onClick={() => {
                setQuery('')
                setActiveTag(null)
              }}
              className="underline-hover mt-1.5 text-xs font-semibold text-brand-700"
            >
              Clear filters
            </button>
          </div>
        )}
      </section>
    </div>
  )
}

function HeroBanner({
  deliveryArea,
  openCount,
  onCheckArea,
}: {
  deliveryArea: string | null
  openCount: number
  onCheckArea: () => void
}) {
  return (
    <section className="grid gap-10 border-b border-ink/10 pb-14 lg:grid-cols-12 lg:gap-10 lg:pb-20">
      <div className="lg:col-span-7">
        <p className="section-kicker text-[11px] font-semibold text-ink/45">
          {deliveryArea ? `Delivering to ${deliveryArea}` : 'South London grocery market'}
        </p>

        <h1 className="mt-5 max-w-xl font-display text-[2.5rem] font-medium leading-[1.04] tracking-[-0.02em] text-ink md:text-6xl lg:text-[4rem]">
          Groceries for the meals you <em className="text-brand-700">actually</em> cook.
        </h1>

        <p className="mt-6 max-w-md text-[15px] leading-7 text-ink/60">
          Shop trusted African and Caribbean stores near you, then get yams, plantain, fish, spices, and pantry staples delivered the same day.
        </p>

        <div className="mt-8 flex flex-wrap items-center gap-6">
          <a
            href="#stores-near-you"
            className="inline-flex items-center gap-2 bg-ink px-6 py-3 text-sm font-semibold text-[var(--paper)] transition-colors hover:bg-brand-800"
          >
            Order now <ArrowRight size={14} />
          </a>
          <button onClick={onCheckArea} className="underline-hover flex items-center gap-1.5 text-sm font-semibold text-ink/70 hover:text-ink">
            <MapPin size={13} />
            {deliveryArea ?? 'Check delivery area'}
          </button>
        </div>

        <dl className="mt-12 flex max-w-md items-baseline gap-10 border-t border-ink/10 pt-6">
          <HeroStat label="Open now" value={`${openCount}`} />
          <HeroStat label="Delivery" value="45–75 min" />
          <HeroStat label="Coverage" value="6 areas" />
        </dl>
      </div>

      <div className="flex flex-col gap-6 lg:col-span-5">
        <div className="relative flex min-h-[16rem] flex-1 flex-col justify-end overflow-hidden bg-brand-700 p-7 text-[var(--paper)]">
          <p className="section-kicker text-[11px] font-semibold text-brand-200">Weekly pick</p>
          <h3 className="mt-3 font-display text-3xl font-medium leading-[1.05] tracking-[-0.01em]">
            New-season produce &amp; freezer staples.
          </h3>
          <p className="mt-3 max-w-[16rem] text-sm leading-6 text-brand-100/75">
            The stores people come back to when it&rsquo;s time for a real pantry restock.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-6 border-t border-ink/10 pt-5">
          <PromoLine label="Hot deal" title="30% off" body="On your first 3 orders" />
          <PromoLine label="Fast delivery" title="Same-day" body="Available across selected areas" />
        </div>
      </div>
    </section>
  )
}

function PromoLine({ label, title, body }: { label: string; title: string; body: string }) {
  return (
    <div>
      <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-ink/40">{label}</p>
      <p className="mt-1.5 font-display text-xl font-medium text-ink">{title}</p>
      <p className="mt-1 text-xs leading-5 text-ink/55">{body}</p>
    </div>
  )
}

function HeroStat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-[10px] font-semibold uppercase tracking-[0.1em] text-ink/40">{label}</dt>
      <dd className="tabular mt-1.5 font-display text-2xl font-medium text-ink">{value}</dd>
    </div>
  )
}

function TagTab({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'shrink-0 whitespace-nowrap border-b-2 pb-0.5 text-xs font-semibold uppercase tracking-[0.06em] transition-colors',
        active ? 'border-ink text-ink' : 'border-transparent text-ink/45 hover:text-ink/70'
      )}
    >
      {label}
    </button>
  )
}
