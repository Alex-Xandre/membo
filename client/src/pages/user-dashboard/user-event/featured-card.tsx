import { Button } from '@/components/ui/button';
import { EventTypes } from '@/helpers/types';
import { EyeIcon, PartyPopper, ShoppingCart, Trash } from 'lucide-react';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCartStore } from '../cart/cart-store';

interface EventCardProps {
  event: EventTypes;
}

const EventCard: React.FC<EventCardProps> = ({ event }) => {
  const navigate = useNavigate();

  const cart = useCartStore((state) => state.cart);
  const addToCart = useCartStore((state) => state.addToCart);
  const removeFromCart = useCartStore((state) => state.removeFromCart);

  // Check if the event is already in the cart
  const isInCart = cart.some((item) => item.id === event._id);

  return (
    <div className='p-4 rounded-lg shadow-xs bg-white relative hover:-mt-3 hover:shadow-md transition-all duration-100 ease-in-out'>
      {event.eventIsFeatured && (
        <div className='absolute top-2 left-2 bg-yellow-500 text-white text-xs font-bold px-2 py-1 rounded'>
          Featured
        </div>
      )}

      {event.eventPrice > 0 && (
        <div className='absolute top-2 right-2 bg-blue-500 text-white text-xs font-bold px-3 py-1 rounded'>
          ${event.eventPrice}
        </div>
      )}

      <img
        src={event.eventBanner}
        alt={event.eventName}
        className='w-full h-40 object-cover rounded-md'
      />
      <h3 className='text-lg font-semibold mt-2'>{event.eventName}</h3>
      <p className='text-sm text-gray-600'>{event.eventDescription}</p>
      <p className='text-xs text-gray-500 mt-1'>{event.eventStartDate}</p>

      <footer className='inline-flex mt-3 gap-x-3 flex-wrap gap-y-3'>
        <Button onClick={() => navigate(`?details=${event?._id}`)}>
          <PartyPopper className='h-4' />
          Register
        </Button>

        {isInCart ? (
          <Button
            variant='destructive'
            onClick={() => removeFromCart(event._id)}
          >
            <Trash className='h-4' />
            Remove from Cart
          </Button>
        ) : (
          <Button
            variant='outline'
            onClick={() => addToCart({ id: event._id, name: event.eventName, price: event.eventPrice })}
          >
            <ShoppingCart className='h-4' />
            Add to Cart
          </Button>
        )}
      </footer>
    </div>
  );
};

export default EventCard;
