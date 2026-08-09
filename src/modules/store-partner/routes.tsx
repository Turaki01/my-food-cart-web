import type { RouteObject } from 'react-router-dom'

// Placeholder — store partner module scaffold
const StorePartnerHomePlaceholder = () => (
  <div className="min-h-[100dvh] flex items-center justify-center text-gray-400">
    Store Partner Dashboard — coming soon
  </div>
)

export const storePartnerRoutes: RouteObject[] = [
  { path: '/store/*', element: <StorePartnerHomePlaceholder /> },
]
