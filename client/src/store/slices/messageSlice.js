import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

// Async thunks for message API calls
export const fetchRequestMessages = createAsyncThunk(
  'messages/fetchRequestMessages',
  async (requestData, { rejectWithValue }) => {
    try {
      const { requestId, accessToken } = requestData
      console.log('Fetching messages for request:', requestId)

      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/requests/${requestId}/messages`,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
          withCredentials: true,
        }
      )

      return { ...response.data, requestId }
    } catch (error) {
      console.error('Error fetching messages:', error)
      return rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          'Failed to fetch messages'
      )
    }
  }
)

export const sendMessage = createAsyncThunk(
  'messages/sendMessage',
  async (messageData, { rejectWithValue }) => {
    try {
      const {
        requestId,
        sender_id,
        sender_role,
        sender_name,
        message,
        accessToken,
      } = messageData
      console.log('Sending message for request:', requestId)

      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/requests/${requestId}/messages`,
        {
          sender_id,
          sender_role,
          sender_name,
          message,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
          withCredentials: true,
        }
      )

      return { ...response.data, requestId }
    } catch (error) {
      console.error('Error sending message:', error)
      return rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          'Failed to send message'
      )
    }
  }
)

// Thunk to fetch message counts for multiple requests
export const fetchMessageCounts = createAsyncThunk(
  'messages/fetchMessageCounts',
  async (requestsData, { rejectWithValue }) => {
    try {
      const { requestIds, accessToken } = requestsData

      if (!requestIds || requestIds.length === 0) {
        return { counts: {} }
      }

      console.log('Fetching message counts for requests:', requestIds)

      const counts = {}

      await Promise.all(
        requestIds.map(async (requestId) => {
          try {
            const response = await axios.get(
              `${import.meta.env.VITE_BACKEND_URL}/requests/${requestId}/messages`,
              {
                headers: {
                  'Content-Type': 'application/json',
                  Authorization: `Bearer ${accessToken}`,
                },
                withCredentials: true,
              }
            )

            counts[requestId] = response.data.messages?.length || 0
          } catch (error) {
            console.error(
              `Error fetching messages for request ${requestId}:`,
              error
            )
            counts[requestId] = 0
          }
        })
      )

      return { counts }
    } catch (error) {
      console.error('Error fetching message counts:', error)
      return rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          'Failed to fetch message counts'
      )
    }
  }
)

const messageSlice = createSlice({
  name: 'messages',
  initialState: {
    currentRequestId: null,
    messagesById: {}, // Organize messages by request ID
    messageCounts: {}, // Store counts for all requests
    loading: false,
    countLoading: false,
    sending: false,
    error: null,
  },
  reducers: {
    setCurrentRequestId: (state, action) => {
      state.currentRequestId = action.payload
    },
    clearMessages: (state, action) => {
      // If a specific requestId is provided, only clear that one
      if (action.payload) {
        const requestId = action.payload
        if (state.messagesById[requestId]) {
          delete state.messagesById[requestId]
        }
        if (state.currentRequestId === requestId) {
          state.currentRequestId = null
        }
      } else {
        // Otherwise clear all
        state.messagesById = {}
        state.currentRequestId = null
      }
    },
    clearAllMessages: (state) => {
      state.messagesById = {}
      state.currentRequestId = null
    },
  },
  extraReducers: (builder) => {
    builder
      // Handle fetchMessageCounts
      .addCase(fetchMessageCounts.pending, (state) => {
        state.countLoading = true
        state.error = null
      })
      .addCase(fetchMessageCounts.fulfilled, (state, action) => {
        state.countLoading = false
        state.messageCounts = action.payload.counts || {}
      })
      .addCase(fetchMessageCounts.rejected, (state, action) => {
        state.countLoading = false
        state.error = action.payload
      })

      // Handle fetchRequestMessages
      .addCase(fetchRequestMessages.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchRequestMessages.fulfilled, (state, action) => {
        state.loading = false
        const requestId = action.payload.requestId
        if (requestId) {
          state.messagesById[requestId] = action.payload.messages || []
          state.currentRequestId = requestId
          // Update the count as well
          state.messageCounts[requestId] = action.payload.messages?.length || 0
        }
      })
      .addCase(fetchRequestMessages.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })

      // Handle sendMessage
      .addCase(sendMessage.pending, (state) => {
        state.sending = true
        state.error = null
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.sending = false
        // Add new message to the messages array
        const requestId = action.payload.requestId
        if (requestId && action.payload.newMessage) {
          if (!state.messagesById[requestId]) {
            state.messagesById[requestId] = []
          }
          state.messagesById[requestId].push(action.payload.newMessage)

          // Update count
          state.messageCounts[requestId] =
            (state.messageCounts[requestId] || 0) + 1
        }
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.sending = false
        state.error = action.payload
      })
  },
})

export const { setCurrentRequestId, clearMessages, clearAllMessages } =
  messageSlice.actions
export default messageSlice.reducer
