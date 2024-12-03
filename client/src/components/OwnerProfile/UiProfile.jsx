import React, { useState } from 'react'
import profileData from '../../data/profileData.json'
import UploadedVideosList from './UploadedVideosList'
import SocialLinks from './SocialLinks'
import StorageCard from './StorageCard'
import HiredEditorsCard from './HiredEditorsCard'
import RequestsCard from './RequestsCard'
import ProfileForm from './ProfileForm'
import ProfileCard from './ProfileCard'

function UiProfile() {
  const [currentProfileIndex, setCurrentProfileIndex] = useState(1)
  const [showProfileForm, setShowProfileForm] = useState(false)
  const currentProfile = profileData.profiles[currentProfileIndex]

  return (
    <>
      <div id='webcrumbs' className='no-scrollbar overflow-auto'>
        <div className='w-full rounded-lg bg-white p-8'>
          <div className='flex gap-8'>
            <ProfileCard 
              profile={currentProfile} 
              onEditProfile={() => setShowProfileForm(true)}
            />

            <div className='no-scrollbar flex-1 overflow-hidden shadow-lg transition-all duration-300 ease-in-out hover:-translate-y-1 hover:shadow-xl'>
              <UploadedVideosList videos={currentProfile?.uploadedVideos} />
            </div>
          </div>

          <div className='mt-8 flex gap-8'>
            <SocialLinks profile={currentProfile} />

            <div className='flex flex-1 gap-4'>
              <StorageCard />
              <HiredEditorsCard />
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
          <ProfileForm />
        </div>
        <form method='dialog' className='modal-backdrop'>
          <button onClick={() => setShowProfileForm(false)}>close</button>
        </form>
      </dialog>
    </>
  )
}

export default UiProfile
