import { lazy, Suspense } from 'react'
import type { RouteObject } from 'react-router-dom'
import { Navigate } from 'react-router-dom'
import { Spinner } from '@shared/components/Spinner'
import { OpsLayout } from './layout/OpsLayout'

const LoginPage = lazy(() =>
  import('./features/auth/LoginPage').then(m => ({ default: m.LoginPage }))
)
const DispatchBoardPage = lazy(() =>
  import('./features/dispatch/DispatchBoardPage').then(m => ({ default: m.DispatchBoardPage }))
)

const fallback = (
  <div className="flex items-center justify-center min-h-[50dvh]">
    <Spinner />
  </div>
)

export const opsRoutes: RouteObject[] = [
  { path: '/ops/login', element: <Suspense fallback={fallback}><LoginPage /></Suspense> },

  {
    element: <OpsLayout />,
    children: [
      { path: '/ops/dispatch', element: <Suspense fallback={fallback}><DispatchBoardPage /></Suspense> },
    ],
  },

  { path: '/ops', element: <Navigate to="/ops/dispatch" replace /> },
  { path: '/ops/*', element: <Navigate to="/ops/dispatch" replace /> },
]
