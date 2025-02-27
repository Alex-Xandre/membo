import React from 'react';
import { User, Calendar, MapPin, Phone, Mail, Edit2 } from 'lucide-react';
import { useAuth } from '@/stores/AuthContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const ProfileView = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <div className='w-full mx-auto py-3 space-y-3'>
      {/* Profile Header */}
      <Card className='p-2 flex items-center gap-6 border border-gray-200 shadow-xs'>
        <img
          src={user.profile || 'https://placehold.co/150'}
          alt='Profile'
          className='w-12 h-12 rounded-full object-cover'
        />
        <div>
          <h1 className='font-semibold  text-sm'>
            {user.personalData?.firstName} {user.personalData?.lastName}
          </h1>
          <p className='text-gray-600'>
            {user.personalData.civilStatus} • {user.personalData.sex}
          </p>
          <p className='text-gray-600'>{user.age} years old</p>
        </div>
      </Card>

      {/* Personal Information */}
      <Card className='border border-gray-200 shadow-xs'>
        <CardContent className='p-3 space-y-4'>
          <h2 className='font-semibold  text-sm'>Personal Information</h2>
          <div className='space-y-2'>
            <div className='flex items-center gap-2 text-gray-700'>
              <div className='w-1/6 inline-flex gap-3 items-center'>
                <Calendar className='w-5 h-5 text-gray-500' /> Birthday
              </div>
              <span>{user.personalData.birthday || 'N/A'}</span>
            </div>
            <div className='flex items-center gap-2 text-gray-700'>
              <div className='w-1/6 inline-flex gap-3 items-center'>
                <MapPin className='w-5 h-5 text-gray-500' /> Birthplace
              </div>
              <span>{user.personalData.birthplace || 'N/A'}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Address Information */}
      <Card className='border border-gray-200 shadow-xs'>
        <CardContent className='p-3'>
          <h2 className='font-semibold  text-sm mb-2'>Address</h2>
          <div className='flex items-center gap-2 text-gray-700'>
            <div className='w-1/6 inline-flex gap-3 items-center'>
              <MapPin className='w-5 h-5 text-gray-500' /> Address
            </div>
            <span>
              {user.personalData.address?.streetAddress} {user.personalData.address?.city} {user.personalData.address?.state} {user.personalData.address?.zipcode}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Contact Information */}
      <Card className='border border-gray-200 shadow-xs'>
        <CardContent className='p-3 space-y-2'>
          <h2 className='font-semibold  text-sm'>Contact Information</h2>
          <div className='flex items-center gap-2 text-gray-700'>
            <div className='w-1/6 inline-flex gap-3 items-center'>
              <Phone className='w-5 h-5 text-gray-500' /> Phone
            </div>
            <span>{user.personalData.contact || 'N/A'}</span>
          </div>
          <div className='flex items-center gap-2 text-gray-700'>
            <div className='w-1/6 inline-flex gap-3 items-center'>
              <Mail className='w-5 h-5 text-gray-500' /> Email
            </div>
            <span>{user.email || 'N/A'}</span>
          </div>
        </CardContent>
      </Card>

      <div className='flex justify-end'>
        <Button
          className='flex items-center gap-2'
          onClick={() => navigate('/profile/update')}
        >
          <Edit2 className='w-4 h-4' />
          Edit Profile
        </Button>
      </div>
    </div>
  );
};

export default ProfileView;
