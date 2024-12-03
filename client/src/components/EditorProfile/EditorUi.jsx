import React, { useState } from 'react'
import Navbar from '../NavBar/Navbar'
import ProfileHeader from '../OwnerProfile/ProfileHeader'
import EditorProfileCard from './EditorProfileCard'
import UploadedVideosList from '../OwnerProfile/UploadedVideosList'
import SocialLinks from '../OwnerProfile/SocialLinks'
import StorageCard from '../OwnerProfile/StorageCard'
import HiredByCard from './HiredByCard'
import RequestsCard from '../OwnerProfile/RequestsCard'
import EditorProfileForm from './EditorProfileForm'
import editorData from '../../data/editorData.json'
import { useSelector } from 'react-redux'

function EditorUi() {
  const [currentEditorIndex, setCurrentEditorIndex] = useState(0)
  const [showProfileForm, setShowProfileForm] = useState(false)
  const currentEditor = editorData.editors[currentEditorIndex]
  const navOpen = useSelector((state) => state.ui.navbarOpen)

  return (
    <div className="flex h-screen">
      <div className={`navbar h-full transition-all duration-300 ${
        navOpen ? 'w-[15%]' : 'w-[5%]'
      } pl-0`}>
        <Navbar title='Editor Profile'/>
      </div>
      <div className="flex-1 flex flex-col">
        <ProfileHeader />
        <div id='webcrumbs' className='no-scrollbar overflow-auto'>
          <div className='w-full rounded-lg bg-white p-8'>
            <div className='flex gap-8'>
              <EditorProfileCard 
                editor={currentEditor} 
                onEditProfile={() => setShowProfileForm(true)}
              />

              <div className='no-scrollbar flex-1 overflow-hidden shadow-lg transition-all duration-300 ease-in-out hover:-translate-y-1 hover:shadow-xl'>
                <UploadedVideosList videos={currentEditor?.portfolio || []} />
              </div>
            </div>

            <div className='mt-8 flex gap-8'>
              <SocialLinks profile={currentEditor} />

              <div className='flex flex-1 gap-4'>
                <StorageCard />
                <HiredByCard hiredByList={currentEditor?.hiredBy || []} />
                <RequestsCard />
              </div>
            </div>
          </div>
        </div>

        {/* Profile Form Modal */}
        <dialog
          id='profile_modal'
          className={`modal ${showProfileForm ? 'modal-open' : ''}`}>
          <div className='no-scrollbar modal-box max-h-[90vh] w-11/12 max-w-5xl overflow-y-auto'>
            <form method='dialog'>
              <button
                className='btn btn-circle btn-ghost btn-sm absolute right-2 top-2'
                onClick={() => setShowProfileForm(false)}>
                ✕
              </button>
            </form>
            <EditorProfileForm initialData={currentEditor} onClose={() => setShowProfileForm(false)} />
          </div>
          <form method='dialog' className='modal-backdrop'>
            <button onClick={() => setShowProfileForm(false)}>close</button>
          </form>
        </dialog>
      </div>
    </div>
  )
}

export default EditorUi