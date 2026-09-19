import { lazy, Suspense } from 'react'
import type { RouteObject } from 'react-router-dom'
import { Navigate } from 'react-router-dom'
import { Spinner } from '@shared/components/Spinner'
import { StorePartnerLayout } from './layout/StorePartnerLayout'

const LoginPage = lazy(() =>
  import('./features/auth/LoginPage').then(m => ({ default: m.LoginPage }))
)
const OrdersDashboardPage = lazy(() =>
  import('./features/orders/OrdersDashboardPage').then(m => ({ default: m.OrdersDashboardPage }))
)
const CatalogPage = lazy(() =>
  import('./features/catalog/CatalogPage').then(m => ({ default: m.CatalogPage }))
)
const SettingsPage = lazy(() =>
  import('./features/settings/SettingsPage').then(m => ({ default: m.SettingsPage }))
)

const fallback = (
  <div className="flex items-center justify-center min-h-[50dvh]">
    <Spinner />
  </div>
)

export const storePartnerRoutes: RouteObject[] = [
  { path: '/store/login', element: <Suspense fallback={fallback}><LoginPage /></Suspense> },

  {
    element: <StorePartnerLayout />,
    children: [
      { path: '/store/orders',  element: <Suspense fallback={fallback}><OrdersDashboardPage /></Suspense> },
      { path: '/store/catalog', element: <Suspense fallback={fallback}><CatalogPage /></Suspense> },
      { path: '/store/settings', element: <Suspense fallback={fallback}><SettingsPage /></Suspense> },
    ],
  },

  { path: '/store', element: <Navigate to="/store/orders" replace /> },
  { path: '/store/*', element: <Navigate to="/store/orders" replace /> },
]
