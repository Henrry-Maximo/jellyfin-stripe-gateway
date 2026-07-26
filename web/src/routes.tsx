import { createBrowserRouter } from 'react-router-dom';

import { NotFound } from './pages/404';
import { AppLayout } from './pages/_layouts/app';
import { Checkout } from './pages/app/checkout';
import { Success } from './pages/app/success';
import { Cancel } from './pages/app/cancel';
import { AuthLayout } from './pages/_layouts/auth';
import { SignIn } from './pages/auth/sign-in';

export const router = createBrowserRouter([
  {
    path: '/auth',
    element: <AuthLayout />,
    children: [
      {
        path: 'sign-in',
        element: <SignIn />,
      },
    ],
  },
  {
    path: '/',
    element: <AppLayout />,
    children: [
      {
        path: '/',
        element: <Checkout />,
      },
      {
        path: '/success',
        element: <Success />,
      },
      {
        path: '/cancel',
        element: <Cancel />,
      },
    ],
  },
  {
    path: '*',
    element: <NotFound />,
  },
]);
