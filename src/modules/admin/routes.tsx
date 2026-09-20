import { lazy, Suspense } from 'react'
import type { RouteObject } from 'react-router-dom'
import { Navigate } from 'react-router-dom'
import { Spinner } from '@shared/components/Spinner'
import { AdminLayout } from './layout/AdminLayout'

const LoginPage = lazy(() =>
  import('./features/auth/LoginPage').then(m => ({ default: m.LoginPage }))
)
const OverviewPage = lazy(() =>
  import('./features/overview/OverviewPage').then(m => ({ default: m.OverviewPage }))
)
const StoresPage = lazy(() =>
  import('./features/stores/StoresPage').then(m => ({ default: m.StoresPage }))
)
const AdminOrdersPage = lazy(() =>
  import('./features/orders/AdminOrdersPage').then(m => ({ default: m.AdminOrdersPage }))
)
const UsersPage = lazy(() =>
  import('./features/users/UsersPage').then(m => ({ default: m.UsersPage }))
)

const fallback = (
  <div className="flex items-center justify-center min-h-[50dvh]">
    <Spinner />
  </div>
)

export const adminRoutes: RouteObject[] = [
  { path: '/admin/login', element: <Suspense fallback={fallback}><LoginPage /></Suspense> },

  {
    element: <AdminLayout />,
    children: [
      { path: '/admin/overview', element: <Suspense fallback={fallback}><OverviewPage /></Suspense> },
      { path: '/admin/stores',   element: <Suspense fallback={fallback}><StoresPage /></Suspense> },
      { path: '/admin/orders',   element: <Suspense fallback={fallback}><AdminOrdersPage /></Suspense> },
      { path: '/admin/users',    element: <Suspense fallback={fallback}><UsersPage /></Suspense> },
    ],
  },

  { path: '/admin', element: <Navigate to="/admin/overview" replace /> },
  { path: '/admin/*', element: <Navigate to="/admin/overview" replace /> },
]
