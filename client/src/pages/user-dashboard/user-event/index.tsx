import { getAllEvents } from '@/api/event.api';
import Container from '@/components/container';
import { useFetchAndDispatch } from '@/helpers/useFetch';
import { useEvent } from '@/stores/EventContext';
import React from 'react';
import EventCard from './featured-card';
import EventListByMonth from './card';
import { Input } from '@/components/ui/input';

import { format } from 'date-fns';
import { CalendarIcon, SearchIcon } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import SelectInput from '@/components/reusable-select';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,} from '@/components/ui/sheet';
import { useCartStore } from '../cart/cart-store';

const EventHomeUser = () => {
  const { events } = useEvent();
  const [searchTerm, setSearchTerm] = React.useState('');
  const [selectedDate, setSelectedDate] = React.useState<Date | null>(null);
  const [selectedEventType, setSelectedEventType] = React.useState('All');

  useFetchAndDispatch(getAllEvents, 'SET_EVENTS');

  // Filter Events Based on State
  const filteredEvents = events.filter((event) => {
    const matchesSearch = searchTerm === '' ? event : event.eventName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedEventType === 'All' || event.eventType === selectedEventType;

    const eventDate = new Date(event.eventStartDate);
    const matchesMonth =
      !selectedDate ||
      (eventDate.getMonth() === selectedDate.getMonth() && eventDate.getFullYear() === selectedDate.getFullYear());

    return matchesSearch && matchesType && matchesMonth;
  });

  // Separate Featured and Non-Featured Events
  const featuredEvents = filteredEvents.filter((event) => event.eventIsFeatured);
  const nonFeaturedEvents = filteredEvents.filter((event) => !event.eventIsFeatured);

  const myParamValue = new URLSearchParams(useLocation().search).get('details');

  const navigate = useNavigate();

  const cart = useCartStore((state) => state.cart);

  return (
    <Container>
      <section className='w-full h-screen overflow-y-auto'>
        {myParamValue && (
          <Sheet
            open
            onOpenChange={(open) => !open && navigate(-1)}
          >
            <SheetContent className='w-[400px] sm:w-[540px]'>
              <SheetHeader>
                <SheetTitle>Edit profile</SheetTitle>
                <SheetDescription>Make changes to your profile here. Click save when you're done.</SheetDescription>
              </SheetHeader>
              <div className='grid gap-4 py-4'>
                <div className='grid grid-cols-4 items-center gap-4'>hi</div>
              </div>
              <SheetFooter>
                <SheetClose asChild>
                  <Button type='submit'>Save changes</Button>
                </SheetClose>
              </SheetFooter>
            </SheetContent>
          </Sheet>
        )}
        {featuredEvents.length > 0 && (
          <div className='mb-6'>
            <h2 className='text-xl font-semibold mb-3'>Featured Events</h2>
            <div className='inline-flex items-center justify-start w-full gap-4'>
              {featuredEvents.map((event) => (
                <EventCard
                  key={event._id}
                  event={event}
                />
              ))}
            </div>
          </div>
        )}

        {/* HEADER */}
        <header className='sticky top-0 z-50 flex items-center w-full bg-white py-2 gap-x-4 '>
          <Input
            className='ml-0.5 w-60'
            placeholder='Search events...'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant='outline'
                className={cn(
                  'w-[240px] flex items-center gap-2 justify-start text-left font-normal',
                  !selectedDate && 'text-muted-foreground'
                )}
              >
                <CalendarIcon className='h-5 w-5' />
                {selectedDate ? format(selectedDate, 'PPP') : <span>Select date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent
              className='w-auto p-0'
              align='start'
            >
              <Calendar
                mode='single'
                selected={selectedDate}
                onSelect={setSelectedDate}
                initialFocus
              />
              <div className=' px-3 gap-x-3  py-3 w-full inline-flex'>
                <Button
                  onClick={() => setSelectedDate(null)}
                  className=' flex-1'
                  variant='secondary'
                >
                  Clear
                </Button>
                <Button
                  onClick={() => setSelectedDate(new Date())}
                  className='flex-1'
                >
                  Today
                </Button>
              </div>
            </PopoverContent>
          </Popover>

          <div className='w-60'>
            <SelectInput
              value={selectedEventType}
              onValueChange={setSelectedEventType}
              options={[
                'All',
                'Conference',
                'Workshop',
                'Webinar',
                'Meetup',
                'Concert',
                'Festival',
                'Exhibition',
                'Sports Event',
                'Fundraiser',
                'Hackathon',
              ]}
              placeholder='Event Type'
            />
          </div>
        </header>

        <div className='flex-grow pb-24'>
          <EventListByMonth events={nonFeaturedEvents} />
        </div>
      </section>
    </Container>
  );
};

export default EventHomeUser;
