import { lazy, Suspense } from 'react'
import { createBrowserRouter, Navigate } from 'react-router-dom'
import { ROUTES } from './routes'
import ProtectedRoute from './ProtectedRoute'
import { AppLayout } from '@/components/layout/AppLayout'
import { TopNavLayout } from '@/components/layout/TopNavLayout'
import { AuthLayout } from '@/components/layout/AuthLayout'

// ─── Lazy Page Imports ────────────────────────────────────────────────────────

const LoginPage = lazy(() => import('@/pages/LoginPage'))
const RegisterPage = lazy(() => import('@/pages/RegisterPage'))
const InviteAcceptPage = lazy(() => import('@/pages/InviteAcceptPage'))
const ListSelectorPage = lazy(() => import('@/pages/ListSelectorPage'))
const ListDetailPage = lazy(() => import('@/pages/ListDetailPage'))
const ItemListPage = lazy(() => import('@/pages/ItemListPage'))
const ReportsPage = lazy(() => import('@/pages/ReportsPage'))
const MembersPage = lazy(() => import('@/pages/MembersPage'))

// ─── Suspense Fallback ────────────────────────────────────────────────────────

const PageLoader = () => (
  <div
    style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100dvh',
      background: 'var(--color-bg-page)',
      color: 'var(--color-text-secondary)',
      fontFamily: 'var(--font-body)',
      fontSize: '15px',
    }}
  >
    Yükleniyor…
  </div>
)

const withSuspense = (element: React.ReactNode) => (
  <Suspense fallback={<PageLoader />}>{element}</Suspense>
)

// ─── Router ───────────────────────────────────────────────────────────────────

export const router = createBrowserRouter([
  // Auth layout routes
  {
    element: <AuthLayout />,
    children: [
      { path: ROUTES.LOGIN, element: withSuspense(<LoginPage />) },
      { path: ROUTES.REGISTER, element: withSuspense(<RegisterPage />) },
      { path: ROUTES.INVITE, element: withSuspense(<InviteAcceptPage />) },
    ],
  },

  // Protected — TopNavLayout (list selector)
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <TopNavLayout />,
        children: [
          { path: ROUTES.LISTS, element: withSuspense(<ListSelectorPage />) },
        ],
      },
      {
        element: <AppLayout />,
        children: [
          { path: ROUTES.LIST_DETAIL, element: withSuspense(<ListDetailPage />) },
          { path: ROUTES.ITEM_LIST, element: withSuspense(<ItemListPage />) },
          { path: ROUTES.REPORTS, element: withSuspense(<ReportsPage />) },
          { path: ROUTES.MEMBERS, element: withSuspense(<MembersPage />) },
        ],
      },
    ],
  },

  // Default redirect
  { path: '/', element: <Navigate to={ROUTES.LISTS} replace /> },
  { path: '*', element: <Navigate to={ROUTES.LOGIN} replace /> },
])
