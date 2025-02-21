import { registerTransaction } from '@/api/event.api';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCartStore } from '../cart/cart-store';
import toast from 'react-hot-toast';
import { Button } from '@/components/ui/button';

export const CheckOutForm = ({ clientSecret, parsedItems, user, totalPrice, tenantId, isCart }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const clearCart = useCartStore((state) => state.clearCart);

  const handlePayment = async (paymentStatus: 'completed' | 'failed', errorMessage?: string, result?: string) => {
    const res = await registerTransaction({
      userId: user._id,
      events: parsedItems,
      total: totalPrice,
      paymentStatus,
      paymentMethod: 'card',
      tenantId: tenantId.tenantId,
      transactionId: result,
    });

    if (res) {
      toast(paymentStatus === 'completed' ? 'Registration success' : 'Registration failed');
      if (paymentStatus === 'completed') navigate(-1);
    }

    if (errorMessage) toast.error(errorMessage);
    if (isCart === 'true') {
      clearCart();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setLoading(true);
    const result = await stripe.confirmCardPayment(clientSecret, {
      payment_method: { card: elements.getElement(CardElement)! },
    });

    setLoading(false);
    if (result.error) {
      handlePayment('failed', result.error.message);
    } else {
      handlePayment('completed', '', result.paymentIntent.id);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className='space-y-4'
    >
      <div className='border p-3 rounded-lg bg-gray-50'>
        <CardElement
          options={{ style: { base: { fontSize: '14px', color: '#333', '::placeholder': { color: '#aaa' } } } }}
        />
      </div>
      <Button
        type='submit'
        disabled={!stripe || loading}
        className='w-full'
      >
        {loading ? 'Processing...' : 'Pay Now'}
      </Button>
    </form>
  );
};
