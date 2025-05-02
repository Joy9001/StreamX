import PropTypes from 'prop-types'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  addMoneyToWallet,
  resetPaymentErrors,
} from '../../store/slices/paymentSlice'
import { CreditCard, Banknote, Building, Lock } from 'lucide-react'

// Using Lucid React icons instead of custom SVGs
const CreditCardIcon = () => <CreditCard className="h-5 w-5" />

const PayPalIcon = () => <Banknote className="h-5 w-5" />

const BankIcon = () => <Building className="h-5 w-5" />

const LockIcon = () => <Lock className="h-4 w-4" />

function PaymentDepositForm({ onClose }) {
  const dispatch = useDispatch()
  const { userData } = useSelector((state) => state.user)
  const { paymentMethods, depositLoading, depositSuccess, error } = useSelector(
    (state) => state.payment
  )

  // Form state
  const [amount, setAmount] = useState('')
  const [selectedMethod, setSelectedMethod] = useState('Credit Card')

  // Credit card specific fields
  const [cardNumber, setCardNumber] = useState('')
  const [cardExpiry, setCardExpiry] = useState('')
  const [cardCVV, setCardCVV] = useState('')
  const [cardName, setCardName] = useState('')

  // PayPal specific fields
  const [paypalEmail, setPaypalEmail] = useState('')

  // Bank Transfer specific fields
  const [accountNumber, setAccountNumber] = useState('')
  const [routingNumber, setRoutingNumber] = useState('')
  const [bankName, setBankName] = useState('')

  // Form validation
  const [errors, setErrors] = useState({})
  const [formTouched, setFormTouched] = useState(false)

  // Process fees (for demonstration)
  const processingFee = amount
    ? (parseFloat(amount) * 0.015).toFixed(2)
    : '0.00'
  const totalAmount = amount
    ? (parseFloat(amount) + parseFloat(processingFee)).toFixed(2)
    : '0.00'

  // Format card number with spaces
  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '')
    const matches = v.match(/\d{4,16}/g)
    const match = (matches && matches[0]) || ''
    const parts = []

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4))
    }

    if (parts.length) {
      return parts.join(' ')
    } else {
      return value
    }
  }

  // Format expiry date MM/YY
  const formatExpiry = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '')

    if (v.length > 2) {
      return `${v.substring(0, 2)}/${v.substring(2, 4)}`
    }

    return value
  }

  // Clean up on success
  useEffect(() => {
    if (depositSuccess) {
      const timer = setTimeout(() => {
        onClose()
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [depositSuccess, onClose])

  // Validate form based on payment method
  const validateForm = () => {
    const newErrors = {}

    if (!amount || parseFloat(amount) <= 0) {
      newErrors.amount = 'Please enter a valid amount'
    }

    if (selectedMethod === 'Credit Card') {
      if (!cardNumber || cardNumber.replace(/\s/g, '').length < 16) {
        newErrors.cardNumber = 'Please enter a valid card number'
      }
      if (!cardExpiry || cardExpiry.length < 5) {
        newErrors.cardExpiry = 'Please enter a valid expiry date'
      }
      if (!cardCVV || cardCVV.length < 3) {
        newErrors.cardCVV = 'Please enter a valid CVV'
      }
      if (!cardName) {
        newErrors.cardName = 'Please enter the name on card'
      }
    } else if (selectedMethod === 'PayPal') {
      if (!paypalEmail || !paypalEmail.includes('@')) {
        newErrors.paypalEmail = 'Please enter a valid PayPal email'
      }
    } else if (selectedMethod === 'Bank Transfer') {
      if (!accountNumber) {
        newErrors.accountNumber = 'Please enter your account number'
      }
      if (!routingNumber) {
        newErrors.routingNumber = 'Please enter your routing number'
      }
      if (!bankName) {
        newErrors.bankName = 'Please enter your bank name'
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setFormTouched(true)

    if (!validateForm()) {
      return
    }

    dispatch(resetPaymentErrors())

    // Prepare payment details based on method
    let paymentDetails = {
      id: userData._id,
      amount: parseFloat(amount),
      paymentMethod: selectedMethod,
      accessToken: userData.accessToken,
    }

    // Add method-specific details
    if (selectedMethod === 'Credit Card') {
      paymentDetails.cardDetails = {
        number: cardNumber.replace(/\s/g, ''),
        expiry: cardExpiry,
        cvv: cardCVV,
        name: cardName,
      }
    } else if (selectedMethod === 'PayPal') {
      paymentDetails.paypalEmail = paypalEmail
    } else if (selectedMethod === 'Bank Transfer') {
      paymentDetails.bankDetails = {
        accountNumber,
        routingNumber,
        bankName,
      }
    }

    dispatch(addMoneyToWallet(paymentDetails))
  }

  const renderPaymentMethodSelector = () => {
    return (
      <div className='mb-5'>
        <label className='mb-2 block text-sm font-medium text-gray-700'>
          Payment Method
        </label>
        <div className='grid grid-cols-3 gap-3'>
          {paymentMethods.map((method) => (
            <div
              key={method}
              onClick={() => setSelectedMethod(method)}
              className={`flex cursor-pointer flex-col items-center justify-center rounded-lg border p-4 transition-all hover:border-indigo-500 ${selectedMethod === method ? 'border-indigo-500 bg-indigo-50' : 'border-gray-300'}`}>
              {method === 'Credit Card' && <CreditCardIcon />}
              {method === 'PayPal' && <PayPalIcon />}
              {method === 'Bank Transfer' && <BankIcon />}
              <span className='mt-2 text-sm'>{method}</span>
            </div>
          ))}
        </div>
      </div>
    )
  }

  const renderCreditCardFields = () => {
    if (selectedMethod !== 'Credit Card') return null

    return (
      <div className='mt-4 rounded-lg border border-gray-200 bg-gray-50 p-4'>
        <div className='mb-4'>
          <label
            htmlFor='cardNumber'
            className='mb-2 block text-sm font-medium text-gray-700'>
            Card Number
          </label>
          <input
            type='text'
            id='cardNumber'
            className={`w-full rounded-md border ${errors.cardNumber && formTouched ? 'border-red-500' : 'border-gray-300'} px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500`}
            placeholder='4242 4242 4242 4242'
            value={cardNumber}
            onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
            maxLength='19'
          />
          {errors.cardNumber && formTouched && (
            <p className='mt-1 text-xs text-red-500'>{errors.cardNumber}</p>
          )}
        </div>

        <div className='mb-4 grid grid-cols-2 gap-4'>
          <div>
            <label
              htmlFor='cardExpiry'
              className='mb-2 block text-sm font-medium text-gray-700'>
              Expiry Date (MM/YY)
            </label>
            <input
              type='text'
              id='cardExpiry'
              className={`w-full rounded-md border ${errors.cardExpiry && formTouched ? 'border-red-500' : 'border-gray-300'} px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500`}
              placeholder='MM/YY'
              value={cardExpiry}
              onChange={(e) => setCardExpiry(formatExpiry(e.target.value))}
              maxLength='5'
            />
            {errors.cardExpiry && formTouched && (
              <p className='mt-1 text-xs text-red-500'>{errors.cardExpiry}</p>
            )}
          </div>

          <div>
            <label
              htmlFor='cardCVV'
              className='mb-2 block text-sm font-medium text-gray-700'>
              CVV
            </label>
            <input
              type='text'
              id='cardCVV'
              className={`w-full rounded-md border ${errors.cardCVV && formTouched ? 'border-red-500' : 'border-gray-300'} px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500`}
              placeholder='123'
              value={cardCVV}
              onChange={(e) =>
                setCardCVV(e.target.value.replace(/[^0-9]/g, ''))
              }
              maxLength='4'
            />
            {errors.cardCVV && formTouched && (
              <p className='mt-1 text-xs text-red-500'>{errors.cardCVV}</p>
            )}
          </div>
        </div>

        <div className='mb-4'>
          <label
            htmlFor='cardName'
            className='mb-2 block text-sm font-medium text-gray-700'>
            Name on Card
          </label>
          <input
            type='text'
            id='cardName'
            className={`w-full rounded-md border ${errors.cardName && formTouched ? 'border-red-500' : 'border-gray-300'} px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500`}
            placeholder='John Doe'
            value={cardName}
            onChange={(e) => setCardName(e.target.value)}
          />
          {errors.cardName && formTouched && (
            <p className='mt-1 text-xs text-red-500'>{errors.cardName}</p>
          )}
        </div>

        <div className='flex items-center text-xs text-gray-500'>
          <LockIcon />
          <span className='ml-1'>
            Your card information is secure and encrypted
          </span>
        </div>
      </div>
    )
  }

  const renderPayPalFields = () => {
    if (selectedMethod !== 'PayPal') return null

    return (
      <div className='mt-4 rounded-lg border border-gray-200 bg-gray-50 p-4'>
        <div className='mb-4'>
          <label
            htmlFor='paypalEmail'
            className='mb-2 block text-sm font-medium text-gray-700'>
            PayPal Email
          </label>
          <input
            type='email'
            id='paypalEmail'
            className={`w-full rounded-md border ${errors.paypalEmail && formTouched ? 'border-red-500' : 'border-gray-300'} px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500`}
            placeholder='your-email@example.com'
            value={paypalEmail}
            onChange={(e) => setPaypalEmail(e.target.value)}
          />
          {errors.paypalEmail && formTouched && (
            <p className='mt-1 text-xs text-red-500'>{errors.paypalEmail}</p>
          )}
        </div>

        <p className='text-xs text-gray-500'>
          You&apos;ll be redirected to PayPal to complete your payment securely.
        </p>
      </div>
    )
  }

  const renderBankTransferFields = () => {
    if (selectedMethod !== 'Bank Transfer') return null

    return (
      <div className='mt-4 rounded-lg border border-gray-200 bg-gray-50 p-4'>
        <div className='mb-4'>
          <label
            htmlFor='bankName'
            className='mb-2 block text-sm font-medium text-gray-700'>
            Bank Name
          </label>
          <input
            type='text'
            id='bankName'
            className={`w-full rounded-md border ${errors.bankName && formTouched ? 'border-red-500' : 'border-gray-300'} px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500`}
            placeholder='Bank of America'
            value={bankName}
            onChange={(e) => setBankName(e.target.value)}
          />
          {errors.bankName && formTouched && (
            <p className='mt-1 text-xs text-red-500'>{errors.bankName}</p>
          )}
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
            className={`w-full rounded-md border ${errors.accountNumber && formTouched ? 'border-red-500' : 'border-gray-300'} px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500`}
            placeholder='000123456789'
            value={accountNumber}
            onChange={(e) =>
              setAccountNumber(e.target.value.replace(/[^0-9]/g, ''))
            }
          />
          {errors.accountNumber && formTouched && (
            <p className='mt-1 text-xs text-red-500'>{errors.accountNumber}</p>
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
            className={`w-full rounded-md border ${errors.routingNumber && formTouched ? 'border-red-500' : 'border-gray-300'} px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500`}
            placeholder='123456789'
            value={routingNumber}
            onChange={(e) =>
              setRoutingNumber(e.target.value.replace(/[^0-9]/g, ''))
            }
            maxLength='9'
          />
          {errors.routingNumber && formTouched && (
            <p className='mt-1 text-xs text-red-500'>{errors.routingNumber}</p>
          )}
        </div>

        <p className='text-xs text-gray-500'>
          Bank transfers typically take 1-3 business days to process.
        </p>
      </div>
    )
  }

  if (depositSuccess) {
    return (
      <div className='payment-deposit-form mb-8 rounded-lg bg-white p-6 shadow-md'>
        <h2 className='mb-4 text-xl font-semibold'>Payment Successful</h2>
        <div className='rounded-md bg-green-100 p-4 text-green-800'>
          <div className='flex items-center'>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              className='mr-2 h-5 w-5'
              viewBox='0 0 20 20'
              fill='currentColor'>
              <path
                fillRule='evenodd'
                d='M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z'
                clipRule='evenodd'
              />
            </svg>
            <span className='font-medium'>Transaction Complete!</span>
          </div>
          <p className='mt-2'>
            Successfully added ${amount} to your wallet using {selectedMethod}.
          </p>
          <p className='mt-1 text-sm'>
            Transaction ID:{' '}
            {Math.random().toString(36).substring(2, 10).toUpperCase()}
          </p>
          <p className='mt-3 text-sm'>
            Your updated balance will reflect in your account shortly.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className='payment-deposit-form mb-8 rounded-lg bg-white p-6 shadow-md'>
      <h2 className='mb-4 text-xl font-semibold'>Add Money to Wallet</h2>
      <form onSubmit={handleSubmit}>
        <div className='mb-4'>
          <label
            htmlFor='amount'
            className='mb-2 block text-sm font-medium text-gray-700'>
            Amount
          </label>
          <div className='relative'>
            <div className='pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3'>
              <span className='text-gray-500 sm:text-sm'>$</span>
            </div>
            <input
              type='number'
              id='amount'
              className={`w-full rounded-md border ${errors.amount && formTouched ? 'border-red-500' : 'border-gray-300'} px-3 py-2 pl-7 focus:outline-none focus:ring-2 focus:ring-indigo-500`}
              placeholder='0.00'
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              min='5'
              step='0.01'
              required
            />
          </div>
          {errors.amount && formTouched && (
            <p className='mt-1 text-xs text-red-500'>{errors.amount}</p>
          )}
        </div>

        {/* Payment Method Selector */}
        {renderPaymentMethodSelector()}

        {/* Conditional Payment Fields */}
        {renderCreditCardFields()}
        {renderPayPalFields()}
        {renderBankTransferFields()}

        {/* Fee Information */}
        <div className='my-4 rounded-md bg-gray-50 p-3'>
          <div className='flex justify-between text-sm'>
            <span className='text-gray-600'>Subtotal:</span>
            <span>${amount || '0.00'}</span>
          </div>
          <div className='flex justify-between text-sm'>
            <span className='text-gray-600'>Processing Fee (1.5%):</span>
            <span>${processingFee}</span>
          </div>
          <div className='mt-2 flex justify-between font-medium'>
            <span>Total:</span>
            <span>${totalAmount}</span>
          </div>
        </div>

        {error && (
          <div className='mb-4 rounded-md bg-red-100 p-4 text-red-800'>
            {error}
          </div>
        )}

        <div className='mb-4 flex items-center text-xs text-gray-500'>
          <LockIcon />
          <span className='ml-1'>
            All transactions are secure and encrypted
          </span>
        </div>

        <button
          type='submit'
          className='w-full rounded-md bg-green-600 px-4 py-3 font-medium text-white transition duration-300 hover:bg-green-700 disabled:bg-gray-400'
          disabled={depositLoading}>
          {depositLoading ? (
            <span className='flex items-center justify-center'>
              <svg
                className='-ml-1 mr-3 h-5 w-5 animate-spin text-white'
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
              Processing Payment...
            </span>
          ) : (
            `Pay $${totalAmount}`
          )}
        </button>
      </form>
    </div>
  )
}

PaymentDepositForm.propTypes = {
  onClose: PropTypes.func.isRequired,
}

export default PaymentDepositForm
