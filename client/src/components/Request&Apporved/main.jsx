import { useState } from 'react'
import { useRecoilValue } from 'recoil'
import { drawerState } from '../../states/drawerState.js'
import { navbarOpenState } from '../../states/navbarState.js'
import Navbar from '../Navbar'
import ContentTable from './ContentTable.jsx'
import ApprovalTable from './ApprovalTable.jsx'
import RaasNav from './raasNav.jsx'

const main = () => {
  const navOpen = useRecoilValue(navbarOpenState)
  const drawer = useRecoilValue(drawerState)
  const [isApprovalTable, setIsApprovalTable] = useState(false)

  const handleTableChange = () => {
    setIsApprovalTable(!isApprovalTable)
  }

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
            <div>Videos details</div>
            <div>
              <button
                className='mx-4 rounded bg-blue-500 px-4 py-2 text-white transition duration-300'
                onClick={() => {
                  handleTableChange()
                }}>
                {isApprovalTable ? 'Request Section' : 'Approval Section'}
              </button>
              {/* <button className='mx-4 rounded bg-blue-500 px-4 py-2 text-white transition duration-300'>
                New Request
              </button> */}
            </div>
          </div>
          <div className='storage-content mt-2'>
            <div className='storge-content-header m-2'>
              <span className='text-xl font-semibold'>{!isApprovalTable ? 'Request Section' : 'Approval Section'}</span>
            </div>
            <div className='storage-content-body'>
              {!isApprovalTable ? <ContentTable /> : <ApprovalTable />}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default main
