import React, { useState } from 'react'
import profileData from '../../data/profileData.json'
import UploadedVideosList from './UploadedVideosList'
import SocialLinks from './SocialLinks'
import StorageCard from './StorageCard'
import HiredEditorsCard from '../HiredEditorsCard'
import RequestsCard from './RequestsCard'
import ProfileForm from './ProfileForm'

const membershipStyles = {
  Free: 'bg-white text-gray-700 border border-gray-300',
  Bronze: 'bg-amber-700 text-white',
  Silver: 'bg-gray-400 text-white',
  Gold: 'bg-yellow-500 text-white',
}

function UiProfile() {
  const [currentProfileIndex, setCurrentProfileIndex] = useState(1)
  const [showProfileForm, setShowProfileForm] = useState(false)
  const currentProfile = profileData.profiles[currentProfileIndex]

  return (
    <>
      <div id='webcrumbs' className='no-scrollbar overflow-auto'>
        <div className='w-full rounded-lg bg-white p-8'>
          <div className='flex gap-8'>
            <div className='w-[300px] rounded-lg bg-white p-6 shadow-lg transition-all duration-300 ease-in-out hover:-translate-y-1 hover:shadow-xl'>
              <img
                src={currentProfile.profilePicture}
                alt={currentProfile.name}
                className='border-primary-100 mx-auto block h-[100px] w-[100px] rounded-full border-4 object-cover'
              />
              <h2 className='mt-4 text-center text-xl font-bold text-gray-800'>
                {currentProfile.name}
              </h2>
              <p className='text-center text-gray-600'>
                {currentProfile.ytChannelName}
              </p>
              <div className='mt-2 flex justify-center'>
                <span
                  className={`rounded-full px-3 py-1 text-sm font-medium ${membershipStyles[currentProfile.membership]}`}>
                  {currentProfile.membership}
                </span>
              </div>
              <p className='mt-1 text-center text-sm text-gray-500'>
                {currentProfile.bio}
              </p>
              <div className='mt-6'>
                <button
                  onClick={() => setShowProfileForm(true)}
                  className='btn w-full border-none bg-pink-200 text-gray-700 hover:bg-pink-300'>
                  EDIT PROFILE
                </button>
              </div>
            </div>

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
