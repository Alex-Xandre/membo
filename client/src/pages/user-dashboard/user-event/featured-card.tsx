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
  const toggleCart = useCartStore((state) => state.toggleCart);
  const addToCart = useCartStore((state) => state.addToCart);
  const removeFromCart = useCartStore((state) => state.removeFromCart);

  // Check if the event is already in the cart
  const isInCart = cart.some((item) => item.id === event._id);

  const { _id, eventName, eventPrice, eventBanner, eventStartDate, eventDescription } = event;

  return (
    <div className='p-4 rounded-lg shadow-xs bg-white relative hover:-mt-3 hover:shadow-md transition-all duration-100 ease-in-out'>
      {event.eventIsFeatured && (
        <div className='absolute top-2 left-2 bg-yellow-500 text-white text-xs font-bold px-2 py-1 rounded'>
          Featured
        </div>
      )}

      {eventPrice > 0 && (
        <div className='absolute top-2 right-2 bg-blue-500 text-white text-xs font-bold px-3 py-1 rounded'>
          ${eventPrice}
        </div>
      )}

      <img
        src={eventBanner}
        alt={eventName}
        className='w-full h-40 object-cover rounded-md'
      />
      <h3 className='text-lg font-semibold mt-2'>{eventName}</h3>
      <p className='text-sm text-gray-600'>{eventDescription}</p>
      <p className='text-xs text-gray-500 mt-1'>{eventStartDate}</p>

      <footer className='inline-flex mt-3 gap-x-3 flex-wrap gap-y-3'>
        <Button
          onClick={() => {
            const confirmed = window.confirm(
              'Registration is for single users only, for multiple users we recoment adding to cart first?'
            );
            if (!confirmed) {
              addToCart({ id: _id, name: eventName, price: eventPrice });
              toggleCart();
              return;
            }

            navigate(`${window.location.pathname}/checkout?cart=true`, {
              state: {
                items: JSON.stringify([
                  {
                    id: _id,
                    name: eventName,
                    price: eventPrice,
                    quantity: 1,
                  },
                ]),
              },
            });
          }}
        >
          <PartyPopper className='h-4' />
          Register
        </Button>

        {isInCart ? (
          <Button
            variant='destructive'
            onClick={() => removeFromCart(_id)}
          >
            <Trash className='h-4' />
            Remove from Cart
          </Button>
        ) : (
          <Button
            variant='outline'
            onClick={() => addToCart({ id: _id, name: eventName, price: eventPrice })}
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
