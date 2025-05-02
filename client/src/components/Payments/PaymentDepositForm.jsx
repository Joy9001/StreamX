import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import PropTypes from 'prop-types'
import { addMoneyToWallet, resetPaymentErrors } from '../../store/slices/paymentSlice'

function PaymentDepositForm({ onClose }) {
  const dispatch = useDispatch()
  const { userData } = useSelector((state) => state.user)
  const { paymentMethods, depositLoading, depositSuccess, error } = useSelector(
    (state) => state.payment
  )

  const [amount, setAmount] = useState('')
  const [selectedMethod, setSelectedMethod] = useState('Credit Card')

  // Clean up on success
  useEffect(() => {
    if (depositSuccess) {
      const timer = setTimeout(() => {
        onClose()
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [depositSuccess, onClose])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!amount || parseFloat(amount) <= 0) {
      return
    }
    dispatch(resetPaymentErrors())
    dispatch(
      addMoneyToWallet({
        id: userData._id,
        amount: parseFloat(amount),
        paymentMethod: selectedMethod,
        accessToken: userData.accessToken,
      })
    )
  }

  if (depositSuccess) {
    return (
      <div className='payment-deposit-form mb-8 rounded-lg bg-white p-6 shadow-md'>
        <h2 className='mb-4 text-xl font-semibold'>Add Money to Wallet</h2>
        <div className='rounded-md bg-green-100 p-4 text-green-800'>
          Successfully added ${amount} to your wallet!
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
          <input
            type='number'
            id='amount'
            className='w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500'
            placeholder='Enter amount'
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
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
            value={selectedMethod}
            onChange={(e) => setSelectedMethod(e.target.value)}>
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
    </div>
  )
}

PaymentDepositForm.propTypes = {
  onClose: PropTypes.func.isRequired,
}

export default PaymentDepositForm
