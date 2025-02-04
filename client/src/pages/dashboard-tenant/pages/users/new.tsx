import Breadcrumb from '@/components/bread-crumb';
import { Label } from '@/components/ui/label';
import { UserTypes } from '@/helpers/types';
import React, { useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '@/stores/AuthContext';
import { Input } from '@/components/ui/input';
import { handleFileChange } from '@/helpers/file-upload';
import { accountForm, addressForm, personalForm } from './forms-data';
import FormContainer from './form-container';
import SelectInput from '@/components/reusable-select';
import { Button } from '@/components/ui/button';

const NewTenantUser = () => {
  const location = useParams();
  const { user } = useAuth();

  const inputRef = useRef(null);

  const breadcrumbItems = [
    { label: 'Home', href: location.tenantId ? `/${location.tenantId}` : '/' },
    { label: 'Users', href: location.tenantId ? `/${location.tenantId}?view=users` : '/tenant' },
    { label: 'new', isCurrentPage: true },
  ];

  const [userData, setUserData] = useState<UserTypes>({
    password: '',
    role: 'tenant',
    userId: '',
    _id: '',
    email: '',
    accountId: '',
    profile: '',
    personalData: {
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
    },
  });

  const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedUrl = await handleFileChange(e);
    if (uploadedUrl) {
      setUserData((prev) => ({
        ...prev,
        ['profile']: uploadedUrl,
      }));
    }
  };

  const onInputChange = async (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    if (name in userData.personalData) {
      setUserData((prev) => ({
        ...prev,
        personalData: {
          ...prev.personalData,
          [name]: value,
        },
      }));
    } else if (name in userData.personalData.address) {
      setUserData((prev) => ({
        ...prev,
        personalData: {
          ...prev.personalData,
          address: {
            ...prev.personalData.address,
            [name]: value,
          },
        },
      }));
    } else {
      setUserData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  return (
    <>
      <Breadcrumb items={breadcrumbItems} />
      <form className='w-full pb-5'>
        <FormContainer title='Account Information'>
          <img
            src={userData.profile ? userData.profile : 'https://placehold.co/400'}
            className='h-16 w-16 rounded-full'
            onClick={() => {
              if (inputRef) {
                inputRef?.current.click();
              }
            }}
          />

          {accountForm.map((items) => (
            <div
              key={items.name}
              className='lg:w-[49%]'
            >
              <Label> {items.label}</Label>

              {items.type === 'option' ? (
                <SelectInput
                  value={userData.role}
                  onValueChange={(val) => {
                    console.log(val);
                    setUserData((prev) => ({
                      ...prev,
                      // eslint-disable-next-line @typescript-eslint/no-explicit-any
                      ['role']: val as any,
                    }));
                  }}
                  options={['tenant', 'user', ...(user.role === 'admin' ? ['admin'] : [])]}
                  placeholder={'Account Access'}
                />
              ) : (
                <Input
                  type={items.type}
                  ref={items.type === 'file' ? inputRef : null}
                  name={items.name}
                  className={`${items.type === 'file' && 'hidden'}`}
                  onChange={items.type === 'file' ? onFileChange : onInputChange}
                  value={items.type === 'file' ? undefined : (userData[items.name] as keyof UserTypes as string)}
                />
              )}
            </div>
          ))}
        </FormContainer>

        <FormContainer title='Personal Information'>
          {personalForm.map((items) => (
            <div
              key={items.name}
              className='lg:w-[49%]'
            >
              <Label> {items.label}</Label>

              {items.type === 'option' ? (
                <SelectInput
                  value={userData.personalData.sex}
                  onValueChange={(val) => {
                    setUserData((prev) => ({
                      ...prev,
                      personalData: {
                        ...prev.personalData,
                        ['sex']: val,
                      },
                    }));
                  }}
                  options={['Male', 'Female', 'Unknown']}
                  placeholder={'Gender'}
                />
              ) : (
                <Input
                  type={items.type}
                  ref={items.type === 'file' ? inputRef : null}
                  name={items.name}
                  className={`${items.type === 'file' && 'hidden'}`}
                  onChange={onInputChange}
                  value={items.type === 'file' ? undefined : (userData[items.name] as keyof UserTypes as string)}
                />
              )}
            </div>
          ))}
        </FormContainer>

        <FormContainer title='Address Information'>
          {addressForm.map((items) => (
            <div
              key={items.name}
              className='lg:w-[49%]'
            >
              <Label> {items.label}</Label>

              <Input
                type={items.type}
                ref={items.type === 'file' ? inputRef : null}
                name={items.name}
                className={`${items.type === 'file' && 'hidden'}`}
                onChange={onInputChange}
                value={items.type === 'file' ? undefined : (userData[items.name] as keyof UserTypes as string)}
              />
            </div>
          ))}
        </FormContainer>
        <footer className='mt-4'>
          <Button type='submit'>Save</Button>
          <Button
            type='button'
            variant='destructive'
            className='ml-4'
          >
            Cancel
          </Button>
        </footer>
      </form>
    </>
  );
};

export default NewTenantUser;
