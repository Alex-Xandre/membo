import React from 'react';
import EventCard from './featured-card';
import { EventTypes } from '@/helpers/types';

interface EventListByMonthProps {
  events: EventTypes[];
}

const EventListByMonth: React.FC<EventListByMonthProps> = ({ events }) => {
  // Sort events by date
  const sortedEvents = [...events].sort(
    (a, b) => new Date(a.eventStartDate).getTime() - new Date(b.eventStartDate).getTime()
  );

  // Group by month
  const groupedEvents: Record<string, Event[]> = {};
  sortedEvents.forEach((event) => {
    const date = new Date(event.eventStartDate);
    const month = `${date.toLocaleString('default', { month: 'long' })} ${date.getFullYear()}`;
    if (!groupedEvents[month]) groupedEvents[month] = [];
    groupedEvents[month].push(event as any);
  });

  return (
    <div className='space-y-6  pt-2'>
      <h1 className=''>Upcoming Events</h1>
      {Object.entries(groupedEvents).reverse().map(([month, events]) => (
        <div
          key={month}
          className='flex flex-col space-y-4'
        >
          <h2 className=' font-bold'>{month}</h2>
          <div className='masonry sm:masonry-sm md:masonry-md xl:max-w-3/4'>
            {events.map((event: any) => (
              <div
                key={event.eventName}
                className='break-inside-avoid'
              >
                <EventCard event={event} />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default EventListByMonth;
