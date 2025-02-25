import Breadcrumb from '@/components/bread-crumb';
import ReusableTable from '@/components/reusable-table';
import { Button } from '@/components/ui/button';
import NavContainer from '@/components/ui/nav-container';
import Title from '@/components/ui/title';
import { PlusIcon } from 'lucide-react';
import React, { useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import NewEvents from './new';
import { getAllEvents, getAllTransaction } from '@/api/event.api';
import { useFetchAndDispatch } from '@/helpers/useFetch';
import { useEvent } from '@/stores/EventContext';
import { useAuth } from '@/stores/AuthContext';

const TenantEvent = () => {
  const columns = [
    { header: 'Attendees', accessor: 'users' },
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
  useFetchAndDispatch(getAllTransaction, 'SET_TRANSACTIONS');

  const params = useLocation();
  const tenant = useParams();

  const { events, transaction } = useEvent();
  const { allUser, user } = useAuth();


  const tenantTransactions = transaction
    .filter((x) => (user.role === 'tenant' ? x : x.tenantId === tenant?.tenantId))
    .filter((x) => x.paymentStatus === 'completed')
    .map((items) => {
      return { items: items.events, userId: items._id };
    })
    .flat();

  const placeholderAvatar = 'https://res.cloudinary.com/dyhsose70/image/upload/v1696562163/avatar_ko5htr.png';

  const result = events
    .map((event) => {
      const users = [];

      tenantTransactions.forEach((transaction) => {
        transaction.items.forEach((item) => {
          if (item.id === event._id) {
            const user = allUser.find((u) => u._id === transaction.userId);
            users.push({ src: user ? user.profile : placeholderAvatar });

            // Add placeholders for extra quantity
            for (let i = 1; i < item.quantity; i++) {
              users.push({ src: placeholderAvatar });
            }
          }
        });
      });

      return { ...event, users };
    })
    .filter((x) => (user.role === 'tenant' ? x : x.createdBy === tenant?.tenantId));


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
        data={result}
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
