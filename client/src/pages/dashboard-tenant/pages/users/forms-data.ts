export const personalForm = [
  {
    name: 'firstName',
    label: 'First Name',
    type: 'text',
    required: true,
  },
  {
    name: 'lastName',
    label: 'Last Name',
    type: 'text',  required: true,
  },
  {
    name: 'middleName',
    label: 'Middle Name',
    type: 'text',  
  },
  {
    name: 'birthday',
    label: 'Birthday',
    type: 'date',  required: true,
  },
  {
    name: 'birthplace',
    label: 'Birthplace',
    type: 'text',  required: true,
  },
  {
    name: 'age',
    label: 'Age',
    type: 'number',  required: true,
  },
  {
    name: 'sex',
    label: 'Sex',
    type: 'option',  required: true,
  },
  {
    name: 'civilStatus',
    label: 'Civil Status',
    type: 'string',  required: true,
  },
  {
    name: 'contact',
    label: 'Contact Number',
    type: 'number',  required: true,
  },
  {
    name: 'citizenship',
    label: 'Citizenship',
    type: 'text',  required: true,
  },
];

export const accountForm = [
  {
    name: 'profile',
    label: '',
    type: 'file',
  },
  {
    name: 'userId',
    label: 'User ID',
    type: 'text',  required: true,
  },
  {
    name: 'email',
    label: 'Email',
    type: 'email',  required: true,
  },

  {
    name: 'accountId',
    label: 'Tenant ID',
    type: 'text',  required: true,
  },

  // {
  //   name: 'password',
  //   label: 'Password',
  //   type: 'password',  required: true,
  // },

  {
    name: 'role',
    label: 'Account Access',
    type: 'option',  required: true,
  },
];

export const addressForm = [
  {
    name: 'streetAddress',
    label: 'Street Address',
    type: 'text',  required: true,
  },
  {
    name: 'city',
    label: 'City',
    type: 'text',  required: true,
  },
  {
    name: 'state',
    label: 'State',
    type: 'text',  required: true,
  },
  {
    name: 'zipcode',
    label: 'Zip Code',
    type: 'text',  required: true,
  },
];
