import PropTypes from 'prop-types'

function PaymentDepositForm({ 
  depositAmount, 
  setDepositAmount, 
  selectedPaymentMethod, 
  setSelectedPaymentMethod, 
  paymentMethods, 
  error, 
  depositLoading, 
  depositSuccess, 
  handleDepositSubmit 
}) {
  if (depositSuccess) {
    return (
      <div className='payment-deposit-form mb-8 rounded-lg bg-white p-6 shadow-md'>
        <h2 className='mb-4 text-xl font-semibold'>Add Money to Wallet</h2>
        <div className='rounded-md bg-green-100 p-4 text-green-800'>
          Successfully added ${depositAmount} to your wallet!
        </div>
      </div>
    )
  }

  return (
    <div className='payment-deposit-form mb-8 rounded-lg bg-white p-6 shadow-md'>
      <h2 className='mb-4 text-xl font-semibold'>Add Money to Wallet</h2>
      <form onSubmit={handleDepositSubmit}>
        <div className='mb-4'>
          <label
            htmlFor='amount'
            className='mb-2 block text-sm font-medium text-gray-700'
          >
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
            className='mb-2 block text-sm font-medium text-gray-700'
          >
            Payment Method
          </label>
          <select
            id='paymentMethod'
            className='w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500'
            value={selectedPaymentMethod}
            onChange={(e) => setSelectedPaymentMethod(e.target.value)}
          >
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
          disabled={depositLoading}
        >
          {depositLoading ? 'Processing...' : 'Add Money'}
        </button>
      </form>
    </div>
  )
}

PaymentDepositForm.propTypes = {
  depositAmount: PropTypes.string.isRequired,
  setDepositAmount: PropTypes.func.isRequired,
  selectedPaymentMethod: PropTypes.string.isRequired,
  setSelectedPaymentMethod: PropTypes.func.isRequired,
  paymentMethods: PropTypes.array.isRequired,
  error: PropTypes.string,
  depositLoading: PropTypes.bool.isRequired,
  depositSuccess: PropTypes.bool.isRequired,
  handleDepositSubmit: PropTypes.func.isRequired
}

export default PaymentDepositForm