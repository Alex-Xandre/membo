/* eslint-disable @typescript-eslint/no-explicit-any */
export type TableProps<T> = {
  data: T[];
  columns: Column<T>[];
  onEdit: (item: T) => void;
  onRemove: (item: T) => void;
  onUpdateMax?: (item: T) => void;
  title?: string;
};

export type Column<T> = {
  header: string;
  accessor: keyof T;
  render?: (value: any, row: T) => React.ReactNode;
};

//address type
export interface AddressTypes {
  streetAddress: string;
  city: string;
  state: string;
  zipcode: string;
  latitude: number;
  longitude: number;
}

// personal
export interface PersonalTypes {
  firstName: string;
  lastName: string;
  middleName?: string;
  birthday?: string;
  birthplace?: string;
  address: AddressTypes;
  profile: string;
  age: number;
  sex: string;
  civilStatus: string;
  contact: string;
  citizenship?: string;
}
export interface UserTypes {
  password: string;
  role: 'admin' | 'user' | 'tenant';
  userId: string;
  _id: string;
  personalData: PersonalTypes;
  email: string;
  accountId: string;
  profile?: string;

  tenantUserId?: {
    tenantId?: string;
    tenantRole?: 'admin' | 'user' | 'tenant';
  };
}

export interface EventTypes {
  _id: string;
  eventName: string;
  eventDescription: string;
  eventStartDate: string;
  eventStartTime: string;
  eventEndDate: string;
  eventEndTime: string;
  eventBanner: string;
  eventType: string;
  eventAddress: {
    fullAddress: string;
    latitude: number;
    longitude: number;
  };
  createdBy: string;
  eventIsFeatured?: boolean;
}
