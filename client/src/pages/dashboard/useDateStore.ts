import { create } from 'zustand';

interface DateStore {
  startDate: Date | null;
  endDate: Date | null;
  eventType: string;
  setStartDate: (date: Date | null) => void;
  setEndDate: (date: Date | null) => void;
  setEventType: (event: string) => void;
}

export const useDateStore = create<DateStore>((set) => ({
  startDate: null,
  endDate: null,
  eventType: 'Dont Specify',
  setEventType: (event) => set({ eventType: event }),
  setStartDate: (date) => set({ startDate: date }),
  setEndDate: (date) => set({ endDate: date }),
}));
