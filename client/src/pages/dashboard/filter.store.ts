import { create } from 'zustand';

interface FiltersState {
  isPublic: boolean;
  isFeatured: boolean;
  free: boolean;
  above100: boolean;
  above1000: boolean;
  above10000: boolean;
  lessThan10: boolean;
  lessThan100: boolean;
  lessThan1000: boolean;
  updateFilter: (key: any) => void;
}

export const useFilterStore = create<FiltersState>((set) => ({
  isPublic: false,
  isFeatured: false,
  free: false,
  above100: false,
  above1000: false,
  above10000: false,
  lessThan10: false,
  lessThan100: false,
  lessThan1000: false,
  updateFilter: (key) => set((state) => ({ [key]: !state[key] })),
}));
