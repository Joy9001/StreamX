import { useDispatch, useSelector } from 'react-redux'
import { setCurrentPage } from '../../store/slices/paymentSlice'

function PaymentTransactionHistory() {
  const dispatch = useDispatch()
  const { transactions, transactionsLoading, currentPage, totalTransactions } =
    useSelector((state) => state.payment)

  // Calculate total pages
  const pageSize = 10 // This could be moved to a constant or config
  const totalPages = Math.ceil(totalTransactions / pageSize)

  const handlePageChange = (newPage) => {
    dispatch(setCurrentPage(newPage))
  }

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

  return (
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
  )
}

export default PaymentTransactionHistory
