import { Outlet } from 'react-router';
import { AuthLayout } from './components/auth-layout';

export function Auth() {
  return (
    <AuthLayout>
      <Outlet />
    </AuthLayout>
  );
}

export default Auth;
