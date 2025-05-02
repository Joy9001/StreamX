import PropTypes from 'prop-types'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  resetPaymentErrors,
  withdrawMoney,
} from '../../store/slices/paymentSlice'

function PaymentWithdrawForm({ onClose }) {
  const dispatch = useDispatch()
  const { userData } = useSelector((state) => state.user)
  const { walletBalance, withdrawLoading, withdrawSuccess, error } =
    useSelector((state) => state.payment)

  const [amount, setAmount] = useState('')
  const [formStep, setFormStep] = useState(1)
  const [bankDetails, setBankDetails] = useState({
    bankName: '',
    accountType: 'checking',
    accountNumber: '',
    routingNumber: '',
    accountName: '',
  })
  const [formErrors, setFormErrors] = useState({})

  // Format currency for display
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(value)
  }

  // Clean up on success
  useEffect(() => {
    if (withdrawSuccess) {
      const timer = setTimeout(() => {
        onClose()
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [withdrawSuccess, onClose])

  const validateForm = () => {
    const errors = {}

    if (!amount || parseFloat(amount) <= 0) {
      errors.amount = 'Please enter a valid amount'
    } else if (parseFloat(amount) > walletBalance) {
      errors.amount = 'Amount exceeds available balance'
    }

    if (!bankDetails.bankName.trim()) {
      errors.bankName = 'Bank name is required'
    }

    if (!bankDetails.accountNumber.trim()) {
      errors.accountNumber = 'Account number is required'
    } else if (
      !/^\d{8,17}$/.test(bankDetails.accountNumber.replace(/\s/g, ''))
    ) {
      errors.accountNumber = 'Enter a valid account number (8-17 digits)'
    }

    if (!bankDetails.routingNumber.trim()) {
      errors.routingNumber = 'Routing number is required'
    } else if (!/^\d{9}$/.test(bankDetails.routingNumber.replace(/\s/g, ''))) {
      errors.routingNumber = 'Enter a valid 9-digit routing number'
    }

    if (!bankDetails.accountName.trim()) {
      errors.accountName = 'Account holder name is required'
    }

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleContinue = (e) => {
    e.preventDefault()
    if (validateForm()) {
      setFormStep(2)
    }
  }

  const handleBack = () => {
    setFormStep(1)
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    dispatch(resetPaymentErrors())
    dispatch(
      withdrawMoney({
        id: userData._id,
        amount: parseFloat(amount),
        bankDetails,
        accessToken: userData.accessToken,
      })
    )
  }

  // Mask account number for display
  const maskAccountNumber = (number) => {
    const cleaned = number.replace(/\s/g, '')
    const lastFour = cleaned.slice(-4)
    return `xxxx-xxxx-${lastFour}`
  }

  if (withdrawSuccess) {
    const timestamp = new Date().toLocaleString()
    const referenceId =
      'WD' +
      Math.floor(Math.random() * 1000000000)
        .toString()
        .padStart(9, '0')

    return (
      <div className='payment-withdraw-form mb-8 rounded-lg bg-white p-6 shadow-md'>
        <h2 className='mb-4 text-xl font-semibold'>
          Withdrawal Request Successful
        </h2>
        <div className='rounded-md bg-green-100 p-4 text-green-800'>
          <svg
            className='mr-2 inline-block h-5 w-5'
            fill='none'
            stroke='currentColor'
            viewBox='0 0 24 24'
            xmlns='http://www.w3.org/2000/svg'>
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M5 13l4 4L19 7'
            />
          </svg>
          Your withdrawal request has been successfully submitted!
        </div>

        <div className='mt-4 rounded-md border border-gray-200 bg-gray-50 p-4'>
          <h3 className='mb-2 font-medium text-gray-700'>
            Transaction Details
          </h3>
          <div className='grid grid-cols-2 gap-y-2 text-sm'>
            <div className='text-gray-600'>Amount:</div>
            <div className='font-medium'>
              {formatCurrency(parseFloat(amount))}
            </div>

            <div className='text-gray-600'>Bank Account:</div>
            <div className='font-medium'>
              {maskAccountNumber(bankDetails.accountNumber)}
            </div>

            <div className='text-gray-600'>Bank Name:</div>
            <div className='font-medium'>{bankDetails.bankName}</div>

            <div className='text-gray-600'>Reference ID:</div>
            <div className='font-medium'>{referenceId}</div>

            <div className='text-gray-600'>Timestamp:</div>
            <div className='font-medium'>{timestamp}</div>
          </div>
        </div>

        <p className='mt-4 text-sm text-gray-600'>
          Your funds will be transferred to your bank account within 1-3
          business days. You will receive an email confirmation once the
          transfer is complete.
        </p>

        <button
          onClick={onClose}
          className='mt-4 w-full rounded-md bg-indigo-600 px-4 py-2 text-white transition duration-300 hover:bg-indigo-700'>
          Close
        </button>
      </div>
    )
  }

  if (formStep === 2) {
    // Confirmation step
    return (
      <div className='payment-withdraw-form mb-8 rounded-lg bg-white p-6 shadow-md'>
        <h2 className='mb-4 text-xl font-semibold'>Confirm Withdrawal</h2>

        <div className='mb-6 rounded-md border border-gray-200 bg-gray-50 p-4'>
          <h3 className='mb-2 font-medium text-gray-700'>
            Transaction Summary
          </h3>
          <div className='grid grid-cols-2 gap-y-2'>
            <div className='text-gray-600'>Withdrawal Amount:</div>
            <div className='font-medium'>
              {formatCurrency(parseFloat(amount))}
            </div>

            <div className='text-gray-600'>Fee:</div>
            <div className='font-medium'>$0.00</div>

            <div className='text-gray-600'>Total Amount:</div>
            <div className='font-medium'>
              {formatCurrency(parseFloat(amount))}
            </div>

            <div className='col-span-2 my-2 border-t border-gray-200'></div>

            <div className='text-gray-600'>Bank:</div>
            <div className='font-medium'>{bankDetails.bankName}</div>

            <div className='text-gray-600'>Account Type:</div>
            <div className='font-medium capitalize'>
              {bankDetails.accountType}
            </div>

            <div className='text-gray-600'>Account Number:</div>
            <div className='font-medium'>
              {maskAccountNumber(bankDetails.accountNumber)}
            </div>

            <div className='text-gray-600'>Account Holder:</div>
            <div className='font-medium'>{bankDetails.accountName}</div>
          </div>
        </div>

        <div className='mb-4 rounded-md border border-yellow-200 bg-yellow-50 p-3 text-sm text-yellow-800'>
          <svg
            className='mr-1 inline-block h-5 w-5'
            fill='none'
            stroke='currentColor'
            viewBox='0 0 24 24'
            xmlns='http://www.w3.org/2000/svg'>
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
            />
          </svg>
          Please verify all details are correct. Withdrawal requests cannot be
          canceled once submitted.
        </div>

        {error && (
          <div className='mb-4 rounded-md bg-red-100 p-4 text-red-800'>
            {error}
          </div>
        )}

        <div className='flex space-x-3'>
          <button
            onClick={handleBack}
            className='flex-1 rounded-md border border-gray-300 bg-white px-4 py-2 text-gray-700 transition duration-300 hover:bg-gray-50'
            disabled={withdrawLoading}>
            Back
          </button>
          <button
            onClick={handleSubmit}
            className='flex-1 rounded-md bg-indigo-600 px-4 py-2 text-white transition duration-300 hover:bg-indigo-700 disabled:bg-gray-400'
            disabled={withdrawLoading}>
            {withdrawLoading ? (
              <span className='flex items-center justify-center'>
                <svg
                  className='-ml-1 mr-2 h-4 w-4 animate-spin text-white'
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 24 24'>
                  <circle
                    className='opacity-25'
                    cx='12'
                    cy='12'
                    r='10'
                    stroke='currentColor'
                    strokeWidth='4'></circle>
                  <path
                    className='opacity-75'
                    fill='currentColor'
                    d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'></path>
                </svg>
                Processing...
              </span>
            ) : (
              'Confirm Withdrawal'
            )}
          </button>
        </div>
      </div>
    )
  }

  // Step 1: Input details
  return (
    <div className='payment-withdraw-form mb-8 rounded-lg bg-white p-6 shadow-md'>
      <h2 className='mb-4 text-xl font-semibold'>Withdraw Money</h2>

      <div className='mb-4 rounded-md border border-blue-200 bg-blue-50 p-3 text-sm text-blue-800'>
        <svg
          className='mr-1 inline-block h-5 w-5'
          fill='none'
          stroke='currentColor'
          viewBox='0 0 24 24'
          xmlns='http://www.w3.org/2000/svg'>
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth={2}
            d='M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
          />
        </svg>
        Funds will be transferred to your bank account within 1-3 business days.
      </div>

      <form onSubmit={handleContinue}>
        <div className='mb-4'>
          <label
            htmlFor='withdrawAmount'
            className='mb-2 block text-sm font-medium text-gray-700'>
            Withdrawal Amount
          </label>
          <div className='relative'>
            <div className='pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3'>
              <span className='text-gray-500'>$</span>
            </div>
            <input
              type='number'
              id='withdrawAmount'
              className='w-full rounded-md border border-gray-300 px-3 py-2 pl-7 focus:outline-none focus:ring-2 focus:ring-indigo-500'
              placeholder='0.00'
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              min='1'
              max={walletBalance}
              step='0.01'
              required
            />
          </div>
          <div className='flex justify-between'>
            <p className='mt-1 text-sm text-gray-500'>
              Available Balance: {formatCurrency(walletBalance)}
            </p>
            <button
              type='button'
              className='mt-1 text-sm text-indigo-600 hover:text-indigo-800'
              onClick={() => setAmount(walletBalance.toString())}>
              Withdraw Maximum
            </button>
          </div>
          {formErrors.amount && (
            <p className='mt-1 text-sm text-red-600'>{formErrors.amount}</p>
          )}
        </div>

        <div className='mb-4'>
          <label
            htmlFor='bankName'
            className='mb-2 block text-sm font-medium text-gray-700'>
            Bank Name
          </label>
          <input
            type='text'
            id='bankName'
            className='w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500'
            placeholder='Enter bank name'
            value={bankDetails.bankName}
            onChange={(e) =>
              setBankDetails({
                ...bankDetails,
                bankName: e.target.value,
              })
            }
            required
          />
          {formErrors.bankName && (
            <p className='mt-1 text-sm text-red-600'>{formErrors.bankName}</p>
          )}
        </div>

        <div className='mb-4'>
          <label
            htmlFor='accountType'
            className='mb-2 block text-sm font-medium text-gray-700'>
            Account Type
          </label>
          <div className='flex space-x-4'>
            <label className='flex items-center'>
              <input
                type='radio'
                name='accountType'
                value='checking'
                className='h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-500'
                checked={bankDetails.accountType === 'checking'}
                onChange={() =>
                  setBankDetails({ ...bankDetails, accountType: 'checking' })
                }
              />
              <span className='ml-2 text-sm text-gray-700'>
                Checking Account
              </span>
            </label>
            <label className='flex items-center'>
              <input
                type='radio'
                name='accountType'
                value='savings'
                className='h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-500'
                checked={bankDetails.accountType === 'savings'}
                onChange={() =>
                  setBankDetails({ ...bankDetails, accountType: 'savings' })
                }
              />
              <span className='ml-2 text-sm text-gray-700'>
                Savings Account
              </span>
            </label>
          </div>
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
          {formErrors.accountNumber && (
            <p className='mt-1 text-sm text-red-600'>
              {formErrors.accountNumber}
            </p>
          )}
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
            placeholder='Enter 9-digit routing number'
            value={bankDetails.routingNumber}
            onChange={(e) =>
              setBankDetails({
                ...bankDetails,
                routingNumber: e.target.value,
              })
            }
            maxLength={9}
            required
          />
          {formErrors.routingNumber && (
            <p className='mt-1 text-sm text-red-600'>
              {formErrors.routingNumber}
            </p>
          )}
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
            placeholder='Enter name as it appears on bank account'
            value={bankDetails.accountName}
            onChange={(e) =>
              setBankDetails({
                ...bankDetails,
                accountName: e.target.value,
              })
            }
            required
          />
          {formErrors.accountName && (
            <p className='mt-1 text-sm text-red-600'>
              {formErrors.accountName}
            </p>
          )}
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
            !amount ||
            parseFloat(amount) <= 0 ||
            parseFloat(amount) > walletBalance
          }>
          Continue
        </button>
      </form>
    </div>
  )
}

PaymentWithdrawForm.propTypes = {
  onClose: PropTypes.func.isRequired,
}

export default PaymentWithdrawForm
