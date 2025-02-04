import React from 'react';
import { Sidebar } from './sidebar/Sidebar';
import Container from '@/components/container';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const Home = () => {

  const navigate =useNavigate()
  return <Container>
    <Button onClick={() => navigate("/tenant")} >
      add tenant user
    </Button>
  </Container>;
};

export default Home;
