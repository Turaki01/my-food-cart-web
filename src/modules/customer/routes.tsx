import { lazy, Suspense } from 'react'
import type { RouteObject } from 'react-router-dom'
import { Navigate } from 'react-router-dom'
import { Spinner } from '@shared/components/Spinner'
import { CustomerLayout } from './layout/CustomerLayout'

const PhoneEntryPage = lazy(() =>
  import('./features/auth/pages/PhoneEntryPage').then(m => ({ default: m.PhoneEntryPage }))
)
const OTPPage = lazy(() =>
  import('./features/auth/pages/OTPPage').then(m => ({ default: m.OTPPage }))
)
const ZoneCheckPage = lazy(() =>
  import('./features/zone-check/ZoneCheckPage').then(m => ({ default: m.ZoneCheckPage }))
)
const HomePage = lazy(() =>
  import('./features/home/HomePage').then(m => ({ default: m.HomePage }))
)
const CataloguePage = lazy(() =>
  import('./features/catalogue/CataloguePage').then(m => ({ default: m.CataloguePage }))
)
const CartPage = lazy(() =>
  import('./features/cart/CartPage').then(m => ({ default: m.CartPage }))
)
const CheckoutPage = lazy(() =>
  import('./features/checkout/CheckoutPage').then(m => ({ default: m.CheckoutPage }))
)
const OrderConfirmationPage = lazy(() =>
  import('./features/order-confirmation/OrderConfirmationPage').then(m => ({ default: m.OrderConfirmationPage }))
)

const PlaceholderPage = ({ label }: { label: string }) => (
  <div className="flex items-center justify-center min-h-[50dvh] text-gray-400 text-sm">
    {label} — coming soon
  </div>
)

const fallback = (
  <div className="flex items-center justify-center min-h-[50dvh]">
    <Spinner />
  </div>
)

export const customerRoutes: RouteObject[] = [
  // Auth screens (no layout chrome)
  { path: '/auth/phone', element: <Suspense fallback={fallback}><PhoneEntryPage /></Suspense> },
  { path: '/auth/otp',   element: <Suspense fallback={fallback}><OTPPage /></Suspense> },
  { path: '/customer/zone-check', element: <Suspense fallback={fallback}><ZoneCheckPage /></Suspense> },

  // Customer app (with layout)
  {
    element: <CustomerLayout />,
    children: [
      { path: '/customer/home',    element: <Suspense fallback={fallback}><HomePage /></Suspense> },
      { path: '/customer/orders',  element: <PlaceholderPage label="Order history" /> },
      { path: '/customer/profile', element: <PlaceholderPage label="Profile & settings" /> },
      { path: '/customer/cart',               element: <Suspense fallback={fallback}><CartPage /></Suspense> },
      { path: '/customer/checkout',           element: <Suspense fallback={fallback}><CheckoutPage /></Suspense> },
      { path: '/customer/order-confirmation', element: <Suspense fallback={fallback}><OrderConfirmationPage /></Suspense> },
      { path: '/customer/store/:storeId',     element: <Suspense fallback={fallback}><CataloguePage /></Suspense> },
    ],
  },

  { path: '/customer/*', element: <Navigate to="/customer/home" replace /> },
]
