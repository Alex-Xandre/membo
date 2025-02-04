import Breadcrumb from '@/components/bread-crumb';
import ReusableTable from '@/components/reusable-table';
import { Button } from '@/components/ui/button';
import NavContainer from '@/components/ui/nav-container';
import Title from '@/components/ui/title';
import { PlusIcon } from 'lucide-react';
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import NewTenantUser from './new';

const TenantUsers = () => {
  const navigate = useNavigate();

  const columns = [
    { header: 'ID', accessor: '_id' },
    { header: 'Title', accessor: 'title' },
    { header: 'Description', accessor: 'description' },
  ];

  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: 'Users', isCurrentPage: true },
  ];

  const params = useLocation();

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
        data={[]}
        columns={columns as any}
        onEdit={(item) => navigate(`/courses/new?=${item?._id}`, { state: { isEdit: true } })}
        onView={(item) => navigate(`/moduleId?=${item?._id}`, { state: { isEdit: true } })}
        title='Invoice'
        tableHeader={''}
      />
    </>
  );
};

export default TenantUsers;
