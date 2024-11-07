import { createSlice} from '@reduxjs/toolkit';

const initialState = {
  selectedChatId: undefined,
  colormode: 'dark',
};

const chatSlice = createSlice({
  name: 'chatSlice',
  initialState,
  reducers: {
    setSelectedChatId: (state, action) => {
      state.selectedChatId = action.payload;
    },
    setcolormode: (state, action) => {
      state.colormode = action.payload;
    },
  },
  selectors: {
    selectChatId: (state) => state.selectedChatId,
    selectColorMode: (state) => state.colormode
  },
});

export const { setSelectedChatId, setcolormode } = chatSlice.actions;
export const { selectChatId, selectColorMode } = chatSlice.selectors;
export const chatReducer = chatSlice.reducer;