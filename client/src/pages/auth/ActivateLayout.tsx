import { activateUser } from '@/api/activate.api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const ActivationCodeLayout: React.FC = () => {
  const [code, setCode] = useState(['', '', '', '']);
  const [timeLeft, setTimeLeft] = useState(60); // Start with 60 seconds
  const inputsRef = React.useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (timeLeft === 0) return; // Stop when timer reaches 0
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => prevTime - 1);
    }, 1000);

    return () => clearInterval(timer); // Cleanup the timer when the component unmounts or timer is stopped
  }, [timeLeft]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const value = e.target.value;
    const newCode = [...code];
    newCode[index] = value.slice(0, 1);
    setCode(newCode);

    if (value && index < 3) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleBackspace = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handleResendCode = () => {
    setTimeLeft(60);
    setCode(['', '', '', '']);
  };

  const navigate = useNavigate();
  const handleSubmit = async () => {
    try {
      const searchParams = new URLSearchParams(location.search);
      const token = searchParams.get('token');
      console.log(code.length);

      const handleActivate = async () => {
        if (code.every((digit) => digit !== '')) {
          return toast.error('OTP cannot be empty');
        }
        const res = await activateUser({ activation_token: token, code: code.join('') });

        if (res === undefined || res.success === false)
          return toast.error(res?.data?.msg || 'Account already activated');
        if (res.success === false || res.msg === 'jwt malformed') {
          return toast.error(res.data?.msg || 'Error');
        }

        toast.success('Account Successfully Verified');
        navigate('/');
      };

      handleActivate();
    } catch (error) {
      toast.error(error.data?.msg || 'Error');
    }
  };

  return (
    <>
      <div className='flex space-x-2 justify-center items-center'>
        {code.map((digit, index) => (
          <React.Fragment key={index}>
            <Input
              type='text'
              value={digit}
              onChange={(e) => handleChange(e, index)}
              onKeyDown={(e) => handleBackspace(e, index)}
              maxLength={1}
              ref={(el) => (inputsRef.current[index] = el)}
              className='w-12 text-center'
            />
            {index < code.length - 1 && <span>-</span>}
          </React.Fragment>
        ))}
      </div>

      <Button onClick={handleSubmit}>Submit</Button>
      <p className='text-xs mb-5 items-center inline-flex gap-x-2 mt-5 ml-5'>
        {timeLeft > 0 ? (
          `Resend code in ${timeLeft} seconds`
        ) : (
          <Button
            className='ml-3 bg-secondary text-black'
            onClick={handleResendCode}
          >
            Resend Code
          </Button>
        )}
      </p>
    </>
  );
};

export default ActivationCodeLayout;
