import React from 'react';
import { Sidebar } from './sidebar/Sidebar';
import Container from '@/components/container';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/stores/AuthContext';

const Home = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  return (
    <Container>
      {user.role !== 'user' && <Button onClick={() => navigate('/tenant')}>add tenant user</Button>}
    </Container>
  );
};

export default Home;
