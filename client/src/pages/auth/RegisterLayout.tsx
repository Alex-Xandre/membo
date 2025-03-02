/* eslint-disable @typescript-eslint/no-explicit-any */
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { EyeClosedIcon, EyeIcon, MapIcon, SettingsIcon, UserIcon } from 'lucide-react';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PersonalTypes, UserTypes } from '@/helpers/types';
import ActivationCodeLayout from './ActivateLayout';
import { registerUser } from '@/api/register.api';
import toast from 'react-hot-toast';
import useBaseNameStore from '@/stores/useThemeAndRoute';

const RegisterLayout: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [showPassword, setShowPassword] = useState(true);
  const navigate = useNavigate();

  const [data, setData] = useState<PersonalTypes>({
    firstName: '',
    lastName: '',
    middleName: '',
    birthday: '',
    birthplace: '',
    address: {
      streetAddress: '',
      city: '',
      state: '',
      zipcode: '',
      latitude: 0,
      longitude: 0,
    },
    profile: '',
    age: 0,
    sex: '',
    civilStatus: '',
    contact: '',
    citizenship: '',
  });

  const [accData, setAccData] = useState<UserTypes & { confirmPassword: '' }>({
    _id: '',
    email: '',
    password: '',
    userId: '',
    personalData: data,
    role: 'user',
    accountId: '',
    confirmPassword: '',
  });

  const baseName = useBaseNameStore((state:any) => state.basename);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const steps = [
    {
      title: 'Personal Information',
      icon: <UserIcon />,
      fields: [
        { label: 'First Name', name: 'firstName', type: 'text', required: true },
        { label: 'Last Name', name: 'lastName', type: 'text', required: true },
        { label: 'Middle Name', name: 'middleName', type: 'text' },
        { label: 'Birthday', name: 'birthday', type: 'date', required: true },
        { label: 'Birthplace', name: 'birthplace', type: 'text' },
        { label: 'Sex', name: 'sex', type: 'text', required: true },
        { label: 'Civil Status', name: 'civilStatus', type: 'text', required: true },
        { label: 'Contact', name: 'contact', type: 'text', required: true },
        { label: 'Citizenship', name: 'citizenship', type: 'text', required: true },
      ],
      state: data,
      setState: setData,
    },
    {
      title: 'Address Information',
      icon: <MapIcon />,
      fields: [
        { label: 'Street Address', name: 'streetAddress', type: 'text', required: true },
        { label: 'City', name: 'city', type: 'text', required: true },
        { label: 'State', name: 'state', type: 'text', required: true },
        { label: 'Zipcode', name: 'zipcode', type: 'text', required: true },
      ],
      state: data.address,
      setState: (address: any) => setData({ ...data, address }),
    },
    {
      title: 'Account Information',
      icon: <SettingsIcon />,
      fields: [
        { label: 'Email', name: 'email', type: 'email', required: true },
        { label: 'User ID', name: 'userId', type: 'text', required: true },
        { label: 'Password', name: 'password', type: 'password', required: true },
        { label: 'Confirm Password', name: 'confirmPassword', type: 'password', required: true },
      ],
      state: accData,
      setState: setAccData,
    },
  ];

  const validateRequiredFields = (stepIndex: number) => {
    const currentStepFields = steps[stepIndex].fields;
    const currentErrors: Record<string, string> = {};
    currentStepFields.forEach((field) => {
      if (field.required && !steps[stepIndex].state[field.name]) {
        currentErrors[field.name] = 'This field is required';
      }
    });
    return currentErrors;
  };

  const validatePassword = () => {
    const password = accData.password;
    const confirmPassword = accData.confirmPassword;

    let isValid = true;

    // Check if passwords match
    if (password !== confirmPassword) {
      setErrors((prev) => ({
        ...prev,
        confirmPassword: 'Passwords do not match',
      }));
      isValid = false;
    }

    const regex = /^(?=.*[A-Z])(?=.*\d).{8,}$/;
    if (!regex.test(password)) {
      setErrors((prev) => ({
        ...prev,
        password: 'Password must be at least 8 characters, include one uppercase letter and a number',
      }));
      isValid = false;
    }

    if (isValid) {
      setErrors((prev) => ({
        ...prev,
        password: '',
        confirmPassword: '',
      }));
    }

    return isValid;
  };

  const handleNext = () => {
    const requiredErrors = validateRequiredFields(currentStep);
    if (Object.keys(requiredErrors).length > 0) {
      setErrors(requiredErrors);
      return;
    }

    if (currentStep === 2 && !validatePassword()) return;

    if (currentStep < steps.length - 1) {
      setErrors({});
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) setCurrentStep(currentStep - 1);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, stepIndex: number) => {
    const { name, value } = e.target;
    const { state, setState } = steps[stepIndex];
    setState({ ...state, [name]: value });
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleShowPassword = () => setShowPassword(!showPassword);

  const handleSubmit = async () => {
    // Validate password
    const isPasswordValid = validatePassword();
    if (!isPasswordValid) return;

    const urlParams = new URLSearchParams(window.location.search);
    const tenant = urlParams.get('tenant');

    if (!tenant) {
      return toast.error('Something went wrong');
    }

    const res = await registerUser({
      ...accData,
      personalData: data,
      tenantUserId: {
        tenantId: baseName._id,
        tenantRole: 'user',
      },
    });

    if (res.success === false) return toast.error(res.data?.msg || 'Error');
    toast.success('Please Check your email fo activation');
    setCurrentStep(3);

    navigate(`/register?token=${res?.link}`);
  };

  return (
    <main className='w-full h-screen flex'>
      <section className='w-full px-6 bg-muted shadow-lg rounded-lg flex justify-center items-center relative flex-col'>
        {currentStep === 3 ? (
          <div className='w-1/2 p-5 shadow-md rounded-lg bg-white  '>
            <h1 className='text-xl font-semibold'>OTP Code</h1>
            <p className='text-xs mt-2 mb-5 items-center inline-flex gap-x-2'>
              Please check your email for activation code
            </p>

            <ActivationCodeLayout />
          </div>
        ) : (
          <div className='w-1/2 px-5 pb-5 shadow-md rounded-lg bg-white max-h-[80%] overflow-y-auto '>
            <div className='sticky top-0 bg-white z-20  pt-5'>
              <h1 className='text-xl font-semibold'>{steps[currentStep].title}</h1>
              <p className='text-xs mt-2 mb-5 items-center inline-flex gap-x-2'>
                <span>{steps[currentStep].icon}</span>
                Please fill in the required fields
              </p>
            </div>
            <div className='flex-wrap flex gap-2 content-start'>
              {steps[currentStep].fields.map((field) => (
                <div
                  className={`${currentStep === 0 && '!w-[49%]'} w-full`}
                  key={field.name}
                >
                  <div className=''>
                    <Label
                      htmlFor={field.name}
                      className='text-sm text-muted-foreground'
                    >
                      {field.label}
                    </Label>

                    <Input
                      id={field.name}
                      name={field.name}
                      type={field.type === 'password' && !showPassword ? 'text' : field.type}
                      placeholder={field.label}
                      value={(steps[currentStep].state as Record<string, any>)[field.name] || ''}
                      onChange={(e) => handleInputChange(e, currentStep)}
                      icon={
                        field.type === 'password' ? (
                          showPassword ? (
                            <EyeIcon onClick={handleShowPassword} />
                          ) : (
                            <EyeClosedIcon onClick={handleShowPassword} />
                          )
                        ) : null
                      }
                      className={`${errors[field.name] ? 'border-red-500' : ''}
                      
                      `}
                    />
                    {errors[field.name] && <p className='text-xs text-red-500 ml-1 mt-1'>{errors[field.name]}</p>}
                  </div>
                </div>
              ))}
            </div>
            <div className='flex justify-between mt-4'>
              {currentStep > 0 && (
                <Button
                  onClick={handlePrevious}
                  variant='secondary'
                >
                  Previous
                </Button>
              )}
              {currentStep < steps.length - 1 ? (
                <Button onClick={handleNext}>Next</Button>
              ) : (
                <Button
                  onClick={() => {
                    handleSubmit();
                  }}
                >
                  Submit
                </Button>
              )}
            </div>

            <div className='w-full absolute bottom-0 left-0'>
              <div className='w-full flex justify-between'>
                {steps.map((_, index) => (
                  <div
                    key={index}
                    className={`w-1/3 h-2 rounded-full transition-all duration-300 ${
                      currentStep > index ? 'bg-black' : 'bg-gray-300'
                    }`}
                  ></div>
                ))}
              </div>
            </div>
          </div>
        )}

        <div
          className='text-sm mt-1'
          onClick={() => navigate(-1)}
        >
          Already have an account?
          <span>
            <Button variant='link'> Sign in</Button>
          </span>
        </div>
      </section>
    </main>
  );
};

export default RegisterLayout;
