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
const WelcomeDetailsPage = lazy(() =>
  import('./features/auth/pages/WelcomeDetailsPage').then(m => ({ default: m.WelcomeDetailsPage }))
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
const PaymentPage = lazy(() =>
  import('./features/checkout/PaymentPage').then(m => ({ default: m.PaymentPage }))
)
const OrderConfirmationPage = lazy(() =>
  import('./features/order-confirmation/OrderConfirmationPage').then(m => ({ default: m.OrderConfirmationPage }))
)
const OrdersPage = lazy(() =>
  import('./features/orders/OrdersPage').then(m => ({ default: m.OrdersPage }))
)
const OrderDetailPage = lazy(() =>
  import('./features/orders/OrderDetailPage').then(m => ({ default: m.OrderDetailPage }))
)
const ProfilePage = lazy(() =>
  import('./features/profile/ProfilePage').then(m => ({ default: m.ProfilePage }))
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
  { path: '/auth/welcome', element: <Suspense fallback={fallback}><WelcomeDetailsPage /></Suspense> },
  { path: '/customer/zone-check', element: <Suspense fallback={fallback}><ZoneCheckPage /></Suspense> },

  // Customer app (with layout)
  {
    element: <CustomerLayout />,
    children: [
      { path: '/customer/home',    element: <Suspense fallback={fallback}><HomePage /></Suspense> },
      { path: '/customer/orders',  element: <Suspense fallback={fallback}><OrdersPage /></Suspense> },
      { path: '/customer/orders/:orderNumber', element: <Suspense fallback={fallback}><OrderDetailPage /></Suspense> },
      { path: '/customer/profile', element: <Suspense fallback={fallback}><ProfilePage /></Suspense> },
      { path: '/customer/cart',               element: <Suspense fallback={fallback}><CartPage /></Suspense> },
      { path: '/customer/checkout',           element: <Suspense fallback={fallback}><CheckoutPage /></Suspense> },
      { path: '/customer/payment',            element: <Suspense fallback={fallback}><PaymentPage /></Suspense> },
      { path: '/customer/order-confirmation', element: <Suspense fallback={fallback}><OrderConfirmationPage /></Suspense> },
      { path: '/customer/store/:storeId',     element: <Suspense fallback={fallback}><CataloguePage /></Suspense> },
    ],
  },

  { path: '/customer/*', element: <Navigate to="/customer/home" replace /> },
]
