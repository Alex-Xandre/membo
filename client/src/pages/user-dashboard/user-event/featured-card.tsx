import { Button } from '@/components/ui/button';
import { EventTypes } from '@/helpers/types';
import React from 'react';

interface EventCardProps {
  event: EventTypes;
}

const EventCard: React.FC<EventCardProps> = ({ event }) => {
  return (
    <div className=' p-4 rounded-lg shadow-xs bg-white relative hover:-mt-3 hover:shadow-md transition-all duration-100 ease-in-out'>
      {event.eventIsFeatured && (
        <div className='absolute top-2 left-2 bg-yellow-500 text-white text-xs font-bold px-2 py-1 rounded'>
          Featured
        </div>
      )}
      <img
        src={event.eventBanner}
        alt={event.eventName}
        className='w-full h-40 object-cover rounded-md'
      />
      <h3 className='text-lg font-semibold mt-2'>{event.eventName}</h3>
      <p className='text-sm text-gray-600'>{event.eventDescription}</p>
      <p className='text-xs text-gray-500 mt-1'>{event.eventStartDate}</p>

      <footer className='inline-flex mt-3 gap-x-3'>
        <Button >Register</Button>
        <Button variant='secondary'>View</Button>
      </footer>
    </div>
  );
};

export default EventCard;
