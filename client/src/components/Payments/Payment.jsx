import { useCallback, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  addMoneyToWallet,
  fetchTransactionHistory,
  fetchWalletBalance,
  resetDepositSuccess,
  resetPaymentErrors,
  resetWithdrawSuccess,
  setCurrentPage,
  withdrawMoney,
} from '../../store/slices/paymentSlice'
import Navbar from '../NavBar/Navbar'
import PaymentNav from './PaymentNav'
import PaymentBalanceCard from './PaymentBalanceCard'
import PaymentDepositForm from './PaymentDepositForm'
import PaymentWithdrawForm from './PaymentWithdrawForm'
import PaymentTransactionHistory from './PaymentTransactionHistory'

export default function Payment() {
  const dispatch = useDispatch()
  const { userData } = useSelector((state) => state.user)
  const {
    walletBalance,
    transactions,
    totalTransactions,
    currentPage,
    loading,
    transactionsLoading,
    depositLoading,
    withdrawLoading,
    error,
    depositSuccess,
    withdrawSuccess,
    paymentMethods,
  } = useSelector((state) => state.payment)

  // Local state for forms
  const [depositAmount, setDepositAmount] = useState('')
  const [withdrawAmount, setWithdrawAmount] = useState('')
  const [selectedPaymentMethod, setSelectedPaymentMethod] =
    useState('Credit Card')
  const [showDepositForm, setShowDepositForm] = useState(false)
  const [showWithdrawForm, setShowWithdrawForm] = useState(false)
  const [bankDetails, setBankDetails] = useState({
    accountNumber: '',
    routingNumber: '',
    accountName: '',
  })
  const [pageSize] = useState(10)

  // Load transactions function
  const loadTransactions = useCallback(() => {
    if (userData?._id) {
      dispatch(
        fetchTransactionHistory({
          id: userData._id,
          accessToken: userData.accessToken,
          page: currentPage,
          limit: pageSize,
        })
      )
    }
  }, [userData, dispatch, currentPage, pageSize])

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

  // Load transactions when page changes
  useEffect(() => {
    if (userData?._id) {
      loadTransactions()
    }
  }, [currentPage, loadTransactions, userData?._id])

  // Reset success messages after 3 seconds
  useEffect(() => {
    let timer
    if (depositSuccess) {
      timer = setTimeout(() => {
        dispatch(resetDepositSuccess())
        setShowDepositForm(false)
        setDepositAmount('')
      }, 3000)
    }
    return () => clearTimeout(timer)
  }, [depositSuccess, dispatch])

  useEffect(() => {
    let timer
    if (withdrawSuccess) {
      timer = setTimeout(() => {
        dispatch(resetWithdrawSuccess())
        setShowWithdrawForm(false)
        setWithdrawAmount('')
        setBankDetails({
          accountNumber: '',
          routingNumber: '',
          accountName: '',
        })
      }, 3000)
    }
    return () => clearTimeout(timer)
  }, [withdrawSuccess, dispatch])

  // Handle deposit submission
  const handleDepositSubmit = (e) => {
    e.preventDefault()
    if (!depositAmount || parseFloat(depositAmount) <= 0) {
      return
    }
    dispatch(resetPaymentErrors())
    dispatch(
      addMoneyToWallet({
        id: userData._id,
        amount: parseFloat(depositAmount),
        paymentMethod: selectedPaymentMethod,
        accessToken: userData.accessToken,
      })
    )
  }

  // Handle withdraw submission
  const handleWithdrawSubmit = (e) => {
    e.preventDefault()
    if (
      !withdrawAmount ||
      parseFloat(withdrawAmount) <= 0 ||
      parseFloat(withdrawAmount) > walletBalance
    ) {
      return
    }
    dispatch(resetPaymentErrors())
    dispatch(
      withdrawMoney({
        id: userData._id,
        amount: parseFloat(withdrawAmount),
        bankDetails,
        accessToken: userData.accessToken,
      })
    )
  }

  // Handle page change
  const handlePageChange = (newPage) => {
    dispatch(setCurrentPage(newPage))
  }

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

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

  // Calculate total pages
  const totalPages = Math.ceil(totalTransactions / pageSize)

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
              walletBalance={walletBalance} 
              loading={loading} 
              toggleDepositForm={toggleDepositForm} 
              toggleWithdrawForm={toggleWithdrawForm} 
            />

            {/* Deposit Form */}
            {showDepositForm && (
              <PaymentDepositForm 
                depositAmount={depositAmount}
                setDepositAmount={setDepositAmount}
                selectedPaymentMethod={selectedPaymentMethod}
                setSelectedPaymentMethod={setSelectedPaymentMethod}
                paymentMethods={paymentMethods}
                error={error}
                depositLoading={depositLoading}
                depositSuccess={depositSuccess}
                handleDepositSubmit={handleDepositSubmit}
              />
            )}

            {/* Withdraw Form */}
            {showWithdrawForm && (
              <PaymentWithdrawForm 
                withdrawAmount={withdrawAmount}
                setWithdrawAmount={setWithdrawAmount}
                bankDetails={bankDetails}
                setBankDetails={setBankDetails}
                walletBalance={walletBalance}
                error={error}
                withdrawLoading={withdrawLoading}
                withdrawSuccess={withdrawSuccess}
                handleWithdrawSubmit={handleWithdrawSubmit}
              />
            )}
            
            {/* Transaction History */}
            <PaymentTransactionHistory 
              transactions={transactions}
              transactionsLoading={transactionsLoading}
              currentPage={currentPage}
              totalPages={totalPages}
              handlePageChange={handlePageChange}
              formatDate={formatDate}
            />
          </div>
        </div>
      </div>
    </div>
  )
}