import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { addMessageRoute, getChatRoute, getChatsRoute, upgradeChatRoute } from 'src/app/routes/apiRoutes';

export const getChatList = createAsyncThunk(
  'chatSlice/getChatList',
  async function (username, { rejectWithValue, dispatch }) {
    try {
      const response = await axios.get(getChatsRoute, { params: { 'username': username } });
      dispatch(setChatList(response.data.user_chats))
    } catch (error) {
      return rejectWithValue(error.response.status);
    }
  }
);

export const getChatData = createAsyncThunk(
  'chatSlice/getChatData',
  async function (selectedChatId, { rejectWithValue, dispatch }) {
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
  async function ({ title, username, chatMode }, { rejectWithValue }) {
    try {
      const data = {
        'chat_title': title,
        'username': username,
        'chat_mode': chatMode
      }
      const response = await axios.post(upgradeChatRoute, data);
      return response.data
    } catch (error) {
      return rejectWithValue(error.response.status);
    }
  }
)

export const renameChat = createAsyncThunk(
  'chatSlice/renameChat',
  async function ({ chat_id, new_title, username }, { rejectWithValue, dispatch }) {
    try {
      const data = { 'new_title': new_title, 'chat_id': chat_id }
      await axios.put(upgradeChatRoute, data);
      dispatch(getChatList(username))
    } catch (error) {
      return rejectWithValue(error.response.status);
    }
  }
)

export const deleteChat = createAsyncThunk(
  'chatSlice/deleteChat',
  async function ({ chat_id }, { rejectWithValue }) {
    try {
      await axios.delete(upgradeChatRoute, { data: { 'chat_id': chat_id } });
      return chat_id
    } catch (error) {
      return rejectWithValue(error.response.status);
    }
  }
)

export const sendTextMessage = createAsyncThunk(
  'chatSlice/sendTextMessage',
  async function (sendData, { rejectWithValue, getState }) {
    try {
      const chat_id = getState().chatSlice.selectedChatId
      const data = {
        'chat_id': chat_id,
        'message': sendData.message,
        'username': sendData.username,
        'message_type': 'text'
      }
      const response = await axios.post(addMessageRoute, data)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response.status);
    }
  }
)

export const sendFileMessage = createAsyncThunk(
  'chatSlice/sendFileMessage',
  async function (sendData, { rejectWithValue, getState }) {
    try {
      const chat_id = getState().chatSlice.selectedChatId
      const data = {
        'chat_id': chat_id,
        'message': sendData.message,
        'username': sendData.username,
        'message_type': 'file'
      }
      const response = await axios.post(addMessageRoute, data, { headers: { 'Content-Type': 'multipart/form-data' } })
      return response.data
    } catch (error) {
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
      .addCase(sendTextMessage.fulfilled, (state, action) => {
        if (state.selectedChatId == action.payload.chat_id) {
          state.messages.pop()
          state.messages.push(action.payload)
        }
      })
      .addCase(sendFileMessage.pending, (state) => {
        state.messages.push({
          'message': 'Ожидайте, Ваш запрос был передан модели',
          'author': 'chatbot'
        })
      })
      .addCase(sendFileMessage.fulfilled, (state, action) => {
        if (state.selectedChatId == action.payload.bot_message.chat_id) {
          state.messages.pop()
          state.messages.push(action.payload.user_message)
          state.messages.push(action.payload.bot_message)
        }
      })
      .addCase(getChatData.rejected, (state, action) => {
        if (action.payload === 501) {
          alert("Данный тип чата не реализован")
        }
        state.selectedChatId = undefined
      })
      .addCase(createChat.fulfilled, (state, action) => {
        state.chatList.unshift(action.payload)
      })
      .addCase(deleteChat.fulfilled, (state, action) => {
        state.chatList = state.chatList.filter(chat => chat.chat_id !== action.payload);
      })
  }
});

export const { setSelectedChatId, setColorMode, setMessages, setChatList, setChatMode } = chatSlice.actions;
export const { selectChatId, selectColorMode, selectMessages, selectChatList, selectChatMode } = chatSlice.selectors;
export const chatReducer = chatSlice.reducer;