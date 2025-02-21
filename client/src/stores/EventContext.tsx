/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { createContext, useReducer, ReactNode, useContext } from 'react';
import EventReducer from './EventReducer';
import { EventTypes, TransactionTypes } from '@/helpers/types';

interface EventState {
  events: EventTypes[];
  transaction: TransactionTypes[];
}

interface EventContextType extends EventState {
  dispatch: React.Dispatch<any>;
}

const INITIAL_STATE: EventState = {
  events: [],
  transaction: [],
};

export const EventContext = createContext<EventContextType | undefined>(undefined);

export const EventContextProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(EventReducer, INITIAL_STATE);

  return (
    <EventContext.Provider value={{ events: state.events, dispatch, transaction: state.transaction }}>
      {children}
    </EventContext.Provider>
  );
};

export const useEvent = () => {
  const context = useContext(EventContext);

  if (!context) {
    throw new Error('useEvent must be used within an EventContextProvider');
  }

  return context;
};
