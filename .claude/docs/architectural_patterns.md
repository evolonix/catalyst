# Architectural Patterns

This document describes the architectural patterns, design decisions, and conventions used throughout the Catalyst codebase.

## Routing (React Router 7)

File-based routing with programmatic route config in [routes.tsx](../../apps/catalyst/app/routes.tsx#L1-L17).

**Key patterns:**
- `layout()` for nested layouts with `<Outlet />` for child content
- `index()` for default routes
- `route(path, file)` for explicit route definitions
- Underscore prefix directories (`_auth/`) for layout groups

**Loaders:** Async data fetching before component render:
```typescript
export async function loader() {
  const events = await getEvents();
  return { events };
}
// Access with: useLoaderData<typeof loader>()
```

Reference: [events.tsx:13-17](../../apps/catalyst/app/routes/events/events.tsx#L13-L17)

## Data Fetching

Mock data layer in [data.ts](../../apps/catalyst/app/data.ts) with async functions:
- Direct exports: `getOrders()`, `getEvents()`, `getCountries()`
- Filter helpers: `getOrder(id)`, `getEvent(id)`
- Cross-resource relations handled within functions

Pattern: Route loaders call data functions, components consume via `useLoaderData()`.

## Component Patterns

### Polymorphic Components

Components that can render as different elements based on props. Used in [button.tsx:161-204](../../apps/catalyst/app/components/button.tsx#L161-L204):

```typescript
// Button renders as <button> or <Link> based on href prop
<Button>Click me</Button>           // renders button
<Button href="/path">Go</Button>    // renders Link
```

Uses discriminated unions for mutually exclusive props (color vs outline vs plain).

### Headless UI Wrappers

Thin wrappers around Headless UI providing consistent styling. Pattern in [dropdown.tsx](../../apps/catalyst/app/components/dropdown.tsx):

- Composition-based: `Dropdown`, `DropdownButton`, `DropdownMenu`, `DropdownItem`
- Pass-through props with added Tailwind classes
- Built-in anchor positioning

### Context-Based Composition

Parent components provide context consumed by children. See [table.tsx:1-124](../../apps/catalyst/app/components/table.tsx#L1-L124):

```typescript
<Table dense striped>       // TableContext provides {dense: true, striped: true}
  <TableBody>
    <TableRow>
      <TableCell>...</TableCell>  // Reads context for styling
    </TableRow>
  </TableBody>
</Table>
```

### Routed Modals/Drawers

Components that manage their own open/close state for route-based display. See [dialog.tsx:90-154](../../apps/catalyst/app/components/dialog.tsx#L90-L154) and [drawer.tsx:149-237](../../apps/catalyst/app/components/drawer.tsx#L149-L237).

**Key pattern:**
- Start `open: true`, user closes, animation plays, `onClosed` callback triggers navigation
- Render props for dynamic content: `children: (api: { open, close }) => ReactNode`
- AnimatePresence wraps for exit animations

## Layout Pattern

[SidebarLayout](../../apps/catalyst/app/components/sidebar-layout.tsx#L47-L82) accepts navbar, sidebar, and children props:

```typescript
<SidebarLayout
  navbar={<Navbar>...</Navbar>}
  sidebar={<Sidebar>...</Sidebar>}
>
  <Outlet />  {/* Page content */}
</SidebarLayout>
```

Mobile/desktop responsive: fixed sidebar on desktop, drawer on mobile (`max-lg:` breakpoint).

## Form Handling

Standard HTML forms with Headless UI controls. See [settings.tsx:24-100](../../apps/catalyst/app/routes/settings/settings.tsx#L24-L100):

- `<form method="post">` for submission
- `name` attributes on inputs for serialization
- `defaultValue` for initial values
- Local state (`useState`) for dependent field updates
- Nested components for sub-sections ([address.tsx](../../apps/catalyst/app/routes/settings/address.tsx))

## Animation Patterns

Using Motion (Framer Motion v3):

**Layout animations:** Shared element transitions via `layoutId`:
```typescript
<motion.span layoutId="current-indicator" className="..." />
```
Reference: [sidebar.tsx:110-115](../../apps/catalyst/app/components/sidebar.tsx#L110-L115)

**Enter/exit animations:** AnimatePresence with initial/animate/exit:
```typescript
<AnimatePresence onExitComplete={onClosed}>
  {open && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} />}
</AnimatePresence>
```
Reference: [dialog.tsx:116-131](../../apps/catalyst/app/components/dialog.tsx#L116-L131)

**Timing convention:**
- Enter: 100-300ms with ease-out `[0, 0, 0.2, 1]`
- Exit: 100-200ms with ease-in `[0.4, 0, 1, 1]`

## Styling Conventions

**clsx for conditional classes:** All components use clsx for class composition.

**Data attributes for state:** `data-hover`, `data-focus`, `data-disabled`, `data-current` instead of `:hover`, `:focus` pseudo-classes (from Headless UI).

**Dark mode:** All components include `dark:` variant classes.

**Responsive breakpoints:** `max-lg:` for mobile-first, `sm:`, `lg:` for progressive enhancement.

**CSS custom properties:** `[--gutter]`, `[--spacing]` for dynamic sizing in layout components.

## SSR/Streaming

Server entry ([entry.server.tsx:18-69](../../apps/catalyst/app/entry.server.tsx#L18-L69)) handles:
- Bot detection via `isbot` for `onAllReady` vs `onShellReady`
- Streaming responses with `renderToPipeableStream`
- Shell vs streaming error separation
- Timeout abort after stream timeout

## Testing Pattern

React Router testing with `createRoutesStub()`. See [_index.spec.tsx](../../apps/catalyst/tests/routes/_index.spec.tsx):

```typescript
const ReactRouterStub = createRoutesStub([{ path: '/', Component: App }]);
render(<ReactRouterStub />);
await waitFor(() => screen.findByText('...'));
```
