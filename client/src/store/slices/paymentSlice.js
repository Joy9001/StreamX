import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

// Async thunks for API calls
export const fetchWalletBalance = createAsyncThunk(
  'payment/fetchWalletBalance',
  async (userData, { rejectWithValue }) => {
    try {
      const { id, accessToken } = userData
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/wallet/${id}`,
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
          'Failed to fetch wallet balance'
      )
    }
  }
)

export const fetchTransactionHistory = createAsyncThunk(
  'payment/fetchTransactionHistory',
  async (userData, { rejectWithValue }) => {
    try {
      const { id, accessToken, page = 1, limit = 10 } = userData
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/wallet/${id}/transactions?page=${page}&limit=${limit}`,
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
          'Failed to fetch transaction history'
      )
    }
  }
)

export const addMoneyToWallet = createAsyncThunk(
  'payment/addMoneyToWallet',
  async (paymentData, { rejectWithValue }) => {
    try {
      const { id, amount, paymentMethod, accessToken } = paymentData
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/wallet/${id}/deposit`,
        { amount, paymentMethod },
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
          'Failed to add money to wallet'
      )
    }
  }
)

export const withdrawMoney = createAsyncThunk(
  'payment/withdrawMoney',
  async (withdrawData, { rejectWithValue }) => {
    try {
      const { id, amount, bankDetails, accessToken } = withdrawData
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/wallet/${id}/withdraw`,
        { amount, bankDetails },
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
          'Failed to withdraw money'
      )
    }
  }
)

const initialState = {
  walletBalance: 0,
  transactions: [],
  totalTransactions: 0,
  currentPage: 1,
  loading: false,
  transactionsLoading: false,
  depositLoading: false,
  withdrawLoading: false,
  error: null,
  depositSuccess: false,
  withdrawSuccess: false,
  paymentMethods: ['Credit Card', 'PayPal', 'Bank Transfer'],
}

const paymentSlice = createSlice({
  name: 'payment',
  initialState,
  reducers: {
    setCurrentPage: (state, action) => {
      state.currentPage = action.payload
    },
    resetDepositSuccess: (state) => {
      state.depositSuccess = false
    },
    resetWithdrawSuccess: (state) => {
      state.withdrawSuccess = false
    },
    resetPaymentErrors: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch wallet balance
      .addCase(fetchWalletBalance.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchWalletBalance.fulfilled, (state, action) => {
        state.loading = false
        state.walletBalance = action.payload.balance || 0
      })
      .addCase(fetchWalletBalance.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })

      // Fetch transaction history
      .addCase(fetchTransactionHistory.pending, (state) => {
        state.transactionsLoading = true
        state.error = null
      })
      .addCase(fetchTransactionHistory.fulfilled, (state, action) => {
        state.transactionsLoading = false
        state.transactions = action.payload.transactions || []
        state.totalTransactions = action.payload.totalCount || 0
      })
      .addCase(fetchTransactionHistory.rejected, (state, action) => {
        state.transactionsLoading = false
        state.error = action.payload
      })

      // Add money to wallet
      .addCase(addMoneyToWallet.pending, (state) => {
        state.depositLoading = true
        state.error = null
        state.depositSuccess = false
      })
      .addCase(addMoneyToWallet.fulfilled, (state, action) => {
        state.depositLoading = false
        state.walletBalance = action.payload.newBalance || state.walletBalance
        state.depositSuccess = true
        // Add the new transaction to the beginning of transactions list
        if (action.payload.transaction) {
          state.transactions = [action.payload.transaction, ...state.transactions]
          state.totalTransactions += 1
        }
      })
      .addCase(addMoneyToWallet.rejected, (state, action) => {
        state.depositLoading = false
        state.error = action.payload
        state.depositSuccess = false
      })

      // Withdraw money
      .addCase(withdrawMoney.pending, (state) => {
        state.withdrawLoading = true
        state.error = null
        state.withdrawSuccess = false
      })
      .addCase(withdrawMoney.fulfilled, (state, action) => {
        state.withdrawLoading = false
        state.walletBalance = action.payload.newBalance || state.walletBalance
        state.withdrawSuccess = true
        // Add the new transaction to the beginning of transactions list
        if (action.payload.transaction) {
          state.transactions = [action.payload.transaction, ...state.transactions]
          state.totalTransactions += 1
        }
      })
      .addCase(withdrawMoney.rejected, (state, action) => {
        state.withdrawLoading = false
        state.error = action.payload
        state.withdrawSuccess = false
      })
  },
})

export const {
  setCurrentPage,
  resetDepositSuccess,
  resetWithdrawSuccess,
  resetPaymentErrors,
} = paymentSlice.actions

export default paymentSlice.reducer