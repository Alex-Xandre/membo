import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { API_ENDPOINT } from '@/config/API';
import Container from '@/components/container';
import { Elements, useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import { useEvent } from '@/stores/EventContext';
import CheckOutCard from './chec-out-card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import toast from 'react-hot-toast';
import { useAuth } from '@/stores/AuthContext';
import { UserTypes } from '@/helpers/types';
import { registerTransaction } from '@/api/event.api';
import { useCartStore } from '../cart/cart-store';
import { CheckOutForm } from './check-out-form';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

const CheckOutHome = () => {
  const location = useLocation();
  const itemsState = location.state?.items;
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const { events } = useEvent();
  const { user }: { user: UserTypes } = useAuth();
  const tenantId = useParams();
  const navigate = useNavigate();
  const clearCart = useCartStore((state) => state.clearCart);

  const [personalData, setPersonalData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    contact: 0,
  });

  const searchParams = new URLSearchParams(location.search);
  const isCart = searchParams.get('cart');

  console.log(isCart);

  useEffect(() => {
    if (user) {
      setPersonalData({
        firstName: user.personalData.firstName,
        lastName: user.personalData.lastName,
        email: user.email,
        contact: Number(user.personalData.contact),
      });
    }
  }, []);

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPersonalData((prev) => ({
      ...prev,
      [name]: value.replace(/^0+/, '') || '',
    }));
  };

  if (!itemsState) {
    console.warn('No items found in location state');
    return null;
  }

  let parsedItems;
  try {
    parsedItems = JSON.parse(itemsState);
  } catch (error) {
    console.error('Error parsing items:', error);
    return null;
  }

  const totalPrice = parsedItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const handleCheckout = async () => {
    if (totalPrice === 0) {
      await registerTransaction({
        userId: user._id,
        events: parsedItems,
        total: totalPrice,
        paymentStatus: 'completed',
        paymentMethod: 'card',
        tenantId: tenantId.tenantId,
      });
      toast.success('Registration success');

      if (isCart === 'true') {
        clearCart();
      }

      navigate(-1);
      return;
    }

    const response = await fetch(`${API_ENDPOINT}/api/event/create-payment-intent`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount: totalPrice * 100, currency: 'usd' }),
    });

    const data = await response.json();
    if (data.clientSecret) {
      setClientSecret(data.clientSecret);
    }
  };

  return (
    <Container>
      <div className='w-full h-screen p-6'>
        <h1 className='text-xl font-bold mb-4'>Checkout</h1>
        <main className='flex gap-6 w-full flex-1'>
          <section className='w-2/3 space-y-4'>
            {parsedItems.map((items) => {
              const eventDetails = events.find((evt) => evt._id === items.id);
              return (
                <CheckOutCard
                  key={items.id}
                  eventDetails={eventDetails}
                  cartItems={items}
                />
              );
            })}
            {!clientSecret && totalPrice > 0 && (
              <Button
                onClick={handleCheckout}
                className='w-full'
              >
                Complete Registration
              </Button>
            )}
          </section>
          <section className='w-1/2 bg-white mt-5'>
            {(clientSecret || totalPrice === 0) && (
              <Card>
                <CardHeader>
                  <CardTitle className='text-base font-semibold'>Personal Information</CardTitle>
                </CardHeader>
                <CardContent className='space-y-3'>
                  <div className='grid grid-cols-2 gap-3'>
                    <Input
                      placeholder='First Name'
                      value={personalData.firstName}
                    />
                    <Input
                      placeholder='Last Name'
                      value={personalData.lastName}
                    />
                  </div>
                  <Input
                    placeholder='Email'
                    value={personalData.email}
                  />
                  <Input
                    placeholder='Phone Number'
                    value={personalData.contact}
                  />
                </CardContent>
                {clientSecret && totalPrice > 0 && (
                  <>
                    <CardHeader>
                      <CardTitle className='font-semibold'>Payment Details</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Elements
                        stripe={stripePromise}
                        options={{ clientSecret }}
                      >
                        <CheckOutForm
                          clientSecret={clientSecret}
                          parsedItems={parsedItems}
                          user={user}
                          totalPrice={totalPrice}
                          tenantId={tenantId}
                          isCart={isCart}
                        />
                      </Elements>
                    </CardContent>
                  </>
                )}
                <div className='w-full p-6 flex-shrink-0 inline-flex pt-5 items-center justify-between'>
                  <span className='font-semibold'>Total Price</span>
                  <span>$ {totalPrice}</span>
                </div>
                {totalPrice === 0 && (
                  <div className='px-5'>
                    <Button
                      className='mb-6 w-full'
                      onClick={handleCheckout}
                    >
                      Submit Registration
                    </Button>
                  </div>
                )}
              </Card>
            )}
          </section>
        </main>
      </div>
    </Container>
  );
};

export default CheckOutHome;
