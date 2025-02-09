import Breadcrumb from '@/components/bread-crumb';
import ReusableTable from '@/components/reusable-table';
import { Button } from '@/components/ui/button';
import NavContainer from '@/components/ui/nav-container';
import Title from '@/components/ui/title';
import { PlusIcon } from 'lucide-react';
import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import NewEvents from './new';
import { getAllEvents } from '@/api/event.api';
import { useFetchAndDispatch } from '@/helpers/useFetch';
import { useEvent } from '@/stores/EventContext';

const TenantEvent = () => {
  const columns = [
    { header: 'ID', accessor: '_id' },
    { header: 'Title', accessor: 'eventName' },
    { header: 'Event Type', accessor: 'eventType' },
    { header: 'Starting Date', accessor: 'eventStartDate' },
    { header: 'Ending Date', accessor: 'eventEndDate' },
  ];

  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: 'Events', isCurrentPage: true },
  ];

  const navigate = useNavigate();
  useFetchAndDispatch(getAllEvents, 'SET_EVENTS');
  const params = useLocation();
  const { events } = useEvent();

  if (params.search.includes('new')) {
    return <NewEvents />;
  }

  return (
    <>
      <Breadcrumb items={breadcrumbItems} />
      <NavContainer>
        <Title text='List of Events' />
        <Button onClick={() => navigate(`${window.location.pathname}?view=events&new=new`)}>
          <PlusIcon />
          Event
        </Button>
      </NavContainer>
      <ReusableTable
        data={events}
        columns={columns as any}
        onEdit={(item) =>
          navigate(`${window.location.pathname}?view=events&new=${item?._id}`, { state: { isEdit: true } })
        }
        title='Invoice'
        tableHeader={''}
      />
    </>
  );
};

export default TenantEvent;
