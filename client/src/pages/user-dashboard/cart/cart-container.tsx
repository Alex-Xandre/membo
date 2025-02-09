import React from 'react';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { useCartStore } from './cart-store';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useEvent } from '@/stores/EventContext';
import CartCard from './cart-card';
import { useNavigate } from 'react-router-dom';

const CartContainer = () => {
  const toggleCart = useCartStore((state) => state.toggleCart);
  const cart = useCartStore((state) => state.cart);
  const { events } = useEvent();
  const totalPrice = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const navigate = useNavigate();
  return (
    <Sheet
      open
      onOpenChange={(open) => !open && toggleCart()}
    >
      <SheetContent className='w-[400px] sm:w-[540px]'>
        <SheetHeader>
          <SheetTitle>Event Cart</SheetTitle>
          <SheetDescription>Double check before proceeding to checkout.</SheetDescription>
        </SheetHeader>

        <ScrollArea className='h-[80%]'>
          {cart.map((items) => {
            const findEventDetails = events.find((evt) => evt._id === items.id);
            return (
              <CartCard
                eventDetails={findEventDetails}
                cartItems={items}
              />
            );
          })}
        </ScrollArea>
        <div className='absolute bottom-0 py-5 px-0 left-5 flex flex-col w-[90%]'>
          <div className='w-full flex-shrink-0 inline-flex items-center justify-between'>
            <span className='font-semibold'>Total</span>
            <span>$ {totalPrice}</span>
          </div>

          <div className='w-full mt-5 justify-end flex'>
            <Button
              onClick={() => {
                navigate(`${window.location.pathname}/checkout=true`, { state: { items: JSON.stringify(cart) } });
                toggleCart()
              }}
            >
              Proceed to checkout
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default CartContainer;
