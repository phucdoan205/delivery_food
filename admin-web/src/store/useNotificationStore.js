import { create } from 'zustand';

const useNotificationStore = create((set) => ({
  pendingRestaurants: 0,
  pendingDrivers: 0,
  setPendingRestaurants: (count) => set({ pendingRestaurants: count }),
  setPendingDrivers: (count) => set({ pendingDrivers: count }),
  incrementPendingRestaurants: () => set((state) => ({ pendingRestaurants: state.pendingRestaurants + 1 })),
  incrementPendingDrivers: () => set((state) => ({ pendingDrivers: state.pendingDrivers + 1 })),
  decrementPendingRestaurants: () => set((state) => ({ pendingRestaurants: Math.max(0, state.pendingRestaurants - 1) })),
  decrementPendingDrivers: () => set((state) => ({ pendingDrivers: Math.max(0, state.pendingDrivers - 1) })),
}));

export default useNotificationStore;
