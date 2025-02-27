import React, { Suspense, useCallback, useContext, useEffect } from 'react';
import LoginLayout from './pages/auth/LoginLayout';
import Home from './pages/dashboard/Home';
import { Route, Routes } from 'react-router-dom';
import { useAuth } from './stores/AuthContext';
import NotFound from './helpers/not-found';
import { SocketContext } from './stores/SocketContext';
import toast, { Toaster } from 'react-hot-toast';
import { getAllUser, getUser } from './api/get.info.api';

import { AppSidebar } from './pages/dashboard/sidebar/app-sidebar';
import RegisterLayout from './pages/auth/RegisterLayout';
import { AppSidebarAdmin } from './pages/dashboard/sidebar/main-admin-sidebar';
import TenantHome from './pages/dashboard-tenant/TenantHome';
import TenantUsers from './pages/dashboard-tenant/pages/users';
import Container from './components/container';
import EventHomeUser from './pages/user-dashboard/user-event';
import { useCartStore } from './pages/user-dashboard/cart/cart-store';
import CartContainer from './pages/user-dashboard/cart/cart-container';
import CheckOutHome from './pages/user-dashboard/user-checkout';
import TenantEvent from './pages/dashboard-tenant/pages/events';
import { TenantMainSidebar } from './pages/dashboard-tenant/sidebar/main-tenant-sidebar';
import NewTenantUser from './pages/dashboard-tenant/pages/users/new';
import Profile from './pages/dashboard-tenant/pages/profile';

const App = () => {
  const { isLoggedIn, user, dispatch } = useAuth();
  const { socket } = useContext(SocketContext);
  useEffect(() => {
    const token = sessionStorage.getItem('token');
    if (token) {
      const handlegetInfo = async () => {
        const res = await getUser();
        const fetchUsers = await getAllUser();

        if (res.success === false) return toast.error(res.data?.msg || 'Error');

        dispatch({ type: 'SIGNING', payload: res });
        dispatch({ type: 'GET_ALL_USER', payload: fetchUsers.filter((user) => user.role !== 'admin') });
        socket.emit('login', res._id);

        // if (location.pathname === '/') {
        //   setTimeout(() => {
        //     navigate(res.role !== 'user' ? '/' : `/${res.tenantUserId?.tenantId}`);
        //   }, 1500);
        // }
      };
      handlegetInfo();
    }
  }, [dispatch, isLoggedIn]);

  const adminRoutes = [
    { path: '/', element: <Home /> },
    {
      path: '/tenant',
      element: <TenantUsers />,
    },
    { path: '/:tenantId', element: <TenantHome /> },
  ];

  const userRoutes = [
    {
      path: '/:tenantId',

      element: <Home />,
    },
    {
      path: '/:tenantId/events',
      element: <EventHomeUser />,
    },
    {
      path: '/:tenantId/events/checkout',
      element: <CheckOutHome />,
    },
  ];

  const tenantRoute = [
    { path: '/', element: <Home /> },
    {
      path: '/users',
      element: (
        <Container>
          <TenantUsers />
        </Container>
      ),
    },

    {
      path: '/events',
      element: (
        <Container>
          <TenantEvent />
        </Container>
      ),
    },

    {
      path: '/profile',
      element: (
        <Container>
          <Profile />
        </Container>
      ),
    },
    {
      path: '/profile/update',
      element: (
        <Container>
          <NewTenantUser />
        </Container>
      ),
    },
  ];

  const publicRoutes = [
    { path: '/', element: <LoginLayout /> },
    { path: '/:tenantId', element: <LoginLayout /> },
    { path: '/register', element: <RegisterLayout /> },
  ];

  const renderRoutes = useCallback(() => {
    return (
      <Routes>
        {isLoggedIn &&
          user.role === 'admin' &&
          adminRoutes.map((route) => (
            <Route
              key={route.path}
              path={route.path}
              element={route.element}
            />
          ))}

        {isLoggedIn &&
          user.role === 'tenant' &&
          tenantRoute.map((route) => (
            <Route
              key={route.path}
              path={route.path}
              element={route.element}
            />
          ))}

        {isLoggedIn &&
          user.role === 'user' &&
          userRoutes.map((route) => (
            <Route
              key={route.path}
              path={route.path}
              element={route.element}
            />
          ))}

        {!isLoggedIn &&
          publicRoutes.map((route) => (
            <Route
              key={route.path}
              path={route.path}
              element={route.element}
            />
          ))}

        <Route
          path='*'
          element={<NotFound />}
        />
      </Routes>
    );
  }, [isLoggedIn, user]);

  const isOpen = useCartStore((state) => state.isOpen);
  return (
    <div className='  overflow-y-hidden overflow-x-hidden h-[100dvh] w-screen '>
      <Toaster position='top-right' />
      <Suspense fallback={<div>Loading...</div>}>
        {renderRoutes()}
        {isLoggedIn && user.role === 'user' && <AppSidebar />}
        {isLoggedIn && isOpen && <CartContainer />}
        {isLoggedIn && user.role === 'admin' && <AppSidebarAdmin />}
        {isLoggedIn && user.role === 'tenant' && <TenantMainSidebar />}
        {/* <SidebarTrigger className='ml-60' /> */}
      </Suspense>
    </div>
  );
};

export default App;
