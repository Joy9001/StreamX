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

            return response.data
        } catch (error) {
            console.error('Error fetching messages:', error)
            return rejectWithValue(
                error.response?.data?.message || error.message || 'Failed to fetch messages'
            )
        }
    }
)

export const sendMessage = createAsyncThunk(
    'messages/sendMessage',
    async (messageData, { rejectWithValue }) => {
        try {
            const { requestId, sender_id, sender_role, sender_name, message, accessToken } = messageData
            console.log('Sending message for request:', requestId)

            const response = await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/requests/${requestId}/messages`,
                {
                    sender_id,
                    sender_role,
                    sender_name,
                    message
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${accessToken}`,
                    },
                    withCredentials: true,
                }
            )

            return response.data
        } catch (error) {
            console.error('Error sending message:', error)
            return rejectWithValue(
                error.response?.data?.message || error.message || 'Failed to send message'
            )
        }
    }
)

const messageSlice = createSlice({
    name: 'messages',
    initialState: {
        currentRequestId: null,
        messages: [],
        loading: false,
        sending: false,
        error: null
    },
    reducers: {
        setCurrentRequestId: (state, action) => {
            state.currentRequestId = action.payload
        },
        clearMessages: (state) => {
            state.messages = []
            state.currentRequestId = null
        }
    },
    extraReducers: (builder) => {
        builder
            // Handle fetchRequestMessages
            .addCase(fetchRequestMessages.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(fetchRequestMessages.fulfilled, (state, action) => {
                state.loading = false
                state.messages = action.payload.messages || []
                state.currentRequestId = action.payload.requestId
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
                if (action.payload.newMessage) {
                    state.messages.push(action.payload.newMessage) // Add to the end of the array
                }
            })
            .addCase(sendMessage.rejected, (state, action) => {
                state.sending = false
                state.error = action.payload
            })
    }
})

export const { setCurrentRequestId, clearMessages } = messageSlice.actions
export default messageSlice.reducer 