import { useMemo, useState } from 'react'
import { ArrowRight, MapPin, Search } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { MOCK_PRODUCTS } from '@modules/customer/features/catalogue/mock'
import { useLocationStore } from '@shared/stores/location.store'
import { useStoresStore } from '@shared/stores/stores.store'
import { cn } from '@shared/lib/utils'
import { StoreCard } from './components/StoreCard'

export function HomePage() {
  const navigate = useNavigate()
  const deliveryArea = useLocationStore(s => s.deliveryArea)
  const stores = useStoresStore(s => s.stores)
  const [query, setQuery] = useState('')
  const [activeTag, setActiveTag] = useState<string | null>(null)
  const normalizedQuery = query.trim().toLowerCase()

  const allTags = useMemo(() => [...new Set(stores.flatMap(store => store.categoryTags))], [stores])
  const storeSearchTerms = useMemo(
    () =>
      Object.fromEntries(
        stores.map(store => [
          store.id,
          [
            store.name,
            store.area,
            ...store.categoryTags,
            ...(MOCK_PRODUCTS[store.id] ?? []).flatMap(product => [product.name, product.category, product.hint]),
          ].map(value => value.toLowerCase()),
        ])
      ),
    [stores]
  )

  const filtered = stores.filter(store => {
    const matchesQuery = normalizedQuery
      ? storeSearchTerms[store.id]?.some(term => term.includes(normalizedQuery))
      : true
    const matchesTag = activeTag ? store.categoryTags.includes(activeTag) : true
    return matchesQuery && matchesTag
  })

  const openCount = filtered.filter(store => store.isOpen).length

  const featuredCategories = allTags.slice(0, 6).map(tag => ({
    tag,
    count: stores.filter(store => store.categoryTags.includes(tag)).length,
  }))

  return (
    <div className="space-y-8">
      <HeroBanner deliveryArea={deliveryArea} openCount={openCount} onCheckArea={() => navigate('/customer/zone-check')} />

      <section className="rounded-xl border border-ink/10 bg-white p-6 shadow-sm md:p-7">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <p className="section-kicker text-[11px] font-semibold text-brand-600">Departments</p>
            <h2 className="mt-2 font-display text-2xl font-medium tracking-[-0.01em] text-ink md:text-3xl">
              Shop by what you need
            </h2>
          </div>
          <button className="shrink-0 text-sm font-semibold text-brand-600 hover:text-brand-700">
            View all
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-6">
          {featuredCategories.map(({ tag, count }) => (
            <button
              key={tag}
              onClick={() => setActiveTag(tag === activeTag ? null : tag)}
              className={cn(
                'rounded-lg border p-4 text-left transition-colors',
                activeTag === tag ? 'border-brand-600 bg-brand-600 text-white' : 'border-ink/10 hover:border-brand-300 hover:bg-brand-50/40'
              )}
            >
              <p className={cn('text-sm font-semibold', activeTag === tag ? 'text-white' : 'text-ink')}>{tag}</p>
              <p className={cn('mt-1 text-xs', activeTag === tag ? 'text-white/70' : 'text-ink/45')}>
                {count} partner stores
              </p>
            </button>
          ))}
        </div>
      </section>

      <section id="stores-near-you" className="scroll-mt-24 rounded-xl border border-ink/10 bg-white p-6 shadow-sm md:p-7">
        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="section-kicker text-[11px] font-semibold text-brand-600">Popular stores</p>
            <h2 className="mt-2 font-display text-2xl font-medium tracking-[-0.01em] text-ink md:text-3xl">
              Stores near you
            </h2>
            <p className="mt-2 text-sm text-ink/55">
              {openCount} partner {openCount === 1 ? 'store' : 'stores'} delivering
              {deliveryArea ? ` to ${deliveryArea}` : ''}
            </p>
          </div>
          <button className="shrink-0 text-sm font-semibold text-brand-600 hover:text-brand-700">
            View all
          </button>
        </div>

        <div className="mb-6 flex flex-col gap-5 border-t border-ink/10 pt-5 md:flex-row md:items-center md:justify-between">
          <div className="relative w-full md:max-w-xs">
            <Search size={14} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink/35" />
            <input
              type="search"
              placeholder="Search for food, stores, cuisines…"
              value={query}
              onChange={e => setQuery(e.target.value)}
              className="w-full rounded-lg border border-ink/15 bg-gray-50 py-2 pl-9 pr-3 text-sm text-ink placeholder:text-ink/35 transition-colors focus:border-brand-600 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-600/20"
            />
          </div>

          <div className="flex gap-6 overflow-x-auto pb-1 scrollbar-none">
            <TagTab label="All" active={activeTag === null} onClick={() => setActiveTag(null)} />
            {allTags.map(tag => (
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
          <div className="flex flex-col items-center justify-center rounded-lg border border-ink/10 bg-gray-50 py-16 text-ink/50">
            <Search size={22} className="mb-2 opacity-40" />
            <p className="text-sm">No stores match your filters</p>
            <button
              onClick={() => {
                setQuery('')
                setActiveTag(null)
              }}
              className="mt-1.5 text-xs font-semibold text-brand-600 hover:text-brand-700"
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
    <section className="grid gap-6 rounded-xl border border-ink/10 bg-white p-7 shadow-sm lg:grid-cols-12 lg:gap-10 lg:p-10">
      <div className="lg:col-span-7">
        <p className="section-kicker text-[11px] font-semibold text-brand-600">
          {deliveryArea ? `Delivering to ${deliveryArea}` : 'South London grocery market'}
        </p>

        <h1 className="mt-5 max-w-xl font-display text-[2.5rem] font-semibold leading-[1.04] tracking-[-0.02em] text-ink md:text-6xl lg:text-[4rem]">
          Groceries for the meals you <span className="text-brand-600">actually</span> cook.
        </h1>

        <p className="mt-6 max-w-md text-[15px] leading-7 text-ink/60">
          Shop trusted African and Caribbean stores near you, then get yams, plantain, fish, spices, and pantry staples delivered the same day.
        </p>

        <div className="mt-8 flex flex-wrap items-center gap-6">
          <a
            href="#stores-near-you"
            className="inline-flex items-center gap-2 rounded-lg bg-brand-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-brand-700"
          >
            Order now <ArrowRight size={14} />
          </a>
          <button onClick={onCheckArea} className="flex items-center gap-1.5 text-sm font-semibold text-ink/70 hover:text-ink">
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
        <div className="relative flex min-h-[16rem] flex-1 flex-col justify-end overflow-hidden rounded-xl bg-brand-600 p-7 text-white">
          <p className="section-kicker text-[11px] font-semibold text-brand-100">Weekly pick</p>
          <h3 className="mt-3 font-display text-3xl font-medium leading-[1.05] tracking-[-0.01em]">
            New-season produce &amp; freezer staples.
          </h3>
          <p className="mt-3 max-w-[16rem] text-sm leading-6 text-brand-50/80">
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
        active ? 'border-brand-600 text-brand-700' : 'border-transparent text-ink/45 hover:text-ink/70'
      )}
    >
      {label}
    </button>
  )
}
