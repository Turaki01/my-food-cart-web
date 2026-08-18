import { type ReactNode, useState } from 'react'
import { ArrowRight, Clock3, MapPin, Search, Sparkles, Star } from 'lucide-react'
import { useLocationStore } from '@shared/stores/location.store'
import { cn } from '@shared/lib/utils'
import { StoreCard } from './components/StoreCard'
import { MOCK_STORES } from './mock'

const ALL_TAGS = [...new Set(MOCK_STORES.flatMap(store => store.categoryTags))]

const CATEGORY_ACCENTS = [
  'from-[#eef8f1] to-[#f8fcfa]',
  'from-[#edf7f3] to-[#f8fcfa]',
  'from-[#eef4ff] to-[#f9fbff]',
  'from-[#f3f6f4] to-[#fbfdfc]',
  'from-[#eff7f0] to-[#fcfefc]',
  'from-[#eff7ff] to-[#fbfdff]',
] as const

export function HomePage() {
  const deliveryArea = useLocationStore(s => s.deliveryArea)
  const [query, setQuery] = useState('')
  const [activeTag, setActiveTag] = useState<string | null>(null)

  const filtered = MOCK_STORES.filter(store => {
    const matchesQuery = query.trim()
      ? store.name.toLowerCase().includes(query.toLowerCase()) ||
        store.categoryTags.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
      : true
    const matchesTag = activeTag ? store.categoryTags.includes(activeTag) : true
    return matchesQuery && matchesTag
  })

  const openCount = filtered.filter(store => store.isOpen).length

  const featuredCategories = ALL_TAGS.slice(0, 6).map((tag, index) => ({
    tag,
    count: MOCK_STORES.filter(store => store.categoryTags.includes(tag)).length,
    accent: CATEGORY_ACCENTS[index % CATEGORY_ACCENTS.length],
  }))

  return (
    <div className="space-y-8 md:space-y-10">
      <HeroBanner deliveryArea={deliveryArea} openCount={openCount} />

      <section className="space-y-4">
        <div className="flex items-end justify-between">
          <div>
            <p className="section-kicker text-[11px] font-bold text-brand-600">Categories</p>
            <h2 className="mt-1 text-xl font-extrabold tracking-[-0.04em] text-slate-900 md:text-3xl">
              Shop by what you need
            </h2>
          </div>
          <button className="text-sm font-semibold text-slate-500 transition-colors hover:text-slate-900">
            View all
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">
          {featuredCategories.map(({ tag, count, accent }) => (
            <button
              key={tag}
              onClick={() => setActiveTag(tag === activeTag ? null : tag)}
              className={cn(
                'rounded-[1.6rem] border border-slate-200 bg-white p-4 text-left shadow-[0_18px_40px_-34px_rgba(15,23,42,0.14)] transition-all',
                activeTag === tag
                  ? 'border-brand-300 ring-2 ring-brand-100'
                  : 'hover:-translate-y-0.5 hover:border-slate-300'
              )}
            >
              <div className={cn('flex h-14 w-14 items-center justify-center rounded-[1.1rem] bg-gradient-to-br text-lg font-extrabold text-slate-900', accent)}>
                {getCategoryMonogram(tag)}
              </div>
              <p className="mt-4 text-sm font-bold text-slate-900">{tag}</p>
              <p className="mt-1 text-xs text-slate-500">{count} partner stores</p>
            </button>
          ))}
        </div>
      </section>

      <section id="stores-near-you" className="scroll-mt-24">
        <div className="mb-5 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="section-kicker text-[11px] font-bold text-brand-600">Popular stores</p>
            <h2 className="mt-1 text-xl font-extrabold tracking-[-0.04em] text-slate-900 md:text-3xl">
              Stores near you
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              {openCount} partner {openCount === 1 ? 'store' : 'stores'} delivering
              {deliveryArea ? ` to ${deliveryArea}` : ''}
            </p>
          </div>
          <button className="text-sm font-semibold text-slate-500 transition-colors hover:text-slate-900">
            View all
          </button>
        </div>

        <div className="paper-panel relative mb-6 rounded-[1.75rem] px-4 py-3 md:px-5">
          <Search size={15} className="pointer-events-none absolute left-8 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="search"
            placeholder="Search for food, stores, cuisines..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            className="w-full rounded-full border border-slate-200 bg-white py-3 pl-10 pr-4 text-sm text-slate-800 shadow-sm shadow-slate-900/5 placeholder:text-slate-400 focus:border-slate-300 focus:outline-none focus:ring-4 focus:ring-slate-100"
          />
        </div>

        <div className="mb-4 flex gap-2 overflow-x-auto pb-1 scrollbar-none">
          <TagPill label="All" active={activeTag === null} onClick={() => setActiveTag(null)} />
          {ALL_TAGS.map(tag => (
            <TagPill key={tag} label={tag} active={activeTag === tag} onClick={() => setActiveTag(tag === activeTag ? null : tag)} />
          ))}
        </div>

        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {filtered.map(store => (
              <StoreCard key={store.id} store={store} />
            ))}
          </div>
        ) : (
          <div className="paper-panel flex flex-col items-center justify-center rounded-[2rem] py-16 text-slate-500">
            <Search size={28} className="mb-2 opacity-30" />
            <p className="text-sm">No stores match your filters</p>
            <button
              onClick={() => {
                setQuery('')
                setActiveTag(null)
              }}
              className="mt-1.5 text-xs font-semibold text-brand-600 hover:underline"
            >
              Clear filters
            </button>
          </div>
        )}
      </section>
    </div>
  )
}

function HeroBanner({ deliveryArea, openCount }: { deliveryArea: string | null; openCount: number }) {
  return (
    <section className="paper-panel overflow-hidden rounded-[2.2rem] p-5 md:p-6">
      <div className="grid gap-6 lg:grid-cols-[1.55fr_0.95fr]">
        <div className="rounded-[2rem] bg-[linear-gradient(135deg,#ffffff,#f3f7ff)] p-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.8)] md:p-8">
          <div className="inline-flex items-center gap-2 rounded-full bg-brand-50 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.14em] text-brand-700">
            <Sparkles size={12} />
            Fresh groceries, delivered fast
          </div>

          <h1 className="mt-5 max-w-xl text-4xl font-extrabold leading-[0.95] tracking-[-0.05em] text-slate-950 md:text-6xl">
            Delicious groceries for the meals you actually cook.
          </h1>

          <p className="mt-4 max-w-lg text-sm leading-7 text-slate-500 md:text-base">
            Shop trusted African and Caribbean stores near you, then get yams, plantain, fish, spices, and pantry staples delivered the same day.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <a
              href="#stores-near-you"
              className="inline-flex items-center gap-2 rounded-2xl bg-brand-600 px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-brand-700"
            >
              Order now <ArrowRight size={15} />
            </a>
            <div className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700">
              <MapPin size={15} className="text-brand-600" />
              {deliveryArea ?? 'Check delivery area'}
            </div>
          </div>

          <div className="mt-7 grid gap-3 sm:grid-cols-3">
            <HeroStat label="Open stores" value={`${openCount}`} icon={<Star size={14} />} />
            <HeroStat label="Delivery" value="45-75 min" icon={<Clock3 size={14} />} />
            <HeroStat label="Areas" value="South London" icon={<MapPin size={14} />} />
          </div>
        </div>

        <div className="grid gap-4">
          <div className="relative overflow-hidden rounded-[2rem] border border-slate-200 bg-[linear-gradient(145deg,#eef5ff,#ffffff)] p-6">
            <div className="absolute -right-8 top-4 h-40 w-40 rounded-full bg-brand-50" />
            <div className="absolute bottom-0 right-8 h-52 w-52 rounded-full border-[18px] border-white bg-[radial-gradient(circle_at_top,#b9eacb,#25a057)] shadow-[0_30px_50px_-30px_rgba(37,160,87,0.4)]" />
            <div className="relative z-10 max-w-[15rem]">
              <p className="section-kicker text-[11px] font-bold text-brand-600">Weekly pick</p>
              <h3 className="mt-2 text-2xl font-extrabold tracking-[-0.04em] text-slate-900">
                New-season produce and freezer staples.
              </h3>
              <p className="mt-3 text-sm leading-6 text-slate-500">
                Browse the stores people come back to when they need a real pantry restock.
              </p>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
            <MiniPromo
              label="Hot deal"
              title="30% OFF"
              body="On your first 3 orders"
            />
            <MiniPromo
              label="Fast delivery"
              title="Same-day slots"
              body="Available across selected areas"
            />
          </div>
        </div>
      </div>
    </section>
  )
}

function MiniPromo({ label, title, body }: { label: string; title: string; body: string }) {
  return (
    <div className="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-[0_18px_38px_-34px_rgba(15,23,42,0.18)]">
      <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-brand-600">{label}</p>
      <p className="mt-2 text-2xl font-extrabold tracking-[-0.04em] text-slate-900">{title}</p>
      <p className="mt-1 text-sm text-slate-500">{body}</p>
      <button className="mt-4 text-sm font-bold text-brand-600 transition-colors hover:text-brand-700">
        Order now
      </button>
    </div>
  )
}

function HeroStat({ label, value, icon }: { label: string; value: string; icon: ReactNode }) {
  return (
    <div className="rounded-[1.3rem] border border-slate-200 bg-white px-4 py-3">
      <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.12em] text-slate-400">
        {icon}
        {label}
      </div>
      <p className="mt-2 text-base font-bold text-slate-900">{value}</p>
    </div>
  )
}

function TagPill({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'shrink-0 rounded-full border px-4 py-2 text-xs font-semibold transition-all',
        active
          ? 'border-brand-200 bg-brand-50 text-brand-700'
          : 'border-slate-200 bg-white text-slate-500 hover:border-slate-300 hover:text-slate-900'
      )}
    >
      {label}
    </button>
  )
}

function getCategoryMonogram(label: string) {
  return label
    .split(' ')
    .slice(0, 2)
    .map(part => part[0])
    .join('')
    .toUpperCase()
}
