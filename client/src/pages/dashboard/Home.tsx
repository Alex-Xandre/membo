/* eslint-disable @typescript-eslint/no-unused-vars */
import Container from '@/components/container';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/stores/AuthContext';
import { useEvent } from '@/stores/EventContext';
import { useSidebar } from '@/components/ui/sidebar';
import { ScrollArea, Scrollbar } from '@radix-ui/react-scroll-area';
import LeftPanel from './LeftPanel';
import RIghtPanelHeader from './RIghtPanelHeader';
import { useFetchAndDispatch } from '@/helpers/useFetch';
import { getAllEvents, getAllTransaction } from '@/api/event.api';
import TicketChart from './charts/MainChart';
import { CalendarDemo } from './charts/LeftCalendar';
import { FilterIcon } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import EventsList from './Upcoming';
import { useDateStore } from './useDateStore';
const Home = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { events, transaction } = useEvent();
  const { open } = useSidebar();

  useFetchAndDispatch(getAllEvents, 'SET_EVENTS');
  useFetchAndDispatch(getAllTransaction, 'SET_TRANSACTIONS');

  const date = useDateStore((state) => state.date);

  return (
    <Container>
      <ScrollArea className=' flex-1 w-full '>
        {user.role === 'admin' && <Button onClick={() => navigate('/tenant')}>add tenant user</Button>}

        <div
          className={`bg-[#f7f8fc]  pb-6 rounded shadow    h-[calc(100vh-80px)] overflow-hidden ${
            open ? '-ml-4' : 'ml-2'
          }`}
        >
          <header className=' -mt-2 flex items-center justify-between pl-4 sticky top-0 bg-inherit z-50'>
            <div>
              <h1 className='font-semibold inline-flex items-center'>
                Monitoring Dashboard
                <Popover>
                  <PopoverTrigger asChild>
                    <span className='flex items-center cursor-pointer font-normal ml-3 text-sm underline'>
                      <FilterIcon className='h-4' />
                      View Actions
                    </span>
                  </PopoverTrigger>
                  <PopoverContent
                    className='w-full p-0 shadow-none border-none'
                    align='start'
                  >
                    <LeftPanel />
                  </PopoverContent>
                </Popover>
              </h1>
              <h2 className='text-xs mt-1'>Hi, Welcome back! Here's your summary of your events</h2>
            </div>

            <RIghtPanelHeader />
          </header>

          <div className='ml-3  w-full  flex pr-4  max-h-[calc(100vh-200px)] overflow-y-auto '>
            <div className={`${open ? 'w-[72.5%]' : 'w-3/4 '} 2xl:flex-1`}>
              <div className=' mt-3 bg-white  '>
                <div className='rounded shadow p-5'>
                  <TicketChart />
                </div>
              </div>

              <div className='inline-flex w-full gap-4 mt-4'>
                <div className='flex-1 bg-white shadow rounded p-3'>
                  <h1 className='text-sm font-semibold uppercase'>
                    Ticket Sales <span className='font-normal lowercase'>(this month)</span>
                  </h1>
                </div>
                <div className='flex-1 bg-white shadow rounded p-3'>
                  <h1 className='text-sm font-semibold uppercase'>
                    Sales Revenue <span className='font-normal lowercase'>(this month)</span>
                  </h1>
                </div>

                <div className='flex-1 bg-white shadow rounded p-3'>
                  <h1 className='text-sm font-semibold uppercase'>
                    New Members <span className='font-normal lowercase'>(this month)</span>
                  </h1>
                </div>
              </div>
            </div>

            <div className=' ml-4  pr-5 mt-3  flex-shrink-0  max-h-[calc(100vh-200px)] overflow-y-auto '>
              <div className='bg-white shadow-sm pb-3'>
                <CalendarDemo />
              </div>

              <div className='bg-white shadow-sm p-3 mt-3 max-w-[15.5rem] '>
                <h1 className='text-sm font-semibold uppercase'>
                  <span className='font-normal '>
                    {date.toLocaleDateString('en-US', {
                      month: 'long',
                      year: 'numeric',
                    })}
                    &nbsp; Events
                  </span>
                </h1>
                <EventsList
                  date={date}
                  events={events}
                  transactions={transaction}
                />
              </div>
            </div>
          </div>
        </div>
      </ScrollArea>
    </Container>
  );
};

export default Home;
