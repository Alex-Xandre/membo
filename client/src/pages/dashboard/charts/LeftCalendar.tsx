import { Calendar } from '@/components/ui/calendar';
import React from 'react';
import { useDateStore } from '../useDateStore';
import { useEvent } from '@/stores/EventContext';
import { EventCard } from '../Upcoming';

export function CalendarDemo() {
  const { date, setDate } = useDateStore();
  const { events } = useEvent();

  // Format selected date as YYYY-MM-DD without time shifting
  const getLocalDateStr = (date: Date) =>
    `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;

  const selectedDateStr = date ? getLocalDateStr(date) : '';

  // Filter events correctly based on the selected local date
  const filteredEvents = events.filter(event => event.eventStartDate === selectedDateStr);

  return (
    <div className='flex flex-col items-start space-y-2'>
      <Calendar mode='single' selected={date} onSelect={setDate} />
      <h1 className='text-sm px-3'>Event Calendar</h1>

      {date && (
        <div className='grid px-3 grid-cols-[auto,1fr] gap-x-2 items-center w-full text-left'>
          <p className='text-4xl font-bold'>{date.getDate()}</p>
          <div className='flex flex-col ml-3'>
            <p className='text-sm'>
              {date.toLocaleString('default', { month: 'long' })} {date.getFullYear()}
            </p>
            <p className='text-sm font-semibold'>{date.toLocaleString('default', { weekday: 'long' })}</p>
          </div>
        </div>
      )}

      {/* Display filtered events */}
      {filteredEvents.length > 0 ? (
        <div className='px-3'>
          <h2 className='text-lg font-semibold'>Events on {selectedDateStr}:</h2>
          <ul>
            {filteredEvents.map(event => (
             <EventCard event={event} users={undefined}/>
            ))}
          </ul>
        </div>
      ) : (
        <p className='px-3 text-sm text-gray-500'>No events on this date.</p>
      )}
    </div>
  );
}
