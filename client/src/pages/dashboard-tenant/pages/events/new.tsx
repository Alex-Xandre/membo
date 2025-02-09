import Breadcrumb from '@/components/bread-crumb';
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import FormContainer from '../users/form-container';
import { eventForm } from './form-data';
import { Label } from '@/components/ui/label';
import { EventTypes } from '@/helpers/types';
import SelectInput from '@/components/reusable-select';
import { handleFileChange } from '@/helpers/file-upload';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { getAllEvents, registerEvents } from '@/api/event.api';
import toast from 'react-hot-toast';
import { useEvent } from '@/stores/EventContext';
import { useFetchAndDispatch } from '@/helpers/useFetch';
import { getRandomCover } from '@/helpers/generate-default-img';

const NewEvents = () => {
  const location = useParams();

  const breadcrumbItems = [
    { label: 'Home', href: location.tenantId ? `/${location.tenantId}` : '/' },
    { label: 'Events', href: location.tenantId ? `/${location.tenantId}?view=events` : '/events' },
    { label: 'new', isCurrentPage: true },
  ];

  const [eventData, setEventData] = useState<EventTypes>({
    _id: '',
    eventName: '',
    eventDescription: '',
    eventStartDate: '',
    eventStartTime: '',
    eventEndDate: '',
    eventEndTime: '',
    eventBanner: '',
    eventType: '',
    eventAddress: {
      fullAddress: '',
      latitude: 0,
      longitude: 0,
    },
    createdBy: '',
    eventPrice: null,
  });

  const navigate = useNavigate();
  const { dispatch, events } = useEvent();

  useFetchAndDispatch(getAllEvents, 'SET_EVENTS');

  const item = useLocation();
  const { state } = item;

  useEffect(() => {
    if (state?.isEdit) {
      const searchParams = new URLSearchParams(item.search);
      const myParamValue = searchParams.get('new');
      if (!myParamValue) return;
      const items = events.find((x) => x._id === myParamValue) as EventTypes;
      if (!items) return;

      setEventData(items);
    }
  }, [events, item.search, state?.isEdit]);

  const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedUrl = await handleFileChange(e);
    if (uploadedUrl) {
      setEventData((prev) => ({
        ...prev,
        ['profile']: uploadedUrl,
      }));
    }
  };

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    const sanitizedValue = value.replace(/^0+/, '') || ''; // Remove leading zeros

    setEventData((prev) => ({
      ...prev,
      [name]: sanitizedValue === '' ? null : Number(sanitizedValue),
    }));
  };

  const onFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    if (e.target.value === '0') {
      setEventData((prev) => ({
        ...prev,
        [e.target.name]: '',
      }));
    }
  };

  const handleSubmit = async () => {
    const res = await registerEvents({
      ...eventData,
      createdBy: location.tenantId,
      eventBanner: eventData.eventBanner === '' ? getRandomCover() : eventData.eventBanner,
    });

    if (res.success === false) return toast.error(res.data?.msg || 'Error');
    toast.success(res.msg);
    dispatch({ type: 'ADD_OR_UPDATE_EVENT', payload: res });
    setTimeout(() => {
      navigate(-1);
    }, 1500);
  };
  return (
    <>
      <Breadcrumb items={breadcrumbItems} />

      <div className='w-full'>
        <FormContainer title='Event Information'>
          {eventForm.map((items) => (
            <div
              key={items.name}
              className={`w-full ${(items.type === 'date' || items.type === 'time') && '!w-[49%]'}`}
            >
              <Label> {items.label}</Label>

              {items.type === 'option' ? (
                <SelectInput
                  value={eventData.eventType}
                  onValueChange={(val) => {
                    setEventData((prev) => ({
                      ...prev,
                      // eslint-disable-next-line @typescript-eslint/no-explicit-any
                      ['eventType']: val as any,
                    }));
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
              ) : items.type === 'textarea' ? (
                <Textarea
                  name={items.name}
                  onChange={onInputChange}
                  value={eventData.eventDescription}
                />
              ) : (
                <Input
                  type={items.type}
                  onFocus={onFocus}
             
                  name={items.name}
                  onChange={items.type === 'file' ? onFileChange : onInputChange}
                  value={items.type === 'file' ? undefined : (eventData[items.name] as keyof EventTypes as string)}
                />
              )}
            </div>
          ))}
        </FormContainer>

        <footer className='mt-4'>
          <Button onClick={handleSubmit}>Save</Button>
          <Button
            type='button'
            variant='destructive'
            className='ml-2'
            onClick={() => navigate(-1)}
          >
            Cancel
          </Button>
        </footer>
      </div>
    </>
  );
};

export default NewEvents;
