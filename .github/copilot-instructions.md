# Copilot Instructions for Catalyst

## Architecture Overview

This is an Nx monorepo containing a React Router 7 SSR application built with React 19, Tailwind CSS 4, and Headless UI. The app demonstrates a modern admin dashboard with file-based routing and server-side rendering.

**Key structural decisions:**

- **Nx workspace**: Uses Nx for task orchestration, caching, and monorepo management. Always use `npx nx <target> <project>` for commands.
- **React Router 7**: SSR-enabled with streaming response via `entry.server.tsx`. Routes defined programmatically in `routes.tsx` using layout/route/index functions.
- **Mock data layer**: All data operations are in `data.ts` (async functions returning hardcoded objects). No real backend or database.
- **Component architecture**: Custom wrappers around Headless UI in `components/` directory, styled with Tailwind CSS using `clsx` for conditional classes.

## Essential Commands

```bash
# Development (port 4200)
npx nx dev catalyst

# Build & preview
npx nx build catalyst
npx nx preview catalyst

# Testing
npx nx test catalyst           # Vitest unit tests
npx nx e2e catalyst-e2e        # Playwright E2E

# Code quality
npx nx lint catalyst
npx nx typecheck catalyst
```

**Note**: `npm start` is an alias for `npx nx dev catalyst`. Always prefer explicit Nx commands for clarity.

## Routing Conventions

Routes are defined in `routes.tsx` using React Router 7's route config API:

```typescript
// Nested routes under layouts
layout('./app.tsx', [
  index('./routes/home.tsx'),                    // /
  route('events', './routes/events/events.tsx', [
    route('new', './routes/events/new-event.tsx'),  // /events/new
  ]),
])

// Separate layout group
layout('./auth.tsx', [
  route('login', './routes/_auth/login.tsx'),    // /login
])
```

**Critical pattern**: Routes use loaders for data and actions for mutations. Always export typed functions:

```typescript
export async function loader() {
  const data = await getData();
  return { data };
}

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  await saveData(formData);
  return { success: true };
}

export default function Page() {
  const { data } = useLoaderData<typeof loader>();
  // ...
}
```

## Component Patterns

### Polymorphic Components

The `Button` component switches between `<button>` and `<Link>` based on props:

```tsx
<Button>Click me</Button>           {/* renders <button> */}
<Button href="/events">Go</Button>  {/* renders React Router <Link> */}
```

### Routed Modals & Drawers

Use `RoutedDialog` or `RoutedDrawer` for modals that are URL-driven (e.g., `/events/new`). The `onClosed` callback must handle navigation after the exit animation completes:

```tsx
<RoutedDrawer onClosed={() => navigate('/events')}>
  {({ close }) => (
    <Form method="post">
      <EventForm onCancel={close} />
    </Form>
  )}
</RoutedDrawer>
```

**Why**: Headless UI animations need to complete before React Router navigates away. The render prop provides a `close()` function to trigger the exit animation, and `onClosed` fires when animation finishes.

### Composition-Based Components

Components like `Table`, `Dropdown`, `Fieldset` use composition patterns:

```tsx
<Table>
  <TableHead>
    <TableRow>
      <TableHeader>Name</TableHeader>
    </TableRow>
  </TableHead>
  <TableBody>
    <TableRow>
      <TableCell>{item.name}</TableCell>
    </TableRow>
  </TableBody>
</Table>
```

All components use `forwardRef` for ref forwarding and accept standard HTML props via spread.

### Styling Pattern

All components use:

- **clsx** for conditional class merging
- **Tailwind utility classes** with CSS variables for theming (e.g., `bg-(--btn-bg)`)
- **data-\* attributes** for state-based styling (e.g., `data-hover`, `data-disabled`)
- **Dark mode**: `dark:` prefix for dark mode variants

```tsx
className={clsx(
  'base-classes',
  variant === 'solid' && 'solid-classes',
  className  // Allow prop override
)}
```

## Data Layer

All data operations are in `data.ts` with async functions:

```typescript
export async function getEvents() { /* ... */ }
export async function getEvent(id: string) { /* ... */ }
export async function createEvent(data: EventData) { /* ... */ }
export async function updateEvent(id: string, data: EventData) { /* ... */ }
export async function deleteEvent(id: string) { /* ... */ }
```

Data is hardcoded mock data (arrays of objects). Mutations modify in-memory arrays. No persistence across restarts.

## Testing Approach

- **Unit tests**: Vitest with Testing Library in `tests/` directory. Tests focus on component behavior and user interactions.
- **E2E tests**: Playwright in `catalyst-e2e` project. Tests run against built application.
- **Configuration**: Vitest config embedded in `vite.config.mts`. Uses jsdom environment with globals enabled.

## TypeScript Configuration

- **Strict mode enabled**: All strict TypeScript checks are on (`strict: true`, `noUnusedLocals`, `noImplicitReturns`, etc.)
- **Module resolution**: Uses `bundler` mode for Vite compatibility
- **Base config**: Shared settings in `tsconfig.base.json`, extended by app-specific configs

## Key Files Reference

| Purpose              | File                                                                     |
| -------------------- | ------------------------------------------------------------------------ |
| Route definitions    | [apps/catalyst/app/routes.tsx](apps/catalyst/app/routes.tsx)             |
| Main layout          | [apps/catalyst/app/app.tsx](apps/catalyst/app/app.tsx)                   |
| Auth layout          | [apps/catalyst/app/auth.tsx](apps/catalyst/app/auth.tsx)                 |
| Data operations      | [apps/catalyst/app/data.ts](apps/catalyst/app/data.ts)                   |
| SSR streaming        | [apps/catalyst/app/entry.server.tsx](apps/catalyst/app/entry.server.tsx) |
| Vite + Vitest config | [apps/catalyst/vite.config.mts](apps/catalyst/vite.config.mts)           |
| Nx configuration     | [nx.json](nx.json)                                                       |
| Component library    | [apps/catalyst/app/components/](apps/catalyst/app/components/)           |

## Working with Forms

Use React Router's `useFetcher` for form submissions without full page navigation:

```tsx
const fetcher = useFetcher<typeof action>();

<fetcher.Form method="post">
  <Input name="field" />
  <Button type="submit">Submit</Button>
</fetcher.Form>
```

Form data is accessed in actions via `request.formData()`. All form fields must have `name` attributes.

## SSR Considerations

- **Streaming**: App uses `renderToPipeableStream` with bot detection (`isbot`) to wait for all content for crawlers
- **Hydration**: Client entry handles hydration via `hydrateRoot`
- **Data loading**: Loaders run on server during SSR, providing initial data to components
- **No server state**: All data is mock/static, no database or API calls

## Nx Plugin Integration

The workspace uses Nx plugins for automatic task detection:

- `@nx/react/router-plugin`: Detects React Router projects, provides `dev`, `build`, `start` targets
- `@nx/vite/plugin`: Detects Vite config, provides `build`, `test`, `serve` targets
- `@nx/vitest`: Detects Vitest config, provides `test` target
- `@nx/eslint/plugin`: Detects ESLint config, provides `lint` target
- `@nx/playwright/plugin`: Detects Playwright config, provides `e2e` target

Always check `nx.json` for target configurations and task dependencies.
