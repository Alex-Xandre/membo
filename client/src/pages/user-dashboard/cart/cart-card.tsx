import { EventTypes } from '@/helpers/types';
import React from 'react';
import { CartItem, useCartStore } from './cart-store';
import { Button } from '@/components/ui/button';
import { Minus, Plus } from 'lucide-react';

interface CartCardProps {
  eventDetails?: EventTypes;
  cartItems: CartItem;
}

const CartCard: React.FC<CartCardProps> = ({ eventDetails, cartItems }) => {
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeFromCart = useCartStore((state) => state.removeFromCart);
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
        <h2 className='text-sm mt-1'>$  {eventDetails.eventPrice}</h2>

        {/* Quantity Controls */}
        <div className='flex items-center bottom-0  gap-3 right-0 absolute mt-5'>
          <Button
            variant='outline'
            className='px-1.5 py-0'
            size='sm'
            onClick={() =>
              cartItems.quantity > 1
                ? updateQuantity(cartItems.id, cartItems.quantity - 1)
                : removeFromCart(cartItems.id)
            }
          >
            <Minus className='h-4 w-4' />
          </Button>
          <span className='text-sm'>{cartItems.quantity}</span>
          <Button
            variant='outline'
            size='sm'
            className='px-1.5 py-0'
            onClick={() => updateQuantity(cartItems.id, cartItems.quantity + 1)}
          >
            <Plus className='h-4 w-4' />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CartCard;
