import React from 'react';
import { useDateStore } from './useDateStore';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { Calendar1Icon, CalendarIcon, ExternalLink, FilterIcon, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import SelectInput from '@/components/reusable-select';

const RIghtPanelHeader = () => {
  const { startDate, endDate, setStartDate, setEndDate, eventType, setEventType } = useDateStore();

  return (
    <div className='flex gap-4 items-end p-5'>
      {/* Start Date Picker */}
      <div className='flex flex-col'>
        <label className='text-xs font-medium mb-1'>Start Date</label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant='outline'
              className='w-[200px] pl-3 text-left font-normal'
            >
              {startDate ? format(startDate, 'PPP') : <span>Pick a date</span>}
              <CalendarIcon className='ml-auto h-4 w-4 opacity-50' />
            </Button>
          </PopoverTrigger>
          <PopoverContent
            className='w-auto p-0'
            align='start'
          >
            <Calendar
              mode='single'
              selected={startDate}
              onSelect={setStartDate}
              disabled={(date) => date > new Date() || date < new Date('1900-01-01')}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>

      {/* End Date Picker */}
      <div className='flex flex-col'>
        <label className='text-xs font-medium mb-1'>End Date</label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant='outline'
              className='w-[200px] pl-3 text-left font-normal'
            >
              {endDate ? format(endDate, 'PPP') : <span>Pick a date</span>}
              <CalendarIcon className='ml-auto h-4 w-4 opacity-50' />
            </Button>
          </PopoverTrigger>
          <PopoverContent
            className='w-auto p-0'
            align='start'
          >
            <Calendar
              mode='single'
              selected={endDate}
              onSelect={setEndDate}
              // disabled={(date) => date > new Date() || date < new Date('1900-01-01')}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>

      {/* <div className='flex flex-col'>
        <label className='text-xs font-medium mb-1'>Event Category</label>
        <SelectInput
          value={eventType}
          onValueChange={(val) => {
            setEventType(val);
          }}
          options={[
            'Dont Specify',
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
          placeholder={'Event Type'}
        />
      </div> */}

      <Button>
        Export 
      </Button>
    </div>
  );
};

export default RIghtPanelHeader;
