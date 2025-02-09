import { EventTypes } from '@/helpers/types';
import React from 'react';
import { Button } from '@/components/ui/button';
import { Minus, Plus } from 'lucide-react';
import { CartItem } from '../cart/cart-store';

interface CartCardProps {
  eventDetails?: EventTypes;
  cartItems: CartItem;
}

const CheckOutCard: React.FC<CartCardProps> = ({ eventDetails, cartItems }) => {
  if (!eventDetails) return null;

  return (
    <div className='flex items-center gap-4 py-4 border-b'>
      <img
        src={eventDetails.eventBanner}
        alt={eventDetails.eventName}
        className='w-16 h-16 object-cover rounded-md'
      />
      <div className='flex-1 items-start relative'>
        <h3 className='text-sm font-semibold'>{eventDetails.eventName}</h3>
        <p className='text-xs text-gray-500'>{eventDetails.eventStartDate}</p>
        <h2 className='text-sm mt-1'>
       
          $ {eventDetails.eventPrice * cartItems.quantity}

          <span className='ml-2 text-xs'>for {cartItems.quantity} people</span>
        </h2>
      </div>
    </div>
  );
};

export default CheckOutCard;
