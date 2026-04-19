# Claude Frontend Instructions — 2gather

> Stack: React 18, TypeScript, Vite, TanStack Query, Zustand, React Hook Form + Zod, Axios, React Router v6, CSS Modules, PWA (vite-plugin-pwa)
> Place this file at the root of the frontend repository.

---

## 1. Project Overview

2gather is a collaborative home planning application. Users manage items grouped by room/category, compare multiple product options per item (with price, link, notes), track spending, and collaborate in real time with invited partners/family. The application is a PWA — it must be installable and functional offline.

---

## 2. Project Structure

```
src/
├── assets/
│   ├── styles/           # Global CSS variables, reset, typography, color tokens
│   ├── images/
│   └── icons/
├── components/
│   ├── ui/               # Shared base components: Button, Input, Modal, Badge, Card, etc.
│   └── layout/           # AppLayout, TopNavLayout, AuthLayout, Sidebar, TopNav, Breadcrumb
├── features/
│   ├── auth/             # Login, Register, Invite accept flow
│   ├── lists/            # List selector, create list
│   ├── items/            # Item list, item detail page, mark purchased
│   ├── options/          # Option list inside item detail, add/edit option form
│   ├── categories/       # Category filter, custom category creation
│   ├── members/          # Member list, invite flow, role management
│   ├── ratings/          # Star rating system for options
│   ├── claims/           # Claim (talip olma) system
│   └── reports/          # Summary cards, category breakdown, spending chart
│       └── [feature]/
│           ├── components/
│           ├── hooks/
│           ├── store/
│           ├── types/
│           └── api/
├── hooks/                # Global shared hooks (useSignalR, useAuth, usePermission, usePWAInstall)
├── lib/                  # Utility functions, helpers, constants, formatters
├── pages/                # Route-level page components (thin wrappers over features)
├── router/               # React Router v6 config, route constants, ProtectedRoute
├── services/             # Axios instance, interceptors, SignalR connection setup
├── store/                # Global Zustand store (auth, activeList, UI preferences)
├── types/                # Global TypeScript types and API response shapes
└── main.tsx
```

---

## 3. TypeScript

- Always use **strict TypeScript** — no `any`, no `as unknown` suppression.
- Define types/interfaces in the relevant `types/` folder — not inline in components.
- Use `interface` for object shapes, `type` for unions, intersections, and aliases.
- All function parameters and return types must be explicitly typed.
- API response types must match backend DTOs exactly — never leave API data untyped.

---

## 4. Components

- Use **functional components** exclusively. No class components.
- One component per file. Filenames use **PascalCase**: `ItemCard.tsx`, `OptionDetailModal.tsx`.
- Keep components focused on a single visual responsibility. Split if doing more than one thing.
- Always define a `Props` interface for every component, even with a single prop.
- Use destructuring in the function signature:

```tsx
interface Props {
  itemId: string;
  isPurchased: boolean;
}
const ItemCard = ({ itemId, isPurchased }: Props) => { ... }
```

### Naming Conventions

| Element | Pattern | Example |
|---|---|---|
| Components | PascalCase | `ItemCard`, `InviteMemberModal` |
| Hooks | `use` prefix | `useItems`, `useListMembers` |
| Event handlers | `handle` prefix | `handleMarkPurchased`, `handleDeleteOption` |
| Boolean props/state | `is/has/can` prefix | `isPurchased`, `hasOptions`, `canEdit` |
| Route constants | SCREAMING_SNAKE_CASE | `ROUTES.LIST_DETAIL`, `ROUTES.REPORTS` |
| Query keys | SCREAMING_SNAKE_CASE constant | `QUERY_KEYS.ITEMS`, `QUERY_KEYS.OPTIONS` |

---

## 5. State Management

- **Server state** → TanStack Query (`useQuery` for reads, `useMutation` for writes).
- **Global client state** → Zustand: auth session, active list ID, UI preferences (sidebar open, dark mode), notification count.
- **Local UI state** → `useState` (modal open/close, toggles) or `useReducer` (complex local logic).
- Do not use Zustand for server data. Do not use TanStack Query for pure client state.
- Keep Zustand slices flat. No deeply nested state.
- Always define `queryKey` arrays as constants in `lib/queryKeys.ts` — never inline strings.
- After a SignalR event arrives, invalidate or update the relevant TanStack Query cache entry directly — do not store SignalR data in Zustand. Exception: `NotificationCountChanged` event updates notification count in Zustand (owner only).

---

## 6. API Layer

- All HTTP calls go through the shared **Axios instance** in `services/api.ts`.
- The instance handles: base URL from env (`VITE_API_BASE_URL`), JWT injection via request interceptor, automatic token refresh on 401 via response interceptor, error normalization.
- Define each API call as a typed async function in `features/[feature]/api/`.
- No raw `fetch` calls. No Axios calls outside the `api/` layer.
- Wrap API functions in `useQuery`/`useMutation` hooks inside `features/[feature]/hooks/`.
- Always invalidate or update related query cache after mutations.

---

## 7. Real-time Collaboration (SignalR)

- SignalR connection is initialized in `services/signalR.ts` and managed by the global `useSignalR` hook.
- Connect after login, disconnect on logout.
- On route enter for a list, join the list's SignalR group by calling the hub's `JoinList(listId)` method.
- SignalR events update the TanStack Query cache directly via `queryClient.setQueryData` or `queryClient.invalidateQueries` — not via Zustand.
- Handle these incoming events:

```ts
ItemAdded               → add item to items query cache
ItemUpdated             → update item in items query cache
ItemPurchased           → invalidate pending + purchased items cache
ItemDeleted             → remove item from items query cache
OptionAdded             → invalidate options cache for that itemId
OptionUpdated           → update specific option in cache
OptionDeleted           → remove option from cache
OptionFinalized         → invalidate options cache for that itemId
OptionFinalRemoved      → invalidate options cache for that itemId
OptionRatingUpdated     → invalidate options cache for that itemId
ClaimCreated            → invalidate options and claims cache
ClaimReviewed           → invalidate options and claims cache
MemberJoined            → update members query cache
MemberRemoved           → update members query cache
NotificationCountChanged → update notificationCount in Zustand (owner only)
```

- Show an "online members" indicator (avatar row) using connected member data from SignalR presence.
- Pass JWT as query string for the SignalR WebSocket connection: `?access_token=<token>`.
- Auto-reconnect policy: retry 3 times with exponential backoff.

---

## 8. Forms

- All forms use **React Hook Form**.
- All validation uses **Zod**. Define schema first, derive the type with `z.infer<typeof schema>`.
- Error messages come from the Zod schema — never hardcode error strings in JSX.
- Never validate manually with `if` checks in submit handlers.

---

## 9. Routing

- Router: React Router v6 with `createBrowserRouter`.
- All route path strings live in `router/routes.ts` as constants — never hardcoded elsewhere.
- Use `React.lazy` + `Suspense` for all page-level components.
- `ProtectedRoute` wrapper checks auth state; unauthenticated users redirect to `/login`.
- Route structure:

```
/login
/register
/invite/:token                      ← Invite accept page (no auth required)
/lists                              ← List selector / dashboard
/lists/:listId                      ← Project dashboard
/lists/:listId/items                ← Item list
/lists/:listId/items/new            ← New item form (full page)
/lists/:listId/items/:itemId        ← Item detail (full page, not modal)
/lists/:listId/reports              ← Reports page
/lists/:listId/members              ← Members management
```

### Layout assignment per route

- `/login`, `/register`, `/invite/:token` → `AuthLayout`
- `/lists` → `TopNavLayout` (horizontal top nav, no sidebar)
- All `/lists/:listId/*` routes → `AppLayout` (210px fixed sidebar)

---

## 10. Styling

- Use **CSS Modules** for all component-level styling.
- Global styles (reset, design tokens, typography) in `assets/styles/globals.css`.
- CSS custom properties (variables) for all colors, spacing, and typography scales.
- No inline styles except truly dynamic values (calculated widths, user-chosen colors).
- CSS Module class names: `camelCase` → `.itemCard`, `.isPurchased`, `.optionRow`.
- **Never hardcode hex color values inside component CSS modules** — always reference a CSS variable.

### Design Tokens (CSS Variables)

```css
/* Fonts — loaded from Google Fonts */
--font-display: 'Bricolage Grotesque', system-ui, sans-serif;
--font-body: 'Inter', system-ui, sans-serif;

/* Font sizes */
--text-xs: 11px;
--text-sm: 13px;
--text-base: 15px;
--text-md: 17px;
--text-lg: 22px;
--text-xl: 32px;
--text-2xl: 48px;
--text-3xl: 64px;

/* Primary — forest green */
--color-primary: #3D5A4C;
--color-primary-hover: #2E4438;
--color-primary-light: #EEF2EF;
--color-primary-muted: #6B8F7A;

/* Backgrounds */
--color-bg-page: #F5F3EE;
--color-bg-card: #FFFFFF;
--color-bg-sidebar: #FFFFFF;
--color-bg-tag: #EFEFEC;
--color-bg-dark-card: #3D5A4C;

/* Text */
--color-text-primary: #1A1A1A;
--color-text-secondary: #6B6B6B;
--color-text-muted: #9B9B9B;
--color-text-on-dark: #FFFFFF;
--color-text-on-dark-muted: #B8CBB8;

/* Status */
--color-status-purchased: #3D5A4C;
--color-status-purchased-bg: #E8F0EA;
--color-status-pending: #8B8B8B;
--color-status-pending-bg: #F0F0F0;

/* Borders */
--color-border: #E8E6E0;
--color-border-input: #D4D0C8;
--color-border-dashed: #C8C5BC;

/* Progress */
--color-progress-bg: #E0DDD6;
--color-progress-fill: #3D5A4C;

/* Role badges */
--color-badge-owner-bg: #3D5A4C;
--color-badge-owner-text: #FFFFFF;
--color-badge-editor-bg: #E8EDF0;
--color-badge-editor-text: #3D5A7A;
--color-badge-viewer-bg: #F0EFEB;
--color-badge-viewer-text: #6B6B6B;

/* Spacing */
--space-1: 4px;
--space-2: 8px;
--space-3: 12px;
--space-4: 16px;
--space-6: 24px;
--space-8: 32px;
--space-10: 40px;

/* Border radius */
--radius-sm: 6px;
--radius-md: 10px;
--radius-lg: 16px;
--radius-pill: 20px;

/* Layout */
--sidebar-width: 210px;
--content-max-width: 1100px;
```

### Typography rules

- `--font-display` is used **only** for: h1, h2, h3, large numbers, project names, and the logo.
- `--font-body` is used for everything else: labels, body text, inputs, buttons, badges, table cells.
- Never mix fonts within the same element.

### Component style conventions

- Cards: `background: var(--color-bg-card)`, `border-radius: var(--radius-lg)`, `border: 1px solid var(--color-border)`
- Dark cards: `background: var(--color-bg-dark-card)`, white text, same radius
- Primary buttons: `background: var(--color-primary)`, `color: white`, `border-radius: var(--radius-md)`
- Secondary buttons: `background: transparent`, `border: 1px solid var(--color-border)`, `border-radius: var(--radius-md)`
- Inputs: `border: none`, `border-bottom: 1.5px solid var(--color-border-input)`, `background: transparent`
- Input focus: `border-bottom-color: var(--color-primary)`, no outline
- Badges/chips: `border-radius: var(--radius-pill)`, `padding: 4px 12px`, `font-size: var(--text-xs)`
- Progress bars: `height: 4px`, `background: var(--color-progress-bg)`, fill `var(--color-progress-fill)`, `border-radius: 2px`

---

## 11. Layout System

Three layout components live in `src/components/layout/`:

**`AuthLayout`** — login, register, invite accept. Two-column full-screen card: left panel (dark green overlay photo, logo, tagline), right panel (white, form centered vertically).

**`TopNavLayout`** — list selector. Horizontal top navbar (logo left, nav links center, bell + avatar right). Content area: `max-width: var(--content-max-width)`, centered, `background: var(--color-bg-page)`.

**`AppLayout`** — all project pages. Fixed left `Sidebar` (`var(--sidebar-width)`, white) + right content area (`background: var(--color-bg-page)`, `padding: var(--space-10)`).

**`Sidebar`** content (top to bottom):
1. Logo: "2gather" in `--font-display` 18px bold + "Birlikte Planlayın" in `--text-xs` muted
2. Nav links with icon + label. Active: `background: var(--color-primary-light)`, `color: var(--color-primary)`, `border-radius: var(--radius-sm)`
3. Settings — pinned to bottom
4. User info (avatar 32px circle + display name + role) — below Settings

---

## 12. Key UI Behaviours

- **List selector**: two-column layout — owned lists left, invited lists right. Each card shows avatar stack, item count, completion percentage progress bar.
- **Project dashboard**: financial summary card + pending claims widget (with notification badge) + category grid with completion percentage and member avatars per category.
- **Item list**: 3-column card grid, grouped by category with category header. Cards show product image, name, status badge, option count, selected option price. Status filter: Pending / Purchased / All.
- **Item detail**: full page, not modal. Route `/lists/:listId/items/:itemId`. Left: large image + options list. Right panel: meta card + technical details card (brand/model/color from option) + planning note dark card.
- **New item**: full page at `/lists/:listId/items/new`. Category chip selector + optional image upload + optional first option fields.
- **Options**: each option card shows title, price, link, star rating (average + user score), isSelected indicator, isFinal badge. If isFinal: claim section below (remaining %, existing claimants, "Talip Ol" button).
- **Mark purchased**: visible only to approved claimants or Owner (if no claimants). Triggers SignalR broadcast.
- **Reports**: financial summary + dark readiness card + segmented progress bars per category + item status table with thumbnails.
- **Members**: member list with role badges + pending invites with cancel button + right-side invite panel.

---

## 13. Permissions

- Use a `usePermission(listId)` hook returning `{ canEdit: boolean, canManageMembers: boolean, isOwner: boolean }`.
- Conditionally render edit controls, delete buttons, and invite flows based on role.
- Never rely on hiding UI alone — role is enforced server-side; UI guards are for UX only.
- Specific rules:
  - "Nihai Karar Ver" button: Owner only
  - "Talip Ol" button: Editor and Owner only
  - Claim approve/reject: Owner only
  - Invite / remove member: Owner only

---

## 14. Error Handling

- All async operations must handle error state explicitly in the UI.
- Use TanStack Query `isError` / `error` states — never silently swallow errors.
- Show user-friendly inline error messages in Turkish — never raw API error strings.
- Global 401 / 500 handling at Axios interceptor level.
- Never use empty `catch` blocks.
- 403 on mark-purchased: show "Bu ürünü satın alındı olarak işaretlemek için onaylı talip olmanız veya liste sahibi olmanız gerekiyor."

---

## 15. Performance

- `React.memo`, `useCallback`, `useMemo` only when there is a measurable reason — not by default.
- Lazy-load all page components via `React.lazy`.
- Keep state as local as possible to avoid unnecessary re-renders.
- Debounce any search/filter inputs by 300ms before triggering queries.

---

## 16. PWA

2gather must be a fully installable Progressive Web App.

### Required packages

```
npm install vite-plugin-pwa workbox-window
```

### vite.config.ts — VitePWA plugin

```ts
import { VitePWA } from 'vite-plugin-pwa'

VitePWA({
  registerType: 'autoUpdate',
  includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'masked-icon.svg'],
  manifest: {
    name: '2gather',
    short_name: '2gather',
    description: 'Birlikte planlayın',
    theme_color: '#3D5A4C',
    background_color: '#F5F3EE',
    display: 'standalone',
    orientation: 'portrait',
    scope: '/',
    start_url: '/',
    icons: [
      { src: 'pwa-192x192.png', sizes: '192x192', type: 'image/png' },
      { src: 'pwa-512x512.png', sizes: '512x512', type: 'image/png' },
      { src: 'pwa-512x512.png', sizes: '512x512', type: 'image/png', purpose: 'any maskable' }
    ]
  },
  workbox: {
    globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
    runtimeCaching: [
      {
        urlPattern: /^https?:\/\/.*\/api\/.*/i,
        handler: 'NetworkFirst',
        options: {
          cacheName: '2gather-api-cache',
          expiration: { maxEntries: 100, maxAgeSeconds: 60 * 60 * 24 },
          networkTimeoutSeconds: 10,
          cacheableResponse: { statuses: [0, 200] }
        }
      },
      {
        urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
        handler: 'CacheFirst',
        options: {
          cacheName: '2gather-google-fonts-cache',
          expiration: { maxEntries: 10, maxAgeSeconds: 60 * 60 * 24 * 365 }
        }
      },
      {
        urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp)$/i,
        handler: 'StaleWhileRevalidate',
        options: {
          cacheName: '2gather-image-cache',
          expiration: { maxEntries: 200, maxAgeSeconds: 60 * 60 * 24 * 30 }
        }
      }
    ]
  }
})
```

### Cache stratejileri

- **API calls** → NetworkFirst: her zaman güncel veri tercih edilir, network yoksa cache'ten servis edilir.
- **Google Fonts** → CacheFirst: font değişmez, cache yeterli.
- **Görseller** → StaleWhileRevalidate: hızlı göster, arka planda güncelle.

### Offline behaviour

- Offline durumda TanStack Query in-memory cache'ten veri servis eder. Stale cache için hata state'i gösterme — TopNav'da küçük "Çevrimdışı" indicator göster.
- Offline'da denenen mutation'lar için inline uyarı: "İnternet bağlantısı yok. Bağlantı kurulunca tekrar dene."
- SignalR bağlantı kesilince otomatik yeniden bağlanır (retry politikası `services/signalR.ts`'te tanımlı).
- Offline fallback: `public/offline.html` — 2gather logosu + "İnternet bağlantınız yok." mesajı.

### Install prompt

- `src/hooks/usePWAInstall.ts`: `beforeinstallprompt` event'ini dinler, `{ isInstallable, promptInstall }` döner.
- `isInstallable` true iken TopNav veya Sidebar'da "Ana ekrana ekle" butonu göster. Stil: küçük outline buton, `var(--color-primary)` renk. Kurulunca veya dismiss edilince gizle.
- Install prompt'u hiçbir zaman modal veya blocking overlay içinde gösterme.

### PWA icon dosyaları

`public/` klasörüne koy:
- `pwa-192x192.png` — 192×192px
- `pwa-512x512.png` — 512×512px
- `apple-touch-icon.png` — 180×180px
- `favicon.ico`
- `masked-icon.svg`

Tüm ikonlar `#3D5A4C` arka plan üzerine beyaz 2gather logosu veya monogram içerir.

---

## 17. Code Cleanliness

- No `console.log` in committed code.
- No commented-out code blocks without an explanation comment.
- No unused imports or variables.
- Destructure props and objects instead of repeated dot-notation access.
- Extract complex logic into named variables or helper functions before the JSX `return`.

---

*Last updated: 2026-04-19*
