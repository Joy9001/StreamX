import PropTypes from 'prop-types'

function PaymentBalanceCard({
  walletBalance,
  loading,
  toggleDepositForm,
  toggleWithdrawForm,
}) {
  return (
    <div className='payment-balance-card mb-8 rounded-lg bg-white p-6 shadow-md'>
      <div className='flex items-center justify-between'>
        <div>
          <h2 className='text-xl font-semibold text-gray-700'>
            Current Balance
          </h2>
          <p className='mt-2 text-4xl font-bold text-indigo-600'>
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
  )
}

PaymentBalanceCard.propTypes = {
  walletBalance: PropTypes.number.isRequired,
  loading: PropTypes.bool.isRequired,
  toggleDepositForm: PropTypes.func.isRequired,
  toggleWithdrawForm: PropTypes.func.isRequired,
}

export default PaymentBalanceCard
