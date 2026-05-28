import { create } from 'zustand';

const useNotificationStore = create((set) => ({
  pendingRestaurants: 0,
  pendingDrivers: 0,
  pendingOrders: 0,
  setPendingRestaurants: (count) => set({ pendingRestaurants: count }),
  setPendingDrivers: (count) => set({ pendingDrivers: count }),
  setPendingOrders: (count) => set({ pendingOrders: count }),
  incrementPendingRestaurants: () => set((state) => ({ pendingRestaurants: state.pendingRestaurants + 1 })),
  incrementPendingDrivers: () => set((state) => ({ pendingDrivers: state.pendingDrivers + 1 })),
  incrementPendingOrders: () => set((state) => ({ pendingOrders: state.pendingOrders + 1 })),
  decrementPendingRestaurants: () => set((state) => ({ pendingRestaurants: Math.max(0, state.pendingRestaurants - 1) })),
  decrementPendingDrivers: () => set((state) => ({ pendingDrivers: Math.max(0, state.pendingDrivers - 1) })),
  decrementPendingOrders: () => set((state) => ({ pendingOrders: Math.max(0, state.pendingOrders - 1) })),
}));

export default useNotificationStore;
