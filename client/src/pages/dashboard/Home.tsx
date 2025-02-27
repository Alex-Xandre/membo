/* eslint-disable @typescript-eslint/no-unused-vars */
import Container from '@/components/container';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/stores/AuthContext';
import { Calendar1Icon, ExternalLink, FilterIcon, MapPin } from 'lucide-react';
import { useEvent } from '@/stores/EventContext';
import { useSidebar } from '@/components/ui/sidebar';
import { ScrollArea, Scrollbar } from '@radix-ui/react-scroll-area';
import LeftPanel from './LeftPanel';

const Home = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { events } = useEvent();
  const { open } = useSidebar();

  return (
    <Container>
      {/* Left panel */}
      <LeftPanel />
      <ScrollArea className=' flex-1 ml-60'>
        {user.role === 'admin' && <Button onClick={() => navigate('/tenant')}>add tenant user</Button>}
      </ScrollArea>
    </Container>
  );
};

export default Home;
