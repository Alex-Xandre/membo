import { Request } from 'express';
import { ObjectId } from 'mongoose';

export interface CustomRequest extends Request {
  user?: {
    _id: string;
    name: string;
    role: string;
    tenantId?: string;
  };
}

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
}

//user types
export interface UserTypes {
  password: string;
  role: 'admin' | 'user' | 'tenant';
  userId: string;
  personalData: PersonalTypes;
  email: string;
  accountId: string;
  profile: string;
  status?: boolean;
  tenantUserId: {
    tenantId: string;
    tenantRole: 'admin' | 'user' | 'tenant';
  };
}

//events

export interface EventTypes {
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
  createdBy: ObjectId;
  eventIsFeatured: boolean;
  eventPrice: number;
  maxAttendees: number;
}

export interface TransactionEvent {
  id: ObjectId;
  name: string;
  price: number;
  quantity: number;
}

export interface TransactionTypes {
  _id?: ObjectId;
  userId: ObjectId;
  events: TransactionEvent[];
  total: number;
  paymentStatus: 'pending' | 'completed' | 'failed';
  paymentMethod: 'card' | 'paypal' | 'bank_transfer';
  transactionId?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
