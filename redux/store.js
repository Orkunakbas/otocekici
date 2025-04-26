import { configureStore } from '@reduxjs/toolkit';
import performanceReducer from './slices/performanceSlice';

export const store = configureStore({
  reducer: {
    performance: performanceReducer,
    // Diğer reducer'lar buraya eklenebilir
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export default store; 