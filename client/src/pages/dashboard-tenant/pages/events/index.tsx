import Breadcrumb from '@/components/bread-crumb';
import ReusableTable from '@/components/reusable-table';
import { Button } from '@/components/ui/button';
import NavContainer from '@/components/ui/nav-container';
import Title from '@/components/ui/title';
import { PlusIcon } from 'lucide-react';
import React from 'react';
import { useNavigate } from 'react-router-dom';

const TenantEvent = () => {
  const columns = [
    { header: 'ID', accessor: '_id' },
    { header: 'Title', accessor: 'title' },
    { header: 'Description', accessor: 'description' },
  ];

  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: 'Users', isCurrentPage: true },
  ];

  const navigate = useNavigate();
  return (
    <>
      <Breadcrumb items={breadcrumbItems} />
      <NavContainer>
        <Title text='List of Events' />
        <Button onClick={() => navigate(`${window.location.pathname}?view=users&new=new`)}>
          <PlusIcon />
          Event
        </Button>
      </NavContainer>
      <ReusableTable
        data={[]}
        columns={columns}
        onEdit={(item) => navigate(`/courses/new?=${item?._id}`, { state: { isEdit: true } })}
        onView={(item) => navigate(`/moduleId?=${item?._id}`, { state: { isEdit: true } })}
        title='Invoice'
        tableHeader={''}
      />
    </>
  );
};

export default TenantEvent;
