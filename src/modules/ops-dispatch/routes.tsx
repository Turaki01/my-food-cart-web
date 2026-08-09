import type { RouteObject } from 'react-router-dom'

// Placeholder — ops dispatch module scaffold
const OpsDispatchHomePlaceholder = () => (
  <div className="min-h-[100dvh] flex items-center justify-center text-gray-400">
    Ops Dispatch — coming soon
  </div>
)

export const opsRoutes: RouteObject[] = [
  { path: '/ops/*', element: <OpsDispatchHomePlaceholder /> },
]
