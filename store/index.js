import varlikListReducer from './slices/varlikSlice';

const store = configureStore({
  reducer: {
    varlikList: varlikListReducer,
  },
}); 