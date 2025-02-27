/* eslint-disable @typescript-eslint/no-unused-vars */
import Container from '@/components/container';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/stores/AuthContext';
import { Calendar1Icon, ExternalLink, FilterIcon, MapPin } from 'lucide-react';
import { useEvent } from '@/stores/EventContext';
import { useSidebar } from '@/components/ui/sidebar';
import { ScrollArea, Scrollbar } from '@radix-ui/react-scroll-area';
import { getEventTimeStatus } from '../dashboard-tenant/pages/events/format-date';
import { accountForm, addressForm, personalForm } from '../dashboard-tenant/pages/users/forms-data';
import { Checkbox } from '@/components/ui/checkbox';
import { useFilterStore } from './filter.store';

const Home = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { events } = useEvent();
  const { open } = useSidebar();

  const now = new Date();

  const closestEvent = events
    ?.filter((event) => {
      const eventDateTime = new Date(`${event.eventStartDate}T${event.eventStartTime}:00`);
      return eventDateTime.getTime() > now.getTime();
    })
    .sort((a, b) => {
      const dateA = new Date(`${a.eventStartDate}T${a.eventStartTime}:00`).getTime();
      const dateB = new Date(`${b.eventStartDate}T${b.eventStartTime}:00`).getTime();
      return dateA - dateB;
    })[0];

  const calculateFormCompleteness = (form, userData, nestedKey = null) => {
    const requiredFields = form.filter((field) => field.required);
    const totalRequired = requiredFields.length;

    if (totalRequired === 0) return 100;

    const filledFields = requiredFields.filter((field) => {
      const value = nestedKey ? userData?.[nestedKey]?.[field.name] : userData?.[field.name];
      return value !== undefined && value !== null && value !== '';
    }).length;

    return (filledFields / totalRequired) * 100;
  };

  // Calculate completeness per form
  const personalCompleteness = calculateFormCompleteness(personalForm, user.personalData);
  const accountCompleteness = calculateFormCompleteness(accountForm, user);
  const addressCompleteness = calculateFormCompleteness(addressForm, user?.personalData?.address);

  // Final completeness score (average of all forms)
  const totalCompleteness = (personalCompleteness + accountCompleteness + addressCompleteness) / 3;
  const {
    isPublic,
    isFeatured,
    free,
    above100,
    above1000,
    above10000,
    lessThan10,
    lessThan100,
    lessThan1000,
    updateFilter,
  } = useFilterStore();

  return (
    <Container>
      {/* Left panel */}
      <section
        className={` p-3 w-1/4 2xl:w-1/6 bg-[#f7f8fc] h-screen overflow-y-hidden pb-24 absolute -top-4 ${
          open ? '-left-8' : '-left-4'
        }`}
      >
        <h1 className='font-semibold'>Welcome {user?.accountId}</h1>

        <ScrollArea>
          <>
            <h2 className='mt-3 italic text-xs py-5 border-t w-full inline-flex items-center '>
              <span>Upcoming Event</span>
              <span className='cursor-pointer'>
                <ExternalLink className='h-3' />
              </span>
            </h2>
            {/* User address */}
            <h2 className='text-xs'>
              <div className='flex items-center gap-2 text-slate-600 font-semibold'>
                <div className='w-1/6 inline-flex gap-3 items-center'>
                  <MapPin className='h-3.5 text-gray-500' />
                </div>
                <span>
                  {closestEvent?.eventAddress?.fullAddress ? closestEvent.eventAddress?.fullAddress : 'No Address'}
                </span>
              </div>
            </h2>

            {/* Closest event */}
            <h2 className='text-xs mt-3'>
              <div className='flex items-center gap-2 text-slate-600 font-semibold'>
                <div className='w-1/6 inline-flex gap-3 items-center'>
                  <Calendar1Icon className=' h-3.5 text-gray-500' />
                </div>
                <span>
                  {closestEvent
                    ? `${closestEvent.eventName} - ${closestEvent.eventStartDate} at ${closestEvent.eventStartTime}`
                    : 'No upcoming events'}
                </span>
              </div>
            </h2>

            <h2 className='text-xs mt-3'>
              <div className='flex items-center gap-2 text-slate-600 font-semibold'>
                <div className='w-1/6 inline-flex gap-3 items-center'>
                  {/* <Calendar1Icon className=' h-3.5 text-gray-500' /> */}
                </div>
                <span>
                  {closestEvent
                    ? `${getEventTimeStatus(
                        closestEvent.eventStartDate,
                        closestEvent.eventStartTime,
                        closestEvent.eventEndDate,
                        closestEvent.eventEndTime
                      )}`
                    : 'No upcoming events'}
                </span>
              </div>
            </h2>
          </>

          <>
            <h2 className='mt-3 italic text-xs py-5 border-t w-full inline-flex items-center '>
              <span>Profile Completion</span>
              <span className='cursor-pointer'>
                <ExternalLink className='h-3' />
              </span>
            </h2>
            <div className='w-full bg-gray-200 rounded-full h-3 relative mb-3'>
              <div
                className='bg-black h-3 rounded-full transition-all'
                style={{ width: `${totalCompleteness}%` }}
              />
              <span className='absolute inset-0 flex items-center justify-center text-xs font-semibold text-white'>
                {totalCompleteness.toFixed(2)}%
              </span>
            </div>
          </>

          <>
            <h2 className='mt-3  text-sm font-semibold py-5 border-t w-full inline-flex items-center '>
              <span>Export Reports</span>
              <span className='cursor-pointer'>
                <ExternalLink className='h-3' />
              </span>
            </h2>
            <h3 className='text-xs text-gray-400'>Exporting report beta for now</h3>
          </>

          <>
            <h2 className='mt-3  text-sm font-semibold py-5 border-t w-full inline-flex items-center '>
              <span>Additional Filters</span>
              <span className='cursor-pointer'>
                <FilterIcon className='h-3' />
              </span>
            </h2>

            {/* Public & Featured */}
            <div className='space-y-2'>
              <div className='flex items-center gap-2'>
                <Checkbox
                  checked={isPublic}
                  onCheckedChange={() => updateFilter('isPublic')}
                />
                <label className='text-sm'>Public</label>
              </div>
              <div className='flex items-center gap-2'>
                <Checkbox
                  checked={isFeatured}
                  onCheckedChange={() => updateFilter('isFeatured')}
                />
                <label className='text-sm'>Featured</label>
              </div>
            </div>

            {/* Price Range */}
            <h3 className='mt-4 text-xs font-semibold'>Price Range</h3>
            <div className='space-y-2 mt-3'>
              {['free', 'above100', 'above1000', 'above10000'].map((key) => (
                <div
                  key={key}
                  className='flex items-center gap-2'
                >
                  <Checkbox
                    checked={eval(key)}
                    onCheckedChange={() => updateFilter(key)}
                  />
                  <label className='text-sm'>{key === 'free' ? 'Free' : `Price > ${key.replace('above', '')}`}</label>
                </div>
              ))}
            </div>

            {/* Attendees */}
            <h3 className='mt-4 text-xs font-semibold'>Attendees</h3>
            <div className='space-y-2 mt-3'>
              {['lessThan10', 'lessThan100', 'lessThan1000'].map((key) => (
                <div
                  key={key}
                  className='flex items-center gap-2'
                >
                  <Checkbox
                    checked={eval(key)}
                    onCheckedChange={() => updateFilter(key)}
                  />
                  <label className='text-sm'>{key.replace('lessThan', 'Less than ')}</label>
                </div>
              ))}
            </div>
          </>
        </ScrollArea>
      </section>

      <ScrollArea className=' flex-1 ml-60'>
        {' '}
        {user.role === 'admin' && <Button onClick={() => navigate('/tenant')}>add tenant user</Button>}
      </ScrollArea>
    </Container>
  );
};

export default Home;
