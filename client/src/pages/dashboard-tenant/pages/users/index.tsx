import Breadcrumb from '@/components/bread-crumb';
import ReusableTable from '@/components/reusable-table';
import { Button } from '@/components/ui/button';
import NavContainer from '@/components/ui/nav-container';
import Title from '@/components/ui/title';
import { PlusIcon } from 'lucide-react';
import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import NewTenantUser from './new';
import { useAuth } from '@/stores/AuthContext';
import { getAllUser } from '@/api/get.info.api';

const TenantUsers = () => {
  const navigate = useNavigate();

  const columns = [
    { header: 'User', accessor: 'user' },
    { header: 'Role', accessor: 'role' },
    { header: 'Status', accessor: 'socketId' },
  ];

  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: 'Users', isCurrentPage: true },
  ];

  const params = useLocation();

  const { allUser, user, dispatch } = useAuth();

  useEffect(() => {
    const token = sessionStorage.getItem('token');
    if (token) {
      const handlegetInfo = async () => {
        const fetchUsers = await getAllUser();

        dispatch({ type: 'GET_ALL_USER', payload: fetchUsers.filter((user) => user.role !== 'admin') });
      };
      handlegetInfo();
    }
  }, [dispatch]);

  console.log(allUser);
  if (params.search.includes('new')) {
    return <NewTenantUser />;
  }

  return (
    <>
      <Breadcrumb items={breadcrumbItems} />
      <NavContainer>
        <Title text='List of Users' />
        <Button onClick={() => navigate(`${window.location.pathname}?view=users&new=new`)}>
          <PlusIcon />
          User
        </Button>
      </NavContainer>
      <ReusableTable
        data={allUser
          .filter((item) =>
            user.role === 'tenant' ? item : item.tenantUserId?.tenantId === params.pathname.substring(1)
          )
          .map((x) => {
            return {
              ...x,
              user: x.personalData?.firstName + ' ' + x.personalData?.lastName,
              socketId: (x as any)?.socketId,
            };
          })}
        columns={columns as any}
        onEdit={(item) =>
          navigate(`${window.location.pathname}?view=users&new=${item?._id}`, { state: { isEdit: true } })
        }
        title='Invoice'
        tableHeader={''}
      />
    </>
  );
};

export default TenantUsers;
