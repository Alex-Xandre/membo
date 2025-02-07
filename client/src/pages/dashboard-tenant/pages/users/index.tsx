import Breadcrumb from '@/components/bread-crumb';
import ReusableTable from '@/components/reusable-table';
import { Button } from '@/components/ui/button';
import NavContainer from '@/components/ui/nav-container';
import Title from '@/components/ui/title';
import { PlusIcon } from 'lucide-react';
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import NewTenantUser from './new';
import { useAuth } from '@/stores/AuthContext';

const TenantUsers = () => {
  const navigate = useNavigate();

  const columns = [
    { header: 'ID', accessor: '_id' },
    { header: 'User', accessor: 'user' },
    { header: 'Role', accessor: 'role' },
  ];

  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: 'Users', isCurrentPage: true },
  ];

  const params = useLocation();

  const { allUser } = useAuth();

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
          .filter((item) => item.tenantUserId?.tenantId === params.pathname.substring(1))
          .map((x) => {
            return {
              ...x,
              user: x.personalData?.firstName + ' ' + x.personalData?.lastName,
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
