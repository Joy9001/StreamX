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
  Gold: 'bg-yellow-500 text-white'
}

function UiProfile() {
  const [currentProfileIndex, setCurrentProfileIndex] = useState(1)
  const [showProfileForm, setShowProfileForm] = useState(false)
  const currentProfile = profileData.profiles[currentProfileIndex]

  return (
    <>
      <div id="webcrumbs" className='overflow-auto no-scrollbar'> 
        <div className="w-full p-8 rounded-lg bg-white">  
          <div className="flex gap-8">
            <div className="w-[300px] bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out hover:-translate-y-1">
              <img
                src={currentProfile.profilePicture}
                alt={currentProfile.name}
                className="block mx-auto w-[100px] h-[100px] rounded-full object-cover border-4 border-primary-100"
              />
              <h2 className="text-center text-xl font-bold mt-4 text-gray-800">{currentProfile.name}</h2>
              <p className="text-center text-gray-600">{currentProfile.ytChannelName}</p>
              <div className="flex justify-center mt-2">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${membershipStyles[currentProfile.membership]}`}>
                  {currentProfile.membership}
                </span>
              </div>
              <p className="text-center text-gray-500 text-sm mt-1">
                {currentProfile.bio}
              </p>
              <div className="mt-6">
                <button 
                  onClick={() => setShowProfileForm(true)}
                  className="btn bg-pink-200 hover:bg-pink-300 border-none w-full text-gray-700"
                >
                  EDIT PROFILE
                </button>
              </div>
            </div>
      
            <div className="flex-1 overflow-hidden no-scrollbar shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out hover:-translate-y-1">
              <UploadedVideosList videos={currentProfile?.uploadedVideos} />
            </div>
          </div>
      
          <div className="flex gap-8 mt-8">
            <SocialLinks profile={currentProfile} />
      
            <div className="flex gap-4 flex-1">
              <StorageCard />
              <HiredEditorsCard />
              <RequestsCard />
            </div>
          </div>
        </div>
      </div>

      {/* Profile Form Modal */}
      <dialog id="profile_modal" className={`modal ${showProfileForm ? 'modal-open' : ''}`}>
        <div className="modal-box w-11/12 max-w-5xl overflow-y-auto no-scrollbar max-h-[90vh]">
          <form method="dialog">
            <button 
              className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
              onClick={() => setShowProfileForm(false)}
            >
              ✕
            </button>
          </form>
          <ProfileForm />
        </div>
        <form method="dialog" className="modal-backdrop">
          <button onClick={() => setShowProfileForm(false)}>close</button>
        </form>
      </dialog>
    </>
  )
}

export default UiProfile
