import { getAllEvents, getAllTransaction } from '@/api/event.api';
import { getAllUser } from '@/api/get.info.api';
import Breadcrumb from '@/components/bread-crumb';
import ReusableTable from '@/components/reusable-table';
import { useFetchAndDispatch } from '@/helpers/useFetch';
import { useAuth } from '@/stores/AuthContext';
import { useEvent } from '@/stores/EventContext';
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import {
  AlertTriangleIcon,
  Building2Icon,
  CalendarIcon,
  NotebookIcon,
  PersonStandingIcon,
  SendIcon,
} from 'lucide-react';
import { TransactionTypes } from '@/helpers/types';
import { DialogClose } from '@radix-ui/react-dialog';
import { getEventTimeStatus } from './format-date';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import NavContainer from '@/components/ui/nav-container';
import AvatarStack from './avatar-stack';

const EventTransactions = () => {
  const location = useParams();
  const params = useLocation();
  const { events, transaction } = useEvent();
  const { allUser } = useAuth();

  const [activeTransaction, setTransaction] = useState<undefined | TransactionTypes>(undefined);

  const searchParams = new URLSearchParams(params.search);
  searchParams.delete('transaction');

  useFetchAndDispatch(getAllEvents, 'SET_EVENTS');
  useFetchAndDispatch(getAllTransaction, 'SET_TRANSACTIONS');
  useFetchAndDispatch(getAllUser, 'GET_ALL_USER');

  const breadcrumbItems = [
    { label: 'Home', href: location.tenantId ? `/${location.tenantId}` : '/' },
    {
      label: events.find((x) => x._id === searchParams.get('new'))?.eventName,
      href: location.tenantId
        ? `/${location.tenantId}?${searchParams.toString()}`
        : `/events?${searchParams.toString()}`,
    },
    { label: 'Transactions and Event Attendee List', isCurrentPage: true },
  ];

  useEffect(() => {
    if (searchParams.get('transaction')) {
      const findTransaction = transaction.find((x) => x._id === searchParams.get('transaction'));
      if (!findTransaction) return;

      setTransaction(findTransaction);
    }
  }, []);

  const columns = [
    { header: 'Name', accessor: 'name' },
    { header: '# of Tickets', accessor: 'tickets' },
    { header: 'Price per tickets', accessor: 'ticketsPrice' },
    { header: 'Payment Status', accessor: 'paymentStatus' },
    { header: 'Total Paid', accessor: 'total' },
  ];

  const navigate = useNavigate();

  useEffect(() => {
    if (activeTransaction) {
      document.getElementById('transaction-view')?.click();
    }
  }, [activeTransaction]);

  const event = events?.find((x) => x._id === searchParams.get('new')) ?? undefined;

  const { eventStartDate = '', eventStartTime = '', eventEndDate = '', eventEndTime = '', eventName = '' } = event;

  const tenantTransactions = transaction
    .filter((x) => x.paymentStatus === 'completed')
    .map((items) => {
      return { items: items.events, userId: items._id };
    })
    .flat();

  const placeholderAvatar = 'https://res.cloudinary.com/dyhsose70/image/upload/v1696562163/avatar_ko5htr.png';

  const result = events.map((event) => {
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
  });

  return (
    <section className='w-full'>
      <NavContainer>
        <header className='flex justify-between items-center w-full'>
          <Breadcrumb items={breadcrumbItems} />
        </header>
        <Button onClick={() => document.getElementById('transaction-view')?.click()}>Send Email</Button>
      </NavContainer>
      <Dialog>
        <DialogTrigger asChild>
          <Button
            variant='outline'
            className='hidden'
            id='transaction-view'
          ></Button>
        </DialogTrigger>

        <DialogContent
          className='w-1/2 h-2/3  flex flex-col content-start'
          onClick={() => {
            setTransaction(undefined);
          }}
        >
          <DialogHeader className='border-b pb-4'>
            <DialogTitle className='text-sm font-normal '>Transaction and Event Details </DialogTitle>
            {/* <DialogDescription>Anyone who has this link will be able to view this.</DialogDescription> */}
          </DialogHeader>

          <Input
            placeholder='Email Title'
            className='border-none shadow-none placeholder:font-semibold'
          />
          <Textarea
            placeholder='Short Summary'
            className='border-none shadow-none -mt-5 placeholder:font-semibold'
          />

          <section className='px-2 border-t pt-4 space-y-2 '>
            <div className='inline-flex w-full items-center text-sm'>
              <p className='w-1/4 inline-flex items-center gap-x-3'>
                <PersonStandingIcon className='h-4' /> User{' '}
              </p>
              <p>{activeTransaction?.name}</p>
              {!activeTransaction && (
                <AvatarStack avatars={result.find((x) => x._id === searchParams.get('new'))?.users ?? []} />
              )}
            </div>

            <div className='inline-flex w-full items-center text-sm'>
              <p className='w-1/4 inline-flex items-center gap-x-3'>
                <Building2Icon className='h-4' /> Email{' '}
              </p>
              <p>{activeTransaction?.email}</p>

              {!activeTransaction && <p>Batch Email</p>}
            </div>

            <div className='inline-flex w-full items-center text-sm'>
              <p className='w-1/4 inline-flex items-center gap-x-3'>
                <CalendarIcon className='h-4' /> Date And Time{' '}
              </p>
              <p>{getEventTimeStatus(eventStartDate, eventStartTime, eventEndDate, eventEndTime)}</p>
            </div>

            <div className='inline-flex w-full items-center text-sm'>
              <p className='w-1/4 inline-flex items-center gap-x-3'>
                <Building2Icon className='h-4' /> Event name{' '}
              </p>
              <p>{eventName}</p>
            </div>

            {activeTransaction && (
              <div className='inline-flex w-full items-center text-sm'>
                <p className='w-1/4 inline-flex items-center gap-x-3'>
                  <NotebookIcon className='h-4' /> Payment Status{' '}
                </p>
                <p>{activeTransaction?.paymentStatus}</p>
              </div>
            )}
          </section>
          <DialogFooter className='bottom-0 absolute border-t w-full left-0 p-3'>
            <Button className='inline-flex items-center'>
              <AlertTriangleIcon className='h-4 ' />
              Notify User
            </Button>

            <Button className='inline-flex items-center'>
              <SendIcon className='h-4 ' />
              Send Email
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ReusableTable
        data={transaction
          .filter((transaction) => transaction.events.some((event) => event.id === searchParams.get('new')))
          .map((items) => {
            const name = allUser.find((x) => x.userId);
            return {
              ...items,
              name: `${name?.personalData?.firstName} ${name?.personalData?.lastName}`,
              tickets: `${items.events?.find((x) => x.id === searchParams.get('new'))?.quantity}`,
              ticketsPrice: `${items.events?.find((x) => x.id === searchParams.get('new'))?.price}`,
              email: `${name.email}`,
            };
          })}
        columns={columns as any}
        onEdit={(item) => setTransaction(item)}
        title='Invoice'
        tableHeader={''}
      />
    </section>
  );
};

export default EventTransactions;
