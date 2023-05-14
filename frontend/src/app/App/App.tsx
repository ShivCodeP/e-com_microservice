import React from 'react';
import { useAuthInfo } from '../Hooks/auth/auth.hooks';

const Auth = React.lazy(() => import('./Auth'));
const NonAuth = React.lazy(() => import('./NonAuth'));

export function App() {
  const authInfo = useAuthInfo();

  if (!authInfo.authenticated) return <NonAuth />;

  return <Auth />;
}

export default App;
