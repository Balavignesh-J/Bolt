import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  messages: [
    {
      role: "assistant",
      content: "Hello! I am your AI assistant. Ask questions, generate ideas, get explanations, and receive instant help!",
    },
  ],
};

const aiChatSlice = createSlice({
  name: "aiChat",
  initialState,
  reducers: {
    addAiMessage: (state, action) => {
      state.messages.push(action.payload);
    },
    resetAiChat: (state) => {
      state.messages = initialState.messages;
    },
  },
});

export const { addAiMessage, resetAiChat } = aiChatSlice.actions;

export default aiChatSlice.reducer;
