import { getEventTimeStatus } from '../dashboard-tenant/pages/events/format-date';
import { accountForm, addressForm, personalForm } from '../dashboard-tenant/pages/users/forms-data';
import { Checkbox } from '@/components/ui/checkbox';
import { useFilterStore } from './filter.store';
import { useEvent } from '@/stores/EventContext';
import { getAllEvents } from '@/api/event.api';
import { useFetchAndDispatch } from '@/helpers/useFetch';
import { ScrollArea } from '@radix-ui/react-scroll-area';
import { Calendar1Icon, ExternalLink, FilterIcon, MapPin } from 'lucide-react';
import { useAuth } from '@/stores/AuthContext';
import { useSidebar } from '@/components/ui/sidebar';

import { Chart as ChartJS, ArcElement, Tooltip } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip);
const LeftPanel = () => {
  const now = new Date();
  const { user } = useAuth();
  useFetchAndDispatch(getAllEvents, 'SET_EVENTS');
  const { events } = useEvent();
  const { open } = useSidebar();

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

  const placeholderAvatar = 'https://res.cloudinary.com/dyhsose70/image/upload/v1696562163/avatar_ko5htr.png';

  const data = {
    datasets: [
      {
        data: [totalCompleteness, 100 - totalCompleteness],
        backgroundColor: ['#3B82F6', '#BFDBFE'],
        borderWidth: 2,
        borderColor: '#ffffff',
        hoverOffset: 5,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '70%',
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: false,
      },
    },
  };

  return (
    <section className={` bg-white p-3  absolute  rounded-xl shadow left-0 `}>
      {/* <header className='items-center flex flex-col justify-between gap-3 sticky top-0 bg-white'>
        <img
          src={user?.profile === '' ? placeholderAvatar : user?.profile}
          className='rounded-full h-12'
        />
        <h1 className='font-semibold'>Welcome {user?.accountId}</h1>
      </header> */}
      <div className='flex gap-x-8 '>
        <div className='w-96'>
          <h2 className='mt-2  text-sm font-semibold pb-5 w-full inline-flex items-center justify-between '>
            <span>Closest Upcoming Event</span>
            <span className='cursor-pointer'>
              <ExternalLink className='h-3' />
            </span>
          </h2>
          {/* User address */}
          <h2 className='text-xs'>
            <div className='flex items-center gap-2 text-slate-600 font-semibold'>
              <div className='w-1/6 inline-flex gap-3 items-center'>
                <p className='px-1 py-2 rounded bg-blue-100'>
                  <MapPin className='h-3.5 text-blue-500' />
                </p>
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
                <p className='px-1 py-2 rounded bg-red-100'>
                  <Calendar1Icon className=' h-3.5 text-red-500' />
                </p>
              </div>
              <span>{closestEvent ? `${closestEvent.eventName} ` : 'No upcoming events'}</span>
            </div>
          </h2>

          <h2 className='text-xs mt-3'>
            <div className='flex items-center gap-2 text-slate-600 font-semibold'>
              <span>
                {closestEvent
                  ? `${closestEvent.eventStartDate} at ${closestEvent.eventStartTime}`
                  : 'No upcoming events'}{' '}
                &nbsp;
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

          <div className='items-center justify-center flex flex-col'>
            <h2 className='mt-2  text-sm font-semibold py-5 w-full inline-flex items-center justify-between '>
              <span>Profile Completion</span>
              <span className='cursor-pointer'>
                <ExternalLink className='h-3' />
              </span>
            </h2>
            <div className='relative h-32 w-32 inline-flex items-center justify-center'>
              <Doughnut
                data={data}
                options={options}
              />
              <span className='absolute text-xs font-semibold text-black'>{totalCompleteness.toFixed(2)}%</span>
            </div>
          </div>
        </div>
        <div className='w-80'>
          <>
            <h2 className='mt-2  text-sm font-semibold pb-5 w-full inline-flex items-center justify-between '>
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
                <label className='text-xs'>Public</label>
              </div>
              <div className='flex items-center gap-2'>
                <Checkbox
                  checked={isFeatured}
                  onCheckedChange={() => updateFilter('isFeatured')}
                />
                <label className='text-xs'>Featured</label>
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
                  <label className='text-xs'>{key === 'free' ? 'Free' : `Price > ${key.replace('above', '')}`}</label>
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
                  <label className='text-xs'>{key.replace('lessThan', 'Less than ')}</label>
                </div>
              ))}
            </div>
          </>
        </div>
      </div>
    </section>
  );
};

export default LeftPanel;
