import { type RouteConfig, index, layout, route } from '@react-router/dev/routes';

export default [
  layout('./app.tsx', [
    index('./routes/home.tsx'),
    route('events', './routes/events/events.tsx', [
      route('new', './routes/events/new-event.tsx'),
    ]),
    route('events/:eventId', './routes/events/event.tsx', [
      route('edit', './routes/events/edit-event.tsx'),
      route('delete', './routes/events/delete-event.tsx'),
    ]),
    route('orders', './routes/orders/orders.tsx'),
    route('orders/:orderId', './routes/orders/order.tsx'),
    route('settings', './routes/settings/settings.tsx'),
  ]),
  layout('./auth.tsx', [
    route('login', './routes/_auth/login.tsx'),
    route('register', './routes/_auth/register.tsx'),
    route('forgot-password', './routes/_auth/forgot-password.tsx'),
  ]),
] satisfies RouteConfig;
