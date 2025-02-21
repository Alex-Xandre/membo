import { EventTypes } from '@/helpers/types';

/* eslint-disable @typescript-eslint/no-explicit-any */
const EventReducer = (state: any, action: { type: string; payload?: any }): any => {
  switch (action.type) {
    case 'ADD_OR_UPDATE_EVENT': {
      const eventIndex = state.events.findIndex((event: EventTypes) => event._id === action.payload._id);

      if (eventIndex >= 0) {
        return {
          ...state,
          events: state.events.map((event: EventTypes, index: number) =>
            index === eventIndex ? { ...event, ...action.payload } : event
          ),
        };
      } else {
        return {
          ...state,
          events: [...state.events, action.payload],
        };
      }
    }

    case 'DELETE_EVENT':
      return {
        ...state,
        events: state.events.filter((event: EventTypes) => event._id !== action.payload),
      };

    case 'SET_EVENTS':
      return {
        ...state,
        events: action.payload,
      };

    case 'SET_TRANSACTIONS':
      return {
        ...state,
        transaction: action.payload,
      };

    default:
      return state;
  }
};

export default EventReducer;
