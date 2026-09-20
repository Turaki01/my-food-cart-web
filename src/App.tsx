import { Suspense } from 'react'
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom'
import { Spinner } from '@shared/components/Spinner'
import { useAuthStore } from '@shared/stores/auth.store'
import { useLocationStore } from '@shared/stores/location.store'
import { customerRoutes } from '@modules/customer/routes'
import { storePartnerRoutes } from '@modules/store-partner/routes'
import { opsRoutes } from '@modules/ops-dispatch/routes'
import { adminRoutes } from '@modules/admin/routes'

function RootRedirect() {
  const user = useAuthStore(s => s.user)
  const hasCompletedZoneCheck = useLocationStore(s => s.hasCompletedZoneCheck)

  if (user?.role === 'admin') return <Navigate to="/admin" replace />
  if (user?.role === 'store_partner') return <Navigate to="/store" replace />
  if (user?.role === 'ops') return <Navigate to="/ops" replace />
  if (!hasCompletedZoneCheck) return <Navigate to="/customer/zone-check" replace />
  return <Navigate to="/customer/home" replace />
}

const router = createBrowserRouter([
  { path: '/', element: <RootRedirect /> },
  ...customerRoutes,
  ...storePartnerRoutes,
  ...opsRoutes,
  ...adminRoutes,
])

function PageLoader() {
  return (
    <div className="min-h-[100dvh] flex items-center justify-center">
      <Spinner size="lg" />
    </div>
  )
}

export default function App() {
  return (
    <Suspense fallback={<PageLoader />}>
      <RouterProvider router={router} />
    </Suspense>
  )
}
