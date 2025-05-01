import { useState } from 'react'
import { useSelector } from 'react-redux'
import Navbar from '../NavBar/Navbar.jsx'
import ApproveTable from './ApproveTable.jsx'
import RaasNav from './RaasNav.jsx'
import ContentTable from './RaContentTable.jsx'
import ErrorBoundary from './ErrorBoundary.jsx'
import { Send, Inbox } from 'lucide-react'

const RequestApprove = () => {
  const [showApproved, setShowApproved] = useState(false)
  const navOpen = useSelector((state) => state.ui.navbarOpen)
  const drawer = useSelector((state) => state.ui.drawer)

  return (
    <div className='storage-main flex h-screen'>
      <div
        className={`navbar h-full transition-all duration-300 ${
          navOpen ? 'w-[15%]' : 'w-[5%]'
        } pl-0`}>
        <Navbar title='Request & Approve' />
      </div>
      <div className={`storage-container flex flex-grow`}>
        <div
          className={`storage-main flex-grow p-4 transition-all duration-300 ${
            drawer ? 'mr-4' : 'mr-0'
          }`}>
          <RaasNav />

          <div className='mb-8 mt-6'>
            <div className='mx-auto max-w-md overflow-hidden rounded-xl bg-white shadow-lg'>
              <div className='flex'>
                <button
                  onClick={() => setShowApproved(false)}
                  className={`group relative flex flex-1 items-center justify-center gap-2 border-b-2 px-6 py-4 transition-all duration-300 ${
                    !showApproved
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-transparent text-gray-500 hover:bg-gray-50 hover:text-gray-700'
                  }`}>
                  <Send
                    className={`h-5 w-5 transition-all duration-300 ${!showApproved ? 'text-blue-500' : 'text-gray-400 group-hover:text-gray-500'}`}
                  />
                  <span className='font-medium'>My Requests</span>

                  {!showApproved && (
                    <span className='absolute -bottom-[1px] left-0 h-0.5 w-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]'></span>
                  )}
                </button>

                <button
                  onClick={() => setShowApproved(true)}
                  className={`group relative flex flex-1 items-center justify-center gap-2 border-b-2 px-6 py-4 transition-all duration-300 ${
                    showApproved
                      ? 'border-green-500 bg-green-50 text-green-700'
                      : 'border-transparent text-gray-500 hover:bg-gray-50 hover:text-gray-700'
                  }`}>
                  <Inbox
                    className={`h-5 w-5 transition-all duration-300 ${showApproved ? 'text-green-500' : 'text-gray-400 group-hover:text-gray-500'}`}
                  />
                  <span className='font-medium'>Approve Requests</span>

                  {showApproved && (
                    <span className='absolute -bottom-[1px] left-0 h-0.5 w-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]'></span>
                  )}
                </button>
              </div>

              <div className='bg-gradient-to-r from-blue-50 via-purple-50 to-green-50 px-6 py-3'>
                <p className='text-center text-sm text-gray-600'>
                  {showApproved
                    ? 'Review and approve requests sent to you'
                    : 'Track the status of requests you have sent'}
                </p>
              </div>
            </div>
          </div>

          <div
            className={`storage-content flex min-h-[600px] flex-col rounded-lg border border-gray-100 bg-white p-6 shadow-sm transition-all duration-300 ${
              showApproved
                ? 'border-t-4 border-t-green-500'
                : 'border-t-4 border-t-blue-500'
            }`}>
            <div className='storage-content-header mb-4 border-b border-gray-100 pb-4'>
              <h2 className='flex items-center text-xl font-semibold text-gray-800'>
                {showApproved ? (
                  <>
                    <div className='mr-3 flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-green-400 to-emerald-600 shadow-md'>
                      <Inbox className='h-5 w-5 text-white' />
                    </div>
                    <span>Approve Incoming Requests</span>
                    <div className='ml-3 rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-800'>
                      Approval Section
                    </div>
                  </>
                ) : (
                  <>
                    <div className='mr-3 flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-400 to-indigo-600 shadow-md'>
                      <Send className='h-5 w-5 text-white' />
                    </div>
                    <span>My Sent Requests</span>
                    <div className='ml-3 rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800'>
                      Request Section
                    </div>
                  </>
                )}
              </h2>
            </div>
            <div className='storage-content-body flex-1'>
              <ErrorBoundary>
                {showApproved ? <ApproveTable /> : <ContentTable />}
              </ErrorBoundary>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RequestApprove
