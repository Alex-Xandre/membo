import Breadcrumb from '@/components/bread-crumb';
import { Label } from '@/components/ui/label';
import { UserTypes } from '@/helpers/types';
import React, { FormEvent, useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '@/stores/AuthContext';
import { Input } from '@/components/ui/input';
import { handleFileChange } from '@/helpers/file-upload';
import { accountForm, addressForm, personalForm } from './forms-data';
import FormContainer from './form-container';
import SelectInput from '@/components/reusable-select';
import { Button } from '@/components/ui/button';
import { registerUserByAdmin } from '@/api/register.api';
import toast from 'react-hot-toast';
import { getAllUser } from '@/api/get.info.api';
import { useFetchAndDispatch } from '@/helpers/useFetch';

const NewTenantUser = () => {
  const location = useParams();
  const { user, allUser } = useAuth();

  const inputRef = useRef(null);

  const breadcrumbItems = [
    { label: 'Home', href: location.tenantId ? `/${location.tenantId}` : '/' },
    { label: 'Users', href: location.tenantId ? `/${location.tenantId}?view=users` : '/tenant' },
    { label: 'new', isCurrentPage: true },
  ];

  const [userData, setUserData] = useState<UserTypes>({
    password: '',
    role: 'user',
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

  const item = useLocation();

  const params = useParams();
  const { state } = item;

  useFetchAndDispatch(getAllUser, 'GET_ALL_USER');

  useEffect(() => {
    if (state?.isEdit) {
      const searchParams = new URLSearchParams(item.search);
      const myParamValue = searchParams.get('new');

      if (!myParamValue) return;
      const items = allUser.find((x) => x._id === myParamValue) as UserTypes;
      if (!items) return;

      setUserData({ ...items, personalData: items.personalData });
    }
  }, [allUser, item.search, state?.isEdit]);

  console.log(item);

  useEffect(() => {
    if (params?.tenantId && item.search === '?view=profile') {
      const searchParams = params?.tenantId;

      if (!searchParams) return;
      const items = allUser.find((x) => x._id === searchParams) as UserTypes;
      if (!items) return;

      setUserData({ ...items, personalData: items.personalData });
    }
  }, [allUser, params]);

  useEffect(() => {
    if (item?.pathname === '/profile/update') {
      setUserData(user);
    }
  }, []);

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
    const { name, value, type } = e.target;
    const parsedValue = type === 'number' ? Number(value) || 0 : value;

    if (name in userData.personalData) {
      setUserData((prev) => ({
        ...prev,
        personalData: {
          ...prev.personalData,
          [name]: parsedValue,
        },
      }));
    } else if (name in userData.personalData.address) {
      setUserData((prev) => ({
        ...prev,
        personalData: {
          ...prev.personalData,
          address: {
            ...prev.personalData.address,
            [name]: parsedValue,
          },
        },
      }));
    } else {
      setUserData((prev) => ({
        ...prev,
        [name]: parsedValue,
      }));
    }
  };

  const navigate = useNavigate();

  const { dispatch } = useAuth();

  const handleSubmit = async () => {
    const res = await registerUserByAdmin({
      ...userData,
      password: new Date(userData.personalData.birthday as string).toISOString().split('T')[0],
      tenantUserId: {
        tenantId: user.role === 'tenant' ? user._id : location.tenantId,
        tenantRole: user.role === 'tenant' ? 'user' : 'tenant',
      },
    });

    if (res.success === false) return toast.error(res.data?.msg || 'Error');
    toast.success(res.msg);
    dispatch({ type: 'ADD_USER', payload: res });
    setTimeout(() => {
      navigate(-1);
    }, 1500);
  };

  return (
    <>
      <Breadcrumb items={breadcrumbItems} />

      <div className={`w-full pb-5 overflow-y-auto h-[calc(100vh-200px)]`}>
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

          {accountForm.map((items) => {
            if (user.role === 'tenant' && items.type === 'option'  || items.name === 'accountId') {
              return null;
            }
            return (
              <div
                key={items.name}
                className='lg:w-[49%]'
              >
                <Label> {items.label}</Label>

                {items.type === 'option' && user.role === 'admin' ? (
                  <SelectInput
                    value={userData.role}
                    onValueChange={(val) => {
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
            );
          })}
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
                  value={
                    items.type === 'file' ? undefined : (userData.personalData[items.name] as keyof UserTypes as string)
                  }
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
                value={
                  items.type === 'file'
                    ? undefined
                    : (userData.personalData.address[items.name] as keyof UserTypes as string)
                }
              />
            </div>
          ))}
        </FormContainer>
        <footer className='mt-4'>
          <Button onClick={handleSubmit}>Save</Button>
          <Button
            type='button'
            variant='destructive'
            className='ml-2'
            onClick={() => navigate(-1)}
          >
            Cancel
          </Button>
        </footer>
      </div>
    </>
  );
};

export default NewTenantUser;
