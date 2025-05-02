import { useAuth0 } from '@auth0/auth0-react'
import {
  AlertCircle,
  CheckCircle,
  Clock,
  FileText,
  Film,
  IndianRupee,
  MessageSquare,
  Settings,
  ThumbsUp,
  User,
  Wallet,
  XCircle,
} from 'lucide-react'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  clearAllMessages,
  fetchMessageCounts,
} from '../../store/slices/messageSlice'
import { fetchWalletBalance } from '../../store/slices/paymentSlice'
import {
  approveRequest,
  fetchRequestsToUser,
  rejectRequest,
} from '../../store/slices/requestSlice'
import MessageThread from './MessageThread'

function ApproveTable() {
  const { getAccessTokenSilently } = useAuth0()
  const dispatch = useDispatch()
  const { receivedRequests, loading, error } = useSelector(
    (state) => state.requests
  )
  const { messageCounts } = useSelector((state) => state.messages)
  const { userData } = useSelector((state) => state.user)
  const { walletBalance, loading: walletLoading } = useSelector(
    (state) => state.payment
  )
  const userRole = userData?.user_metadata?.role
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [requestToApprove, setRequestToApprove] = useState(null)
  const isEditor = userRole === 'Editor'

  // Reset messages when component mounts
  useEffect(() => {
    dispatch(clearAllMessages())
  }, [dispatch])

  useEffect(() => {
    const fetchData = async () => {
      if (!userData) return

      // Extract the MongoDB ID - depending on your data structure
      const userId = userData._id || userData.sub || userData.id

      if (!userId) {
        console.error('No valid user ID found in userData:', userData)
        return
      }

      try {
        const accessToken = await getAccessTokenSilently()
        console.log(
          `Fetching ${isEditor ? 'editor' : ''} requests to approve with ID:`,
          userId
        )
        dispatch(
          fetchRequestsToUser({
            id: userId,
            accessToken,
          })
        )
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }

    fetchData()
  }, [dispatch, getAccessTokenSilently, userData, isEditor])

  // Fetch message counts for all requests when requests are loaded
  useEffect(() => {
    const fetchCounts = async () => {
      if (!receivedRequests || receivedRequests.length === 0 || !userData)
        return

      try {
        const accessToken = await getAccessTokenSilently()
        const requestIds = receivedRequests.map((request) => request._id)

        dispatch(
          fetchMessageCounts({
            requestIds,
            accessToken,
          })
        )
      } catch (error) {
        console.error('Error fetching message counts:', error)
      }
    }

    fetchCounts()
  }, [receivedRequests, getAccessTokenSilently, userData, dispatch])

  // Fetch wallet balance for owners
  useEffect(() => {
    const fetchBalance = async () => {
      if (!userData || isEditor) return

      try {
        const accessToken = await getAccessTokenSilently()
        const userId = userData._id || userData.sub || userData.id

        if (!userId) {
          console.error('No valid user ID found in userData:', userData)
          return
        }

        dispatch(
          fetchWalletBalance({
            id: userId,
            accessToken,
          })
        )
      } catch (error) {
        console.error('Error fetching wallet balance:', error)
      }
    }

    fetchBalance()
  }, [dispatch, getAccessTokenSilently, userData, isEditor])

  const initiateApproval = (requestId, videoId, toId = null) => {
    // Get the request details from the receivedRequests array
    const request = receivedRequests.find((req) => req._id === requestId)
    if (!request) return

    // If the user is an owner, show the wallet balance confirmation
    if (!isEditor) {
      setRequestToApprove({ requestId, videoId, toId, price: request.price })
      setShowConfirmModal(true)
    } else {
      // Editors don't need wallet confirmation, proceed directly
      handleApprove(requestId, videoId, toId, request.price)
    }
  }

  const handleApprove = async (requestId, videoId, toId = null, price = 0) => {
    try {
      const accessToken = await getAccessTokenSilently()
      // Extract the correct user ID
      const userId = userData._id || userData.sub || userData.id

      if (!userId) {
        console.error('No valid user ID found in userData:', userData)
        return
      }

      console.log(`${isEditor ? 'Editor' : ''} approving request:`, {
        requestId,
        videoId,
        toId,
        userId,
        price,
      })

      const approveData = {
        requestId,
        videoId,
        userData: { ...userData, _id: userId },
        accessToken,
        userRole,
        price, // Include the price in the request data
      }

      // Only add toId for non-editor roles
      if (!isEditor && toId) {
        approveData.toId = toId
      }

      // Dispatch the approve action and handle the response
      const resultAction = await dispatch(approveRequest(approveData))

      // Close the confirmation modal
      setShowConfirmModal(false)

      // If the action was successful and we have transaction data, refresh the wallet balance
      if (
        !resultAction.error &&
        resultAction.payload?.transaction &&
        !isEditor
      ) {
        // Refresh wallet balance
        dispatch(
          fetchWalletBalance({
            id: userId,
            accessToken,
          })
        )
      }
    } catch (error) {
      console.error('Error approving request:', error)
      setShowConfirmModal(false)
    }
  }

  const handleReject = async (requestId) => {
    try {
      const accessToken = await getAccessTokenSilently()
      console.log('Rejecting request:', requestId)
      dispatch(
        rejectRequest({
          requestId,
          accessToken,
        })
      )
    } catch (error) {
      console.error('Error rejecting request:', error)
    }
  }

  // Function to get status style
  const getStatusStyle = (status) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800'
      case 'rejected':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-yellow-100 text-yellow-800'
    }
  }

  // Function to get status icon
  const getStatusIcon = (status) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className='mr-2 h-4 w-4 text-green-500' />
      case 'rejected':
        return <XCircle className='mr-2 h-4 w-4 text-red-500' />
      default:
        return <Clock className='mr-2 h-4 w-4 text-yellow-500' />
    }
  }

  // Component for wallet balance confirmation modal
  const WalletConfirmationModal = () => {
    if (!showConfirmModal || !requestToApprove) return null

    // Find the request in the receivedRequests array
    const request = receivedRequests.find(
      (req) => req._id === requestToApprove.requestId
    )
    if (!request) return null

    // Calculate new balance after transaction
    const newBalanceAfterTransaction = walletBalance - request.price

    return (
      <div className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50'>
        <div className='w-full max-w-md rounded-lg bg-white p-6 shadow-lg'>
          <div className='mb-4 flex items-center justify-between'>
            <h3 className='text-lg font-semibold text-gray-900'>
              Confirm Request Approval
            </h3>
            <button
              onClick={() => setShowConfirmModal(false)}
              className='rounded-full p-1 hover:bg-gray-200'>
              <XCircle className='h-5 w-5 text-gray-600' />
            </button>
          </div>

          <div className='mb-6 space-y-4'>
            <div className='rounded-lg bg-blue-50 p-3'>
              <div className='flex items-center space-x-3'>
                <Wallet className='h-8 w-8 text-blue-500' />
                <div>
                  <p className='text-sm text-gray-600'>
                    Current wallet balance
                  </p>
                  <p className='text-xl font-bold text-gray-900'>
                    <span className='flex items-center'>
                      <IndianRupee className='mr-1 h-4 w-4' />
                      {walletLoading ? '...' : walletBalance.toFixed(2)}
                    </span>
                  </p>
                </div>
              </div>
            </div>

            <div className='rounded-lg bg-gray-50 p-3'>
              <div className='mb-2 text-sm font-medium text-gray-700'>
                Request details:
              </div>
              <p className='mb-1 flex items-center text-sm text-gray-600'>
                <Film className='mr-2 h-4 w-4 text-gray-500' />
                Video: {request.video.title || 'Untitled Video'}
              </p>
              <p className='mb-1 flex items-center text-sm text-gray-600'>
                <User className='mr-2 h-4 w-4 text-gray-500' />
                Editor: {request.from?.name || 'Unknown Editor'}
              </p>
              <p className='flex items-center font-medium text-gray-900'>
                <IndianRupee className='mr-2 h-4 w-4 text-green-600' />
                Price: {request.price}
              </p>
            </div>

            {/* Transaction summary */}
            <div className='rounded-lg bg-green-50 p-3'>
              <div className='mb-2 text-sm font-medium text-gray-700'>
                Transaction summary:
              </div>
              <div className='space-y-2 text-sm'>
                <div className='flex justify-between'>
                  <span className='text-gray-600'>Current balance:</span>
                  <span className='font-medium text-gray-800'>
                    <span className='flex items-center'>
                      <IndianRupee className='mr-1 h-3 w-3' />
                      {walletLoading ? '...' : walletBalance.toFixed(2)}
                    </span>
                  </span>
                </div>
                <div className='flex justify-between'>
                  <span className='text-gray-600'>Payment amount:</span>
                  <span className='font-medium text-red-600'>
                    <span className='flex items-center'>
                      - <IndianRupee className='mx-1 h-3 w-3' />
                      {request.price.toFixed(2)}
                    </span>
                  </span>
                </div>
                <div className='border-t border-gray-200 pt-2'>
                  <div className='flex justify-between'>
                    <span className='font-medium text-gray-700'>
                      New balance:
                    </span>
                    <span
                      className={`font-medium ${newBalanceAfterTransaction < 0 ? 'text-red-600' : 'text-green-600'}`}>
                      <span className='flex items-center'>
                        <IndianRupee className='mr-1 h-3 w-3' />
                        {newBalanceAfterTransaction.toFixed(2)}
                      </span>
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {request.price > walletBalance && (
              <div className='rounded-lg bg-red-50 p-3 text-sm text-red-700'>
                <div className='flex items-center'>
                  <AlertCircle className='mr-2 h-5 w-5 text-red-500' />
                  <span>
                    Warning: The request price exceeds your current wallet
                    balance. Please add funds to your wallet before approving.
                  </span>
                </div>
              </div>
            )}
          </div>

          <div className='flex justify-end space-x-3'>
            <button
              onClick={() => setShowConfirmModal(false)}
              className='btn rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50'>
              Cancel
            </button>
            <button
              onClick={() =>
                handleApprove(
                  requestToApprove.requestId,
                  requestToApprove.videoId,
                  requestToApprove.toId,
                  requestToApprove.price
                )
              }
              className='btn rounded-md bg-primary px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary/80 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
              disabled={loading || request.price > walletBalance}>
              {loading ? (
                <span className='flex items-center'>
                  <Clock className='mr-2 h-4 w-4 animate-spin' />
                  Processing...
                </span>
              ) : (
                'Confirm Payment & Approval'
              )}
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (loading || !userData) {
    return (
      <div className='flex h-64 items-center justify-center'>
        <div className='flex items-center rounded-lg bg-blue-50 p-4 text-blue-800'>
          <Clock className='mr-2 h-5 w-5 animate-spin text-blue-600' />
          <span className='font-medium'>Loading request data...</span>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className='flex h-64 items-center justify-center'>
        <div className='flex items-center rounded-lg bg-red-50 p-4 text-red-800'>
          <XCircle className='mr-2 h-5 w-5 text-red-600' />
          <span className='font-medium'>
            Error loading requests:{' '}
            {typeof error === 'object'
              ? error.message || 'Unknown error'
              : error}
          </span>
        </div>
      </div>
    )
  }

  // Determine header gradient and icon colors based on role
  const headerGradient = isEditor
    ? 'from-purple-50 to-indigo-50'
    : 'from-blue-50 to-indigo-50'
  const iconColor = isEditor ? 'text-purple-500' : 'text-indigo-500'
  const iconBgColor = isEditor ? 'bg-purple-100' : 'bg-indigo-100'
  const iconTextColor = isEditor ? 'text-purple-600' : 'text-indigo-600'

  return (
    <div className='flex h-full min-h-[500px] flex-col rounded-lg border border-gray-200 bg-white shadow-sm'>
      {/* Render confirmation modal */}
      <WalletConfirmationModal />

      <div className='flex flex-1 flex-col overflow-x-auto'>
        <table className='h-full w-full divide-y divide-gray-200'>
          <thead className={`bg-gradient-to-r ${headerGradient}`}>
            <tr>
              <th className='px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-700'>
                <div className='flex items-center'>
                  <Film className={`mr-2 h-4 w-4 ${iconColor}`} />
                  Video Name
                </div>
              </th>
              <th className='px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-700'>
                <div className='flex items-center'>
                  <User className={`mr-2 h-4 w-4 ${iconColor}`} />
                  {isEditor ? 'Owner Name' : 'Editor Name'}
                </div>
              </th>
              <th className='px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-700'>
                <div className='flex items-center'>
                  <FileText className={`mr-2 h-4 w-4 ${iconColor}`} />
                  Description
                </div>
              </th>
              <th className='px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-700'>
                <div className='flex items-center'>
                  <IndianRupee className={`mr-2 h-4 w-4 ${iconColor}`} />
                  Price
                </div>
              </th>
              <th className='px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-700'>
                <div className='flex items-center'>
                  <Clock className={`mr-2 h-4 w-4 ${iconColor}`} />
                  Status
                </div>
              </th>
              <th className='px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-700'>
                <div className='flex items-center'>
                  <MessageSquare className={`mr-2 h-4 w-4 ${iconColor}`} />
                  Negotiate
                </div>
              </th>
              <th className='px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-700'>
                <div className='flex items-center'>
                  <Settings className={`mr-2 h-4 w-4 ${iconColor}`} />
                  Action
                </div>
              </th>
            </tr>
          </thead>
          <tbody className='h-full divide-y divide-gray-200 bg-white'>
            {receivedRequests.length > 0 ? (
              receivedRequests.map((request) => {
                // For editors, the counterparty is in request.to
                // For content owners, the counterparty is in request.from
                const counterparty = isEditor ? request.to : request.from

                return (
                  <tr
                    key={request._id}
                    className='transition-colors duration-150 hover:bg-gray-50'>
                    <td className='whitespace-nowrap px-6 py-4'>
                      <div className='flex items-center'>
                        <div
                          className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full ${iconBgColor}`}>
                          <Film className={`h-5 w-5 ${iconTextColor}`} />
                        </div>
                        <div className='ml-4'>
                          <div className='text-sm font-medium text-gray-900'>
                            {request.video.title || 'Untitled Video'}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className='whitespace-nowrap px-6 py-4'>
                      <div className='flex items-center'>
                        <div className='h-8 w-8 flex-shrink-0 overflow-hidden rounded-full bg-gray-200'>
                          <img
                            src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                              counterparty?.name || 'User'
                            )}&background=random&color=fff`}
                            alt={counterparty?.name}
                            className='h-full w-full object-cover'
                          />
                        </div>
                        <div className='ml-3'>
                          <div className='text-sm font-medium text-gray-900'>
                            {counterparty?.name ||
                              (isEditor ? 'Unknown Owner' : 'Unknown Editor')}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className='px-6 py-4'>
                      <div className='max-w-xs text-sm text-gray-900'>
                        {request.description}
                      </div>
                    </td>
                    <td className='whitespace-nowrap px-6 py-4'>
                      <div className='text-sm font-medium text-gray-900'>
                        <span className='flex items-center rounded-full bg-green-50 px-2.5 py-1 text-green-700'>
                          <IndianRupee className='mr-1 h-3.5 w-3.5' />
                          {request.price}
                        </span>
                      </div>
                    </td>
                    <td className='whitespace-nowrap px-6 py-4'>
                      <span
                        className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${getStatusStyle(
                          request.status
                        )}`}>
                        {getStatusIcon(request.status)}
                        {request.status.charAt(0).toUpperCase() +
                          request.status.slice(1)}
                      </span>
                    </td>
                    <td className='whitespace-nowrap px-6 py-4'>
                      <MessageThread
                        requestId={request._id}
                        requestStatus={request.status}
                        messageCount={messageCounts[request._id] || 0}
                      />
                    </td>
                    <td className='whitespace-nowrap px-6 py-4 text-right text-sm'>
                      {request.status === 'pending' && (
                        <div className='flex space-x-2'>
                          <button
                            onClick={() =>
                              initiateApproval(
                                request._id,
                                request.video._id,
                                isEditor ? null : counterparty?._id
                              )
                            }
                            className='flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 transition-colors hover:bg-green-100'
                            disabled={loading}>
                            {loading ? (
                              <Clock className='mr-1 h-3 w-3 animate-spin' />
                            ) : (
                              <CheckCircle className='mr-1 h-3 w-3' />
                            )}
                            Approve
                          </button>
                          <button
                            onClick={() => handleReject(request._id)}
                            className='flex items-center rounded-md bg-red-50 px-2 py-1 text-xs font-medium text-red-700 transition-colors hover:bg-red-100'
                            disabled={loading}>
                            {loading ? (
                              <Clock className='mr-1 h-3 w-3 animate-spin' />
                            ) : (
                              <XCircle className='mr-1 h-3 w-3' />
                            )}
                            Reject
                          </button>
                        </div>
                      )}
                      {request.status === 'approved' && (
                        <span className='flex items-center text-xs text-green-600'>
                          <ThumbsUp className='mr-1 h-3 w-3' />
                          Approved
                        </span>
                      )}
                      {request.status === 'rejected' && (
                        <span className='flex items-center text-xs text-red-600'>
                          <XCircle className='mr-1 h-3 w-3' />
                          Rejected
                        </span>
                      )}
                    </td>
                  </tr>
                )
              })
            ) : (
              <tr className='h-full'>
                <td
                  colSpan='7'
                  className='h-full px-6 py-10 text-center text-sm text-gray-500'>
                  <div className='flex h-full min-h-[300px] flex-col items-center justify-center'>
                    <FileText className='mb-2 h-10 w-10 text-gray-400' />
                    <p className='font-medium'>No requests found</p>
                    <p className='mt-1 text-xs text-gray-400'>
                      When users send you requests, they will appear here
                    </p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default ApproveTable
