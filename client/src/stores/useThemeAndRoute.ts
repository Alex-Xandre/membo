import { create } from 'zustand';

const useBaseNameStore = create((set) => ({
  basename: null,



  setBaseName: (data) => set({ basename: data }),

  addActiveBaseName: (name) =>
    set((state) => ({
      activeBasenames: [...state.activeBasenames, name],
    })),

  removeActiveBaseName: (name) =>
    set((state) => ({
      activeBasenames: state.activeBasenames.filter((n) => n !== name),
    })),
}));

export default useBaseNameStore;
