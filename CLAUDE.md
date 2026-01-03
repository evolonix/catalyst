# Catalyst

React Router 7 application with SSR, demonstrating a modern admin dashboard with Headless UI components.

## Tech Stack

- **Framework:** React 19 + React Router 7 (SSR enabled)
- **Build:** Nx monorepo, Vite, TypeScript (strict mode)
- **Styling:** Tailwind CSS 4
- **Components:** Headless UI + custom wrappers
- **Animation:** Motion (Framer Motion v3)
- **Testing:** Vitest + Testing Library, Playwright (E2E)

## Project Structure

```
apps/
├── catalyst/                    # Main application
│   ├── app/
│   │   ├── routes/              # Page components (file-based routing)
│   │   │   ├── _auth/           # Auth layout group
│   │   │   ├── events/          # Event pages
│   │   │   ├── orders/          # Order pages
│   │   │   └── settings/        # Settings pages
│   │   ├── components/          # Reusable UI (30+ components)
│   │   ├── routes.tsx           # Route configuration
│   │   ├── app.tsx              # Main layout with sidebar
│   │   ├── auth.tsx             # Auth layout
│   │   ├── data.ts              # Mock data layer
│   │   ├── entry.server.tsx     # SSR streaming entry
│   │   └── entry.client.tsx     # Client hydration
│   ├── tests/                   # Unit/integration tests
│   └── vite.config.mts          # Vite + Vitest config
└── catalyst-e2e/                # Playwright E2E tests
```

## Commands

```bash
# Development
npm start                        # Dev server at localhost:4200

# Via Nx (preferred)
npx nx dev catalyst              # Development server
npx nx build catalyst            # Production build
npx nx preview catalyst          # Preview production build

# Testing
npx nx test catalyst             # Unit tests (Vitest)
npx nx e2e catalyst-e2e          # E2E tests (Playwright)

# Code Quality
npx nx lint catalyst             # ESLint
npx nx typecheck catalyst        # TypeScript checking
```

## Key Files

| Purpose | Location |
|---------|----------|
| Route config | [routes.tsx](apps/catalyst/app/routes.tsx) |
| Main layout | [app.tsx](apps/catalyst/app/app.tsx) |
| Data layer | [data.ts](apps/catalyst/app/data.ts) |
| SSR entry | [entry.server.tsx](apps/catalyst/app/entry.server.tsx) |
| Vite config | [vite.config.mts](apps/catalyst/vite.config.mts) |
| Nx config | [nx.json](nx.json) |

## Quick Patterns

**Route with loader:**
```typescript
export async function loader() {
  return { data: await getData() };
}
export default function Page() {
  const { data } = useLoaderData<typeof loader>();
}
```

**Polymorphic Button:** Pass `href` for Link, omit for button element.

**Routed modals:** Use `RoutedDialog` or `RoutedDrawer` with `onClosed` callback for navigation after animation.

**Context components:** Table, Dropdown use composition (`<Table><TableBody><TableRow>`).

## Additional Documentation

Check these files for detailed patterns when working in specific areas:

| Topic | File |
|-------|------|
| Architecture & design patterns | [.claude/docs/architectural_patterns.md](.claude/docs/architectural_patterns.md) |

## Component Library

All UI components in `apps/catalyst/app/components/` wrap Headless UI with Tailwind styling:

- **Layout:** `sidebar-layout`, `sidebar`, `navbar`, `stacked-layout`
- **Navigation:** `link`, `pagination`
- **Forms:** `input`, `select`, `checkbox`, `radio`, `switch`, `textarea`, `fieldset`
- **Feedback:** `alert`, `badge`, `avatar`
- **Overlays:** `dialog`, `drawer`, `dropdown`
- **Data display:** `table`, `description-list`
- **Typography:** `heading`, `text`, `divider`

Components follow consistent patterns: forwardRef, clsx for classes, data-* attributes for state styling.
