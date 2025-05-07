import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'

// Async thunks for API calls
export const fetchRequestsFromUser = createAsyncThunk(
  'requests/fetchRequestsFromUser',
  async (userData, { rejectWithValue }) => {
    try {
      const { id, accessToken } = userData
      // Use from_id as the parameter name to match the backend
      const url = `${import.meta.env.VITE_BACKEND_URL}/requests/from-id/${id}`
      console.log('Making API request to:', url)

      // Make sure the ID is a valid format for the backend
      if (!id) {
        console.error('Invalid ID provided:', id)
        return rejectWithValue('Invalid user ID')
      }

      const response = await axios.get(url, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        withCredentials: true,
      })
      console.log(
        'Got response from fetchRequestsFromUser:',
        response.status,
        response.data
      )
      return response.data
    } catch (error) {
      console.error('Error in fetchRequestsFromUser:', error)
      // If the server responds with a 404, return an empty array instead of an error
      if (error.response?.status === 404) {
        console.log('No requests found for this user, returning empty array')
        return []
      }
      return rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          'Failed to fetch requests'
      )
    }
  }
)

export const fetchRequestsToUser = createAsyncThunk(
  'requests/fetchRequestsToUser',
  async (userData, { rejectWithValue }) => {
    try {
      const { id, accessToken } = userData
      // Use to_id as the parameter name to match the backend
      const url = `${import.meta.env.VITE_BACKEND_URL}/requests/to-id/${id}`
      console.log('Making API request to:', url)

      // Make sure the ID is a valid format for the backend
      if (!id) {
        console.error('Invalid ID provided:', id)
        return rejectWithValue('Invalid user ID')
      }

      const response = await axios.get(url, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        withCredentials: true,
      })
      console.log(
        'Got response from fetchRequestsToUser:',
        response.status,
        response.data
      )
      return response.data
    } catch (error) {
      console.error('Error in fetchRequestsToUser:', error)
      // If the server responds with a 404, return an empty array instead of an error
      if (error.response?.status === 404) {
        console.log('No requests found for this user, returning empty array')
        return []
      }
      return rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          'Failed to fetch requests'
      )
    }
  }
)

export const approveRequest = createAsyncThunk(
  'requests/approveRequest',
  async (requestData, { rejectWithValue }) => {
    try {
      const {
        requestId,
        videoId,
        fromId,
        userData,
        accessToken,
        userRole,
        price,
      } = requestData
      console.log('requestData', requestData)

      const transactionAmount = price

      let walletTransactionResponse = null
      let videoResponse = null
      let statusResponse = null

      // Update video ownership or editor access based on user role
      if (userRole === 'Owner') {
        // Process wallet transaction first
        walletTransactionResponse = await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}/api/wallet/transfer`,
          {
            fromWalletId: userData._id,
            toWalletId: fromId,
            amount: transactionAmount,
            requestId: requestId,
            description: `Payment for video editing service`,
          },
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${accessToken}`,
            },
            withCredentials: true,
          }
        )

        // Update video ownership
        videoResponse = await axios.patch(
          `${import.meta.env.VITE_BACKEND_URL}/api/videos/update-ownership`,
          {
            videoId: videoId,
            role: userRole,
            userId: userData._id,
          },
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${accessToken}`,
            },
            withCredentials: true,
          }
        )

        // Update request status only after successful payment and ownership transfer
        statusResponse = await axios.patch(
          `${import.meta.env.VITE_BACKEND_URL}/requests/${requestId}/status`,
          { status: 'approved' },
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${accessToken}`,
            },
            withCredentials: true,
          }
        )

        return {
          request: statusResponse.data,
          video: videoResponse.data,
          transaction: walletTransactionResponse.data,
        }
      } else if (userRole === 'Editor') {
        videoResponse = await axios.patch(
          `${import.meta.env.VITE_BACKEND_URL}/api/videos/update-ownership`,
          {
            videoId: videoId,
            role: 'Owner',
            userId: fromId,
          },
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${accessToken}`,
            },
            withCredentials: true,
          }
        )

        // For editors, update status after video ownership update
        statusResponse = await axios.patch(
          `${import.meta.env.VITE_BACKEND_URL}/requests/${requestId}/status`,
          { status: 'approved' },
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${accessToken}`,
            },
            withCredentials: true,
          }
        )

        return { request: statusResponse.data, video: videoResponse.data }
      }

      return { request: statusResponse.data }
    } catch (error) {
      console.error('Error in approveRequest:', error)
      return rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          'Failed to approve request'
      )
    }
  }
)

export const rejectRequest = createAsyncThunk(
  'requests/rejectRequest',
  async (requestData, { rejectWithValue }) => {
    try {
      const { requestId, accessToken } = requestData

      const response = await axios.patch(
        `${import.meta.env.VITE_BACKEND_URL}/requests/${requestId}/status`,
        { status: 'rejected' },
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
      return rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          'Failed to reject request'
      )
    }
  }
)

export const changeRequestPrice = createAsyncThunk(
  'requests/changeRequestPrice',
  async (priceData, { rejectWithValue }) => {
    try {
      const { id, price, accessToken } = priceData

      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/requests/change-price`,
        {
          id,
          price,
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
      return rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          'Failed to change request price'
      )
    }
  }
)

const requestSlice = createSlice({
  name: 'requests',
  initialState: {
    sentRequests: [],
    receivedRequests: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Handle fetchRequestsFromUser
      .addCase(fetchRequestsFromUser.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchRequestsFromUser.fulfilled, (state, action) => {
        state.loading = false
        // Handle case where action.payload is undefined
        state.sentRequests = action.payload || []
      })
      .addCase(fetchRequestsFromUser.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })

      // Handle fetchRequestsToUser
      .addCase(fetchRequestsToUser.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchRequestsToUser.fulfilled, (state, action) => {
        state.loading = false
        // Handle case where action.payload is undefined
        state.receivedRequests = action.payload || []
      })
      .addCase(fetchRequestsToUser.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })

      // Handle approveRequest
      .addCase(approveRequest.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(approveRequest.fulfilled, (state, action) => {
        state.loading = false
        // Update in both lists if request exists there
        state.sentRequests = state.sentRequests.map((req) =>
          req._id === action.payload.request._id
            ? { ...req, status: 'approved' }
            : req
        )
        state.receivedRequests = state.receivedRequests.map((req) =>
          req._id === action.payload.request._id
            ? { ...req, status: 'approved' }
            : req
        )
      })
      .addCase(approveRequest.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })

      // Handle rejectRequest
      .addCase(rejectRequest.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(rejectRequest.fulfilled, (state, action) => {
        state.loading = false
        // Update in both lists if request exists there
        state.sentRequests = state.sentRequests.map((req) =>
          req._id === action.payload._id ? { ...req, status: 'rejected' } : req
        )
        state.receivedRequests = state.receivedRequests.map((req) =>
          req._id === action.payload._id ? { ...req, status: 'rejected' } : req
        )
      })
      .addCase(rejectRequest.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })

      // Handle changeRequestPrice
      .addCase(changeRequestPrice.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(changeRequestPrice.fulfilled, (state, action) => {
        console.log('changeRequestPrice fulfilled', action.payload)
        state.loading = false
        // Update the price in both sent and received requests
        state.sentRequests = state.sentRequests.map((req) =>
          req._id === action.payload.request._id
            ? { ...req, price: action.payload.request.price }
            : req
        )
        state.receivedRequests = state.receivedRequests.map((req) =>
          req._id === action.payload.request._id
            ? { ...req, price: action.payload.request.price }
            : req
        )
      })
      .addCase(changeRequestPrice.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload.message
      })
  },
})

export default requestSlice.reducer
