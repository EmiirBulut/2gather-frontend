import { lazy, Suspense } from 'react'
import { createBrowserRouter, Navigate } from 'react-router-dom'
import { ROUTES } from './routes'
import ProtectedRoute from './ProtectedRoute'

// ─── Lazy Page Imports ────────────────────────────────────────────────────────

const LoginPage = lazy(() => import('@/pages/LoginPage'))
const RegisterPage = lazy(() => import('@/pages/RegisterPage'))
const InviteAcceptPage = lazy(() => import('@/pages/InviteAcceptPage'))
const ListSelectorPage = lazy(() => import('@/pages/ListSelectorPage'))
const ListDetailPage = lazy(() => import('@/pages/ListDetailPage'))
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
      background: 'var(--color-surface)',
      color: 'var(--color-on-surface-variant)',
      fontFamily: 'var(--font-body)',
      fontSize: 'var(--text-body-md)',
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
  // Public routes
  {
    path: ROUTES.LOGIN,
    element: withSuspense(<LoginPage />),
  },
  {
    path: ROUTES.REGISTER,
    element: withSuspense(<RegisterPage />),
  },
  {
    path: ROUTES.INVITE,
    element: withSuspense(<InviteAcceptPage />),
  },

  // Protected routes
  {
    element: <ProtectedRoute />,
    children: [
      {
        path: ROUTES.LISTS,
        element: withSuspense(<ListSelectorPage />),
      },
      {
        path: ROUTES.LIST_DETAIL,
        element: withSuspense(<ListDetailPage />),
      },
      {
        path: ROUTES.REPORTS,
        element: withSuspense(<ReportsPage />),
      },
      {
        path: ROUTES.MEMBERS,
        element: withSuspense(<MembersPage />),
      },
    ],
  },

  // Default redirect
  {
    path: '/',
    element: <Navigate to={ROUTES.LISTS} replace />,
  },
  {
    path: '*',
    element: <Navigate to={ROUTES.LOGIN} replace />,
  },
])
