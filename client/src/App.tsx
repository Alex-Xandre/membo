import React, { Suspense, useCallback, useContext, useEffect } from 'react';
import LoginLayout from './pages/auth/LoginLayout';
import Home from './pages/dashboard/Home';
import { Route, Routes } from 'react-router-dom';
import { useAuth } from './stores/AuthContext';
import NotFound from './helpers/not-found';
import { SocketContext } from './stores/SocketContext';
import toast, { Toaster } from 'react-hot-toast';
import { getUser } from './api/get.info.api';

import { AppSidebar } from './pages/dashboard/sidebar/app-sidebar';
import RegisterLayout from './pages/auth/RegisterLayout';

const App = () => {
  const { isLoggedIn, user, dispatch } = useAuth();
  const { socket } = useContext(SocketContext);

  useEffect(() => {
    const token = sessionStorage.getItem('token');
    if (token) {
      const handlegetInfo = async () => {
        const res = await getUser();
        if (res.success === false) return toast.error(res.data?.msg || 'Error');
        dispatch({ type: 'SIGNING', payload: res });
        socket.emit('login', res._id);
      };
      handlegetInfo();
    }
  }, [dispatch, isLoggedIn]);

  const adminRoutes = [{ path: '/', element: <Home /> }];

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
        {isLoggedIn && <AppSidebar />}
        {/* <SidebarTrigger className='ml-60' /> */}
        {renderRoutes()}
      </Suspense>
    </div>
  );
};

export default App;
