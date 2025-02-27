import Container from '@/components/container';
import React, { useEffect, useState } from 'react';
import { TenantSidebar } from './sidebar/sidebar';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSidebar } from '@/components/ui/sidebar';
import TenantUsers from './pages/users';
import TenantEvent from './pages/events';
import { useAuth } from '@/stores/AuthContext';

const TenantHome = () => {
  const params = useLocation();
  const [activeIndex, setActiveIndex] = useState(0);

  const { open } = useSidebar();
  const { user } = useAuth();
  useEffect(() => {
    switch (true) {
      case params.search.includes('?view=users'):
        setActiveIndex(1);
        break;
      case params.search.includes('?view=events'):
        setActiveIndex(2);
        break;
      case params.search.includes('?view=profile'):
        setActiveIndex(3);
        break;
      case params.search.includes('?view=billing'):
        setActiveIndex(4);
        break;
      default:
        setActiveIndex(0);
        break;
    }
  }, [params.search]);

  return (
    <Container>
      <TenantSidebar />
      <section
        className={`
        ${user.role === 'tenant' && (!open ? 'ml-80 w-[calc(100vw-20rem)]' : 'ml-[34.5rem] w-[calc(100vw-34.5rem)]')}
        flex-grow-0 w-full   absolute z-30 flex items-center justify-center  left-0 h-[calc(100dvh-70px)] overflow-y-auto pt-3`}
      >
        <div className={`flex-grow h-full px-5 ${user.role==="admin" && "ml-72"}`}>
          {activeIndex === 1 && <TenantUsers />}
          {activeIndex === 2 && <TenantEvent />}
        </div>
      </section>
    </Container>
  );
};

export default TenantHome;
