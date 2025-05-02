import PropTypes from 'prop-types'

function PaymentWithdrawForm({
  withdrawAmount,
  setWithdrawAmount,
  bankDetails,
  setBankDetails,
  walletBalance,
  error,
  withdrawLoading,
  withdrawSuccess,
  handleWithdrawSubmit
}) {
  if (withdrawSuccess) {
    return (
      <div className='payment-withdraw-form mb-8 rounded-lg bg-white p-6 shadow-md'>
        <h2 className='mb-4 text-xl font-semibold'>Withdraw Money</h2>
        <div className='rounded-md bg-green-100 p-4 text-green-800'>
          Successfully requested withdrawal of ${withdrawAmount}. It
          will be processed within 1-3 business days.
        </div>
      </div>
    )
  }

  return (
    <div className='payment-withdraw-form mb-8 rounded-lg bg-white p-6 shadow-md'>
      <h2 className='mb-4 text-xl font-semibold'>Withdraw Money</h2>
      <form onSubmit={handleWithdrawSubmit}>
        <div className='mb-4'>
          <label
            htmlFor='withdrawAmount'
            className='mb-2 block text-sm font-medium text-gray-700'
          >
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
            className='mb-2 block text-sm font-medium text-gray-700'
          >
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
            className='mb-2 block text-sm font-medium text-gray-700'
          >
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
            className='mb-2 block text-sm font-medium text-gray-700'
          >
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
          }
        >
          {withdrawLoading ? 'Processing...' : 'Withdraw Money'}
        </button>
      </form>
    </div>
  )
}

PaymentWithdrawForm.propTypes = {
  withdrawAmount: PropTypes.string.isRequired,
  setWithdrawAmount: PropTypes.func.isRequired,
  bankDetails: PropTypes.object.isRequired,
  setBankDetails: PropTypes.func.isRequired,
  walletBalance: PropTypes.number.isRequired,
  error: PropTypes.string,
  withdrawLoading: PropTypes.bool.isRequired,
  withdrawSuccess: PropTypes.bool.isRequired,
  handleWithdrawSubmit: PropTypes.func.isRequired
}

export default PaymentWithdrawForm