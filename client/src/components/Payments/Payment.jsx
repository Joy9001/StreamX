import { useCallback, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  fetchTransactionHistory,
  fetchWalletBalance,
  resetPaymentErrors,
} from '../../store/slices/paymentSlice'
import Navbar from '../NavBar/Navbar'
import PaymentNav from './PaymentNav'
import PaymentBalanceCard from './PaymentBalanceCard'
import PaymentDepositForm from './PaymentDepositForm'
import PaymentWithdrawForm from './PaymentWithdrawForm'
import PaymentTransactionHistory from './PaymentTransactionHistory'
import { useState } from 'react'

export default function Payment() {
  const dispatch = useDispatch()
  const { userData } = useSelector((state) => state.user)

  // Local UI state - only keeping what's necessary
  const [showDepositForm, setShowDepositForm] = useState(false)
  const [showWithdrawForm, setShowWithdrawForm] = useState(false)

  // Load transactions function
  const loadTransactions = useCallback(() => {
    if (userData?._id) {
      dispatch(
        fetchTransactionHistory({
          id: userData._id,
          accessToken: userData.accessToken,
          page: 1, // Reset to first page on initial load
          limit: 10,
        })
      )
    }
  }, [userData, dispatch])

  // Fetch wallet balance and transaction history on component mount
  useEffect(() => {
    if (userData?._id) {
      dispatch(
        fetchWalletBalance({
          id: userData._id,
          accessToken: userData.accessToken,
        })
      )
      loadTransactions()
    }
  }, [dispatch, userData, loadTransactions])

  // Toggle deposit form
  const toggleDepositForm = () => {
    setShowDepositForm(!showDepositForm)
    if (showWithdrawForm) setShowWithdrawForm(false)
    dispatch(resetPaymentErrors())
  }

  // Toggle withdraw form
  const toggleWithdrawForm = () => {
    setShowWithdrawForm(!showWithdrawForm)
    if (showDepositForm) setShowDepositForm(false)
    dispatch(resetPaymentErrors())
  }

  return (
    <div className='payment-main flex h-screen'>
      <div className='navbar-container h-full flex-shrink-0'>
        <Navbar title='Wallet' />
      </div>

      {/* Main */}
      <div className='payment-container flex flex-grow overflow-hidden pl-6'>
        <div className='payment-main-wrapper flex h-full flex-grow flex-col transition-all duration-300'>
          {/* Inside Nav */}
          <div className='flex-shrink-0 p-4 pb-2'>
            <PaymentNav />
          </div>

          {/* Main Content */}
          <div className='payment-content flex-1 overflow-y-auto p-4 pt-2'>
            {/* Balance Card */}
            <PaymentBalanceCard
              onToggleDepositForm={toggleDepositForm}
              onToggleWithdrawForm={toggleWithdrawForm}
            />

            {/* Deposit Form */}
            {showDepositForm && (
              <PaymentDepositForm onClose={toggleDepositForm} />
            )}

            {/* Withdraw Form */}
            {showWithdrawForm && (
              <PaymentWithdrawForm onClose={toggleWithdrawForm} />
            )}

            {/* Transaction History */}
            <PaymentTransactionHistory />
          </div>
        </div>
      </div>
    </div>
  )
}
