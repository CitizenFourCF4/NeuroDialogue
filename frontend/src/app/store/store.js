import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { chatReducer } from './slices/chatSlice';

export const rootReducer = combineReducers({
  chatSlice: chatReducer
});

const store = configureStore({
  reducer: rootReducer,
});

export default store;