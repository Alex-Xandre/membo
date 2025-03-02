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

const Home = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { events, transaction } = useEvent();
  const { open } = useSidebar();

  useFetchAndDispatch(getAllEvents, 'SET_EVENTS');
  useFetchAndDispatch(getAllTransaction, 'SET_TRANSACTIONS');

  console.log(transaction);

  return (
    <Container>
      {/* Left panel */}
      <LeftPanel />
      <ScrollArea className=' flex-1 ml-60 '>
        {user.role === 'admin' && <Button onClick={() => navigate('/tenant')}>add tenant user</Button>}

        <div
          className={`bg-[#f7f8fc] -mt-2 rounded shadow  h-[calc(100vh-65px)] overflow-hidden ${
            open ? 'ml-4' : 'ml-[4.5rem]'
          }`}
        >
          <header className=' -mt-2 flex items-center justify-between pl-4'>
            <div>
              <h1 className='font-semibold'>Monitoring Dashboard</h1>
              <h2 className='text-xs'>Hi, Welcome back! Here's your summary of your events</h2>
            </div>

            <RIghtPanelHeader />
          </header>

          <div className='ml-3  flex-grow  flex '>
            <div className='w-[82%]'>
              <div className=' mt-3 bg-white  '>
                <div className='rounded shadow p-5'>
                  <TicketChart />
                </div>
              </div>

              <div className='inline-flex w-full gap-4 mt-4'>
                <div className='flex-1 bg-white shadow rounded p-3'>
                  <h1 className='text-sm font-semibold uppercase'>Ticket Sales <span className='font-normal lowercase'>(this month)</span></h1>
                </div>
                <div className='flex-1 bg-white shadow rounded p-3'>
                  <h1 className='text-sm font-semibold uppercase'>Sales Revenue <span className='font-normal lowercase'>(this month)</span></h1>
                </div>

                <div className='flex-1 bg-white shadow rounded p-3'>
                  <h1 className='text-sm font-semibold uppercase'>New Members <span className='font-normal lowercase'>(this month)</span></h1>
                </div>
              </div>
            </div>

            <div className='w-[15.5rem] ml-3 mt-3'>
              <div className='bg-white shadow-sm pb-3'>
                <CalendarDemo />
              </div>

              <div className='bg-white shadow-sm p-3 mt-3 '>
              <h1 className='text-sm font-semibold uppercase'> <span className='font-normal lowercase'>Upcoming Events</span></h1>
              </div>
            </div>
          </div>
        </div>
      </ScrollArea>
    </Container>
  );
};

export default Home;
