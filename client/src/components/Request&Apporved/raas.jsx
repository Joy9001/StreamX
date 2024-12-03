import { useSelector } from 'react-redux'
import { useState } from 'react'
import Navbar from '../NavBar/Navbar.jsx'
import ContentTable from './RAContentTable.jsx'
import RaContentTableApprove from './RaContentTableApprove.jsx'
import RaasNav from './raasNav.jsx'

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
        <Navbar title='Storage' />
      </div>
      <div className={`storage-container flex flex-grow`}>
        <div
          className={`storage-main flex-grow p-2 transition-all duration-300 ${
            drawer ? 'mr-4' : 'mr-0'
          }`}>
          <RaasNav />
          <div className='flex justify-between p-2'>
            <div>
              <button 
                onClick={() => setShowApproved(!showApproved)}
                className={`mx-4 rounded px-4 py-2 text-white transition duration-300 hover:border-2 ${
                  showApproved ? 'bg-green-500' : 'bg-blue-500'
                }`}
              >
                {showApproved ? 'Request Section' : 'Approve Section'}
              </button>
            </div>
          </div>
          <div className='storage-content mt-2'>
            <div className='storage-content-header mb-4'>
              <span className='text-xl font-semibold'>
                {showApproved ? 'Approved Requests' : 'All Requests'}
              </span>
            </div>
            <div className='storage-content-body'>
              {showApproved ? <RaContentTableApprove /> : <ContentTable />}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RequestApprove
