import { EventTypes } from '@/helpers/types';
import { useAuth } from '@/stores/AuthContext';
import { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import AvatarStack from '../dashboard-tenant/pages/events/avatar-stack';

const getRandomColor = () => {
  const colors = ['#FF5733', '#33FF57', '#3357FF', '#F4A261', '#E76F51'];
  return colors[Math.floor(Math.random() * colors.length)];
};

const formatDate = (isoDate) => {
  const date = new Date(isoDate);
  return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
};

export const EventCard = ({ event, users }) => {
  const confirmedAttendees = event.confirmedAttendees || 0;
  const isSoldOut = confirmedAttendees >= event.maxAttendees;
  const isSellingOut = confirmedAttendees >= event.maxAttendees * 0.8;
  const isFree = event?.eventPrice === 0;

  return (
    <div className='border-b py-3 space-y-1'>
      <div className='flex items-center text-xs gap-x-3'>
        <div
          className='w-2 h-2 rounded-full'
          style={{ backgroundColor: getRandomColor() }}
        ></div>
        {formatDate(event.eventStartDate)}
      </div>
      <div className='flex-1'>
        <div className=' text-sm font-semibold'>{event.eventName}</div>
      </div>

      <h2 className='text-xs'>
        {event?.eventStartTime} - {event?.eventEndTime}
      </h2>

      <h2 className='text-xs'>{event?.eventAddress?.fullAddress}</h2>
      <div
        className={`text-sm uppercase ${
          isSoldOut ? 'tex-red-500' : isSellingOut ? 'text-yellow-500' : 'text-green-500'
        }`}
      >
        {isFree ? 'Free Registration' : isSoldOut ? 'Sold Out' : 'Few Left'}
        <span className='text-black lowercase'>
          {' '}
          {!isFree && `(${event.maxAttendees - confirmedAttendees}  tickets left )`}
        </span>
      </div>
      {users && <AvatarStack avatars={users.find((x) => x._id === event._id).users ?? []} />}
    </div>
  );
};

const EventsList = ({ date, events, transactions }) => {
  const selectedMonth = date.toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });

  const { user, allUser } = useAuth();
  const placeholderAvatar = 'https://res.cloudinary.com/dyhsose70/image/upload/v1696562163/avatar_ko5htr.png';
  const tenant = useParams();

  const tenantTransactions = transactions
    .filter((x) => (user.role === 'tenant' ? x : x.tenantId === tenant?.tenantId))
    .filter((x) => x.paymentStatus === 'completed')
    .map((items) => {
      return { items: items.events, userId: items._id };
    })
    .flat();


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

  const enrichedEvents = useMemo(() => {
    const attendeeCounts = transactions
      .filter((txn) => txn.paymentStatus === 'completed')
      .flatMap((txn) => txn.events.map((e) => ({ eventId: e.id, quantity: e.quantity })))
      .reduce((acc, { eventId, quantity }) => {
        acc[eventId] = (acc[eventId] || 0) + quantity;
        return acc;
      }, {});


    return events
      .filter((event: EventTypes) => {
        const eventDate = new Date(event.eventStartDate);
        const eventMonthYear = eventDate.toLocaleDateString('en-US', {
          month: 'long',
          year: 'numeric',
        });
        return eventMonthYear === selectedMonth;
      })
      .map((event) => ({
        ...event,
        confirmedAttendees: attendeeCounts[event._id] || 0,
      }));
  }, [date, events, transactions]);


  return (
    <div className='space-y-4'>
      {enrichedEvents.length ? (
        enrichedEvents.map((event) => (
          <EventCard
            key={event.id}
            event={event}
            users={result}
          />
        ))
      ) : (
        <div className='text-gray-500 text-center'>No events this month.</div>
      )}
    </div>
  );
};

export default EventsList;
