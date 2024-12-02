import { useSelector } from 'react-redux'
import Navbar from '../NavBar/Navbar.jsx'
import ContentTable from './ContentTable.jsx'
import RaasNav from './raasNav.jsx'

const RequestApprove = () => {
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
          {/* Inside Nav */}
          <RaasNav />
          <div className='flex justify-between p-2'>
            <div>Description.......... jnlgajngf;fd nvljnaljks</div>
            <div>
              <button className='mx-4 rounded bg-blue-500 px-4 py-2 text-white transition duration-300 hover:border-2'>
                New Request
              </button>
            </div>
          </div>
          <div className='storage-content mt-2'>
            <div className='storge-content-header m-2'>
              <span className='text-xl font-semibold'>My Videos</span>
            </div>
            <div className='storage-content-body'>
              <ContentTable />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RequestApprove
