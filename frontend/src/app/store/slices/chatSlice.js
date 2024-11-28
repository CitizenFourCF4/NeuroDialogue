import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { addMessageRoute, getChatRoute, getChatsRoute, upgradeChatRoute } from 'src/app/routes/apiRoutes';

export const getChatList = createAsyncThunk(
  'chatSlice/getChatList',
  async function(username, {rejectWithValue, dispatch}) {
      try {
          const response = await axios.get(getChatsRoute, { params:{'username': username} });
          dispatch(setChatList(response.data.user_chats))
      } catch (error) {
          return rejectWithValue(error.response.status);
      }
  }
);

export const getChatData = createAsyncThunk(
  'chatSlice/getChatData',
  async function(selectedChatId, {rejectWithValue, dispatch}) {
      try {
          const response = await axios.get(`${getChatRoute}${selectedChatId}/`)
          dispatch(setChatMode(response.data.chat_mode))
          dispatch(setMessages(response.data.messages))
      } catch (error) {
          return rejectWithValue(error.response.status);
      }
  }
);

export const createChat = createAsyncThunk(
  'chatSlice/createChat',
  async function({title, username, chatMode}, {rejectWithValue, dispatch}) {
    try {
      const data = {
        'chat_title': title, 
        'username': username,
        'chat_mode': chatMode
      }
        await axios.post(upgradeChatRoute, data);
        dispatch(getChatList(username))
    } catch (error) {
        return rejectWithValue(error.response.status);
    }
  }
)

export const deleteChat = createAsyncThunk(
  'chatSlice/deleteChat',
  async function({chat_id, username}, {rejectWithValue, dispatch}) {
    try {
        await axios.delete(upgradeChatRoute, { data: { 'chat_id': chat_id} });
        dispatch(getChatList(username))
        dispatch(setSelectedChatId(undefined))
    } catch (error) {
        return rejectWithValue(error.response.status);
    }
  }
)

export const sendTextMessage = createAsyncThunk(
  'chatSlice/sendTextMessage',
  async function(sendData, {rejectWithValue, dispatch, getState}) {
    try{
      const chat_id = getState().chatSlice.selectedChatId
      const data = {
        'chat_id': chat_id, 
        'message': sendData.message, 
        'username': sendData.username,
        'message_type': 'text' 
      }
      await axios.post(addMessageRoute, data)
      if (chat_id === getState().chatSlice.selectedChatId) dispatch(getChatData(chat_id))
    } catch(error){
      return rejectWithValue(error.response.status);
    }
  }
)

export const sendFileMessage = createAsyncThunk(
  'chatSlice/sendFileMessage',
  async function(sendData, {rejectWithValue, dispatch, getState}) {
    try{
      const chat_id = getState().chatSlice.selectedChatId
      const data = {
        'chat_id': chat_id, 
        'message': sendData.message, 
        'username': sendData.username,
        'message_type': 'file' 
      }
      await axios.post(addMessageRoute, data, { headers: { 'Content-Type': 'multipart/form-data' } })
      if (chat_id === getState().chatSlice.selectedChatId) dispatch(getChatData(chat_id))
    } catch(error){
      return rejectWithValue(error.response.status);
    }
  }
)

const initialState = {
  selectedChatId: undefined,
  colorMode: 'dark',
  messages: [], 
  chatList: [],
  chatMode: [] 
};

const chatSlice = createSlice({
  name: 'chatSlice',
  initialState,
  reducers: {
    setSelectedChatId: (state, action) => {
      state.selectedChatId = action.payload;
    },
    setColorMode: (state, action) => {
      state.colorMode = action.payload;
    },
    setMessages: (state, action) => {
      state.messages = action.payload
    },
    setChatMode: (state, action) => {
      state.chatMode = action.payload
    },
    setChatList: (state, action) => {
      state.chatList = action.payload
    },
    removeChat: (state, action) => {
      state.chatList = state.chatList.filter(chat => chat.chat_id !== action.payload);
    }
  },
  selectors: {
    selectChatId: (state) => state.selectedChatId,
    selectColorMode: (state) => state.colorMode,
    selectMessages: (state) => state.messages,
    selectChatList: (state) => state.chatList,
    selectChatMode: (state) => state.chatMode
  },
  extraReducers: (builder) => {
    builder
      .addCase(sendTextMessage.pending, (state, action) => {
        state.messages.push({
          'message': action.meta.arg.message, 
          'author': action.meta.arg.username
          })
        state.messages.push({
          'message': 'Ожидайте, Ваш запрос был передан модели', 
          'author': 'chatbot'
          })
      })
      .addCase(getChatData.rejected, (state, action) => {
        if (action.payload === 501) {
          alert("Данный тип чата не реализован")
        } 
        state.selectedChatId = undefined
      })
      .addCase(sendFileMessage.pending, (state, action) => {
        state.messages.push({
          'message': 'Ожидайте, Ваш запрос был передан модели', 
          'author': 'chatbot'
          })
      })
  }
});

export const { setSelectedChatId, setColorMode, setMessages, setChatList, setChatMode } = chatSlice.actions;
export const { selectChatId, selectColorMode, selectMessages, selectChatList, selectChatMode } = chatSlice.selectors;
export const chatReducer = chatSlice.reducer;