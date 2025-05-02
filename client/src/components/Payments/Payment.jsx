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
          <div className='payment-balance-card mb-8 rounded-lg bg-white p-6 shadow-md'>
            <div className='flex items-center justify-between'>
              <div>
                <h2 className='text-xl font-semibold text-gray-700'>
                  Current Balance
                </h2>
                <p className='mt-2 text-4xl font-bold text-black'>
                  ${loading ? '...' : walletBalance.toFixed(2)}
                </p>
              </div>
              <div className='flex gap-4'>
                <button
                  onClick={toggleDepositForm}
                  className='btn rounded-md bg-primary px-4 py-2 text-black transition duration-300 hover:bg-primary/80'>
                  Add Money
                </button>
                <button
                  onClick={toggleWithdrawForm}
                  className='btn rounded-md bg-secondary px-4 py-2 text-black transition duration-300 hover:bg-secondary/80'
                  disabled={walletBalance <= 0}>
                  Withdraw
                </button>
              </div>
            </div>
          </div>

          {/* Deposit Form */}
          {showDepositForm && (
            <div className='payment-deposit-form mb-8 rounded-lg bg-white p-6 shadow-md'>
              <h2 className='mb-4 text-xl font-semibold'>
                Add Money to Wallet
              </h2>
              {depositSuccess ? (
                <div className='rounded-md bg-green-100 p-4 text-green-800'>
                  Successfully added ${depositAmount} to your wallet!
                </div>
              ) : (
                <form onSubmit={handleDepositSubmit}>
                  <div className='mb-4'>
                    <label
                      htmlFor='amount'
                      className='mb-2 block text-sm font-medium text-gray-700'>
                      Amount
                    </label>
                    <input
                      type='number'
                      id='amount'
                      className='w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500'
                      placeholder='Enter amount'
                      value={depositAmount}
                      onChange={(e) => setDepositAmount(e.target.value)}
                      min='1'
                      step='0.01'
                      required
                    />
                  </div>
                  <div className='mb-4'>
                    <label
                      htmlFor='paymentMethod'
                      className='mb-2 block text-sm font-medium text-gray-700'>
                      Payment Method
                    </label>
                    <select
                      id='paymentMethod'
                      className='w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500'
                      value={selectedPaymentMethod}
                      onChange={(e) =>
                        setSelectedPaymentMethod(e.target.value)
                      }>
                      {paymentMethods.map((method) => (
                        <option key={method} value={method}>
                          {method}
                        </option>
                      ))}
                    </select>
                  </div>
                  {error && (
                    <div className='mb-4 rounded-md bg-red-100 p-4 text-red-800'>
                      {error}
                    </div>
                  )}
                  <button
                    type='submit'
                    className='w-full rounded-md bg-green-600 px-4 py-2 text-white transition duration-300 hover:bg-green-700 disabled:bg-gray-400'
                    disabled={depositLoading}>
                    {depositLoading ? 'Processing...' : 'Add Money'}
                  </button>
                </form>
              )}
            </div>
          )}

          {/* Withdraw Form */}
          {showWithdrawForm && (
            <div className='payment-withdraw-form mb-8 rounded-lg bg-white p-6 shadow-md'>
              <h2 className='mb-4 text-xl font-semibold'>Withdraw Money</h2>
              {withdrawSuccess ? (
                <div className='rounded-md bg-green-100 p-4 text-green-800'>
                  Successfully requested withdrawal of ${withdrawAmount}. It
                  will be processed within 1-3 business days.
                </div>
              ) : (
                <form onSubmit={handleWithdrawSubmit}>
                  <div className='mb-4'>
                    <label
                      htmlFor='withdrawAmount'
                      className='mb-2 block text-sm font-medium text-gray-700'>
                      Amount
                    </label>
                    <input
                      type='number'
                      id='withdrawAmount'
                      className='w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500'
                      placeholder='Enter amount'
                      value={withdrawAmount}
                      onChange={(e) => setWithdrawAmount(e.target.value)}
                      min='1'
                      max={walletBalance}
                      step='0.01'
                      required
                    />
                    <p className='mt-1 text-sm text-gray-500'>
                      Available: ${walletBalance.toFixed(2)}
                    </p>
                  </div>
                  <div className='mb-4'>
                    <label
                      htmlFor='accountNumber'
                      className='mb-2 block text-sm font-medium text-gray-700'>
                      Account Number
                    </label>
                    <input
                      type='text'
                      id='accountNumber'
                      className='w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500'
                      placeholder='Enter account number'
                      value={bankDetails.accountNumber}
                      onChange={(e) =>
                        setBankDetails({
                          ...bankDetails,
                          accountNumber: e.target.value,
                        })
                      }
                      required
                    />
                  </div>
                  <div className='mb-4'>
                    <label
                      htmlFor='routingNumber'
                      className='mb-2 block text-sm font-medium text-gray-700'>
                      Routing Number
                    </label>
                    <input
                      type='text'
                      id='routingNumber'
                      className='w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500'
                      placeholder='Enter routing number'
                      value={bankDetails.routingNumber}
                      onChange={(e) =>
                        setBankDetails({
                          ...bankDetails,
                          routingNumber: e.target.value,
                        })
                      }
                      required
                    />
                  </div>
                  <div className='mb-4'>
                    <label
                      htmlFor='accountName'
                      className='mb-2 block text-sm font-medium text-gray-700'>
                      Account Holder Name
                    </label>
                    <input
                      type='text'
                      id='accountName'
                      className='w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500'
                      placeholder='Enter account holder name'
                      value={bankDetails.accountName}
                      onChange={(e) =>
                        setBankDetails({
                          ...bankDetails,
                          accountName: e.target.value,
                        })
                      }
                      required
                    />
                  </div>
                  {error && (
                    <div className='mb-4 rounded-md bg-red-100 p-4 text-red-800'>
                      {error}
                    </div>
                  )}
                  <button
                    type='submit'
                    className='w-full rounded-md bg-indigo-600 px-4 py-2 text-white transition duration-300 hover:bg-indigo-700 disabled:bg-gray-400'
                    disabled={
                      withdrawLoading ||
                      parseFloat(withdrawAmount) > walletBalance ||
                      parseFloat(withdrawAmount) <= 0
                    }>
                    {withdrawLoading ? 'Processing...' : 'Withdraw Money'}
                  </button>
                </form>
              )}
            </div>
          )}

          {/* Transaction History */}
          <div className='payment-transaction-history rounded-lg bg-white p-6 shadow-md'>
            <h2 className='mb-4 text-xl font-semibold'>Transaction History</h2>
            {transactionsLoading ? (
              <div className='py-4 text-center'>Loading transactions...</div>
            ) : transactions.length === 0 ? (
              <div className='py-4 text-center text-gray-500'>
                No transactions found
              </div>
            ) : (
              <>
                <div className='overflow-x-auto'>
                  <table className='min-w-full divide-y divide-gray-200'>
                    <thead className='bg-gray-50'>
                      <tr>
                        <th
                          scope='col'
                          className='px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500'>
                          Date
                        </th>
                        <th
                          scope='col'
                          className='px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500'>
                          Transaction ID
                        </th>
                        <th
                          scope='col'
                          className='px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500'>
                          Description
                        </th>
                        <th
                          scope='col'
                          className='px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500'>
                          Amount
                        </th>
                        <th
                          scope='col'
                          className='px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500'>
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody className='divide-y divide-gray-200 bg-white'>
                      {transactions.map((transaction) => (
                        <tr key={transaction._id}>
                          <td className='whitespace-nowrap px-6 py-4 text-sm text-gray-500'>
                            {formatDate(transaction.createdAt)}
                          </td>
                          <td className='whitespace-nowrap px-6 py-4 text-sm text-gray-500'>
                            {transaction._id.substring(0, 8)}...
                          </td>
                          <td className='whitespace-nowrap px-6 py-4 text-sm text-gray-900'>
                            {transaction.description}
                          </td>
                          <td
                            className={`whitespace-nowrap px-6 py-4 text-sm font-medium ${
                              transaction.type === 'deposit'
                                ? 'text-green-600'
                                : 'text-red-600'
                            }`}>
                            {transaction.type === 'deposit' ? '+' : '-'}$
                            {transaction.amount.toFixed(2)}
                          </td>
                          <td className='whitespace-nowrap px-6 py-4 text-sm'>
                            <span
                              className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                                transaction.status === 'completed'
                                  ? 'bg-green-100 text-green-800'
                                  : transaction.status === 'pending'
                                    ? 'bg-yellow-100 text-yellow-800'
                                    : 'bg-red-100 text-red-800'
                              }`}>
                              {transaction.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className='mt-6 flex items-center justify-between'>
                    <div>
                      <p className='text-sm text-gray-700'>
                        Showing page {currentPage} of {totalPages}
                      </p>
                    </div>
                    <div className='flex gap-2'>
                      <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className='rounded-md border border-gray-300 bg-white px-3 py-1 text-sm hover:bg-gray-50 disabled:opacity-50'>
                        Previous
                      </button>
                      <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className='rounded-md border border-gray-300 bg-white px-3 py-1 text-sm hover:bg-gray-50 disabled:opacity-50'>
                        Next
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
          </div>
        </div>
      </div>
    </div>
  )
}
