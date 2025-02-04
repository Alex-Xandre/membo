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
import { useFetchAndDispatch } from './helpers/useFetch';
import TenantUsers from './pages/dashboard-tenant/pages/users';
import { useSidebar } from './components/ui/sidebar';
import Container from './components/container';

const App = () => {
  const { isLoggedIn, user, dispatch } = useAuth();
  const { socket } = useContext(SocketContext);
  const { open } = useSidebar();
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
      };
      handlegetInfo();
    }
  }, [dispatch, isLoggedIn]);

  const adminRoutes = [
    { path: '/', element: <Home /> },
    {
      path: '/tenant',
      element: (
        <Container>
          <TenantUsers />
        </Container>
      ),
    },
    { path: '/:tenantId', element: <TenantHome /> },
  ];

  const publicRoutes = [
    { path: '/', element: <LoginLayout /> },
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

  return (
    <div className='  overflow-y-hidden overflow-x-hidden h-[100dvh] w-screen'>
      <Toaster position='top-right' />
      <Suspense fallback={<div>Loading...</div>}>
        {renderRoutes()}
        {isLoggedIn && user.role === 'user' && <AppSidebar />}

        {isLoggedIn && user.role === 'admin' && <AppSidebarAdmin />}
        {/* <SidebarTrigger className='ml-60' /> */}
      </Suspense>
    </div>
  );
};

export default App;
