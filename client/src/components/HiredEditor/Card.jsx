import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useAuth0 } from '@auth0/auth0-react'
import locationIcon from '../../assets/location.svg'
import languageIcon from '../../assets/language.svg'
import starIcon from '../../assets/star.svg'
import crossIcon from '../../assets/cross.svg'
import tickIcon from '../../assets/tick.svg'
import Drawer from '../Drawer.jsx'
import BookNowModal from './BookNowModal.jsx'
import {
  setSelectedEditor,
  setSelectedPlan,
  setSelectedVideo,
  setProjectDescription,
  setShowCustomPrice,
  setCustomPrice,
  toggleDrawer,
  toggleModel,
  resetBookingForm,
  sendBookingRequest
} from '../../store/slices/editorSlice'

function Card({ editor, userData }) {
  const dispatch = useDispatch()
  const { getAccessTokenSilently } = useAuth0()

  // Get state from Redux store
  const {
    selectedPlan,
    isDrawerOpen,
    isModelOpen,
    projectDescription,
    showCustomPrice,
    selectedVideo,
    ownerVideos,
    customPrice,
    currentVideoIndex = 0,
    sendingRequest,
    error
  } = useSelector((state) => state.editors)

  // Set this editor as the selected one when the model opens
  useEffect(() => {
    if (isModelOpen) {
      dispatch(setSelectedEditor(editor))
    }
  }, [isModelOpen, editor, dispatch])

  const plans = editor.plans
    ? {
      Basic: {
        price: `₹${editor.plans[0].basic.price}`,
        description: editor.plans[0].basic.desc,
        delivery: `${editor.plans[0].basic.deliveryTime} day delivery`,
        revisions: 'Unlimited revisions',
        availableSkills: editor.plans[0].basic.ServiceOptions,
      },
      Standard: {
        price: `₹${editor.plans[0].standard.price}`,
        description: editor.plans[0].standard.desc,
        delivery: `${editor.plans[0].standard.deliveryTime} day delivery`,
        revisions: 'Unlimited revisions',
        availableSkills: editor.plans[0].standard.ServiceOptions,
      },
      Premium: {
        price: `₹${editor.plans[0].premium.price}`,
        description: editor.plans[0].premium.desc,
        delivery: `${editor.plans[0].premium.deliveryTime} day delivery`,
        revisions: 'Unlimited revisions',
        availableSkills: editor.plans[0].premium.ServiceOptions,
      },
    }
    : {}

  const services = ['React', 'JavaScript', 'Tailwind CSS', 'Node.js', 'MongoDB']

  const videos = [
    'https://www.w3schools.com/html/mov_bbb.mp4',
    'https://www.w3schools.com/html/movie.mp4',
    'https://www.learningcontainer.com/wp-content/uploads/2020/05/sample-mp4-file.mp4',
  ]

  const handleVideoChange = (direction) => {
    let newIndex = direction === 'next'
      ? (currentVideoIndex + 1) % videos.length
      : (currentVideoIndex - 1 + videos.length) % videos.length

    // In a real implementation, you would add a reducer action for this
    // For now we'll use the current index from local component scope
  }

  const handleBookingSubmit = async (e) => {
    e.preventDefault()

    if (!selectedVideo) {
      alert('Please select a video to proceed')
      return
    }

    if (!projectDescription || projectDescription.trim() === '') {
      alert('Please provide a project description')
      return
    }

    const price = showCustomPrice
      ? Number(customPrice)
      : Number(plans[selectedPlan].price.replace('₹', ''))

    if (isNaN(price) || price <= 0) {
      alert('Please enter a valid price')
      return
    }

    try {
      const token = await getAccessTokenSilently()

      const requestData = {
        to_id: editor._id,
        video_id: selectedVideo._id,
        from_id: userData._id,
        description: projectDescription.trim(),
        price: price,
        status: 'pending',
      }

      dispatch(sendBookingRequest({ requestData, token }))
    } catch (error) {
      console.error('Error in booking submission:', error)
    }
  }

  return (
    <>
      {isDrawerOpen && (
        <div className='fixed inset-0 z-40 bg-gray-700 bg-opacity-30'></div>
      )}

      <div className='flex cursor-pointer'>
        <div className='Cards relative z-30 mb-10 ml-14 mt-10 flex h-[45vh] w-8/12 flex-col items-center border-2 border-solid border-gray-300 bg-white'>
          <div className='flex'>
            <div className='flex items-center'>
              <button
                onClick={() => handleVideoChange('prev')}
                className='mr-0 rounded-full p-2 text-black shadow-md transition hover:bg-gray-400'>
                &lt;
              </button>
              <div className='Profilevideo mt-2 h-60 w-60 flex-shrink-0 overflow-hidden'>
                <video
                  key={currentVideoIndex}
                  src={videos[currentVideoIndex]}
                  controls
                  className='h-full w-full object-cover'
                  muted
                  playsInline
                />
              </div>
              <button
                onClick={() => handleVideoChange('next')}
                className='rounded-full p-2 text-black shadow-md transition hover:bg-gray-400'>
                &gt;
              </button>
            </div>

            <div className='card-body'>
              <h2 className='card-title ml-4 text-3xl font-bold text-black'>
                {editor.name}
              </h2>
              <div className='ml-4 mt-2 flex items-center'>
                <img
                  src={locationIcon}
                  alt='Location'
                  className='mr-2 h-5 w-5'
                />
                <p className='font-bold'>{editor.address}</p>
                <div className='ml-6 flex'>
                  <img src={starIcon} alt='Rating' className='mr-2 h-5 w-5' />
                  <p>{editor.rating}</p>
                </div>
                <div className='ml-8 flex items-center'>
                  <img
                    src={languageIcon}
                    alt='Languages'
                    className='mr-2 h-5 w-5'
                  />
                  <p className='font-bold'>{editor.languages.join(', ')}</p>
                </div>
              </div>
              <div className='description mt-6 text-gray-800'>
                <p>
                  {editor.bio}...{' '}
                  <span className='text-blue-700'>Read More</span>
                </p>
              </div>
            </div>
          </div>
          <div className='skills mb-4 ml-4 mt-8 flex'>
            <div className='flex flex-wrap gap-2'>
              {editor.skills.map((skill, index) => (
                <span
                  key={index}
                  className='h-8 w-auto rounded-lg bg-gray-200 px-3 py-1 text-black'>
                  {skill}
                </span>
              ))}
            </div>
            <div className='w-50 ml-20 flex gap-4'>
              <button
                className='mr-4 rounded bg-blue-500 px-4 py-2 text-white transition hover:bg-blue-600'
                onClick={() => dispatch(toggleDrawer())}>
                View Profile
              </button>
              <button
                className='rounded bg-green-500 px-4 py-2 text-white transition hover:bg-green-600'
                onClick={() => dispatch(toggleModel(true))}>
                Book Now
              </button>
            </div>
          </div>
        </div>

        <div className='plan mr-20 mt-10 h-[45vh] max-w-80 border-2 border-solid border-gray-300 bg-white shadow-xl'>
          <div className='pricing-tabs mx-2 mt-8 grid grid-cols-3 gap-2'>
            {['Basic', 'Standard', 'Premium'].map((planName) => (
              <div
                key={planName}
                className={`cursor-pointer rounded-lg border border-gray-300 px-4 py-2 text-center ${selectedPlan === planName ? 'border-blue-500 shadow-lg' : ''
                  }`}
                onClick={() => dispatch(setSelectedPlan(planName))}>
                <p
                  className={
                    selectedPlan === planName
                      ? 'font-bold text-blue-700'
                      : 'text-gray-700'
                  }>
                  {planName}
                </p>
              </div>
            ))}
          </div>

          <div className='pricing-details mb-8 ml-6 mt-8'>
            <p className='mt-4 text-3xl font-bold text-black'>
              {plans[selectedPlan]?.price}
            </p>
            <p className='mr-4 mt-6 break-words text-black'>
              {plans[selectedPlan]?.description}
            </p>
            <div className='mt-2 flex'>
              <p className='mt-1 text-sm text-gray-500'>
                {plans[selectedPlan]?.delivery}
              </p>
              <p className='ml-6 mt-1 text-sm text-gray-500'>
                {plans[selectedPlan]?.revisions}
              </p>
            </div>

            <div className='skills mt-4'>
              <div className='mt-2 h-20 flex-col flex-wrap gap-2'>
                {services.map((skill, index) => (
                  <div key={index} className='flex items-center'>
                    {plans[selectedPlan]?.availableSkills?.includes(index) ? (
                      <>
                        <img
                          src={tickIcon}
                          alt='Available'
                          className='mr-2 h-4 w-4'
                        />
                        <span className='text-green-600'>{skill}</span>
                      </>
                    ) : (
                      <>
                        <img
                          src={crossIcon}
                          alt='Not Available'
                          className='mr-2 h-4 w-4'
                        />
                        <span className='text-gray-500'>{skill}</span>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {isDrawerOpen && (
        <div
          className={`fixed right-0 top-0 z-50 h-screen w-3/5 transform overflow-y-auto bg-white shadow-lg transition-transform ${isDrawerOpen ? 'translate-x-0' : 'translate-x-full'
            }`}>
          <div className='drawer-header flex justify-between p-4'>
            <button onClick={() => dispatch(toggleDrawer())} className='text-black'>
              X
            </button>
          </div>
          <div className='drawer-content p-4'>
            <Drawer editorData={editor}></Drawer>
          </div>
        </div>
      )}

      <BookNowModal isOpen={isModelOpen} onClose={() => dispatch(toggleModel(false))}>
        <div className='p-8'>
          {/* Header Section */}
          <div className='border-b border-gray-200 pb-6'>
            <h2 className='text-3xl font-bold text-gray-900'>
              Book {editor.name}
            </h2>
            <p className='mt-2 text-sm text-gray-500'>
              Fill in the details below to send a booking request
            </p>
          </div>

          <form className='mt-8 space-y-8' onSubmit={handleBookingSubmit}>
            {/* Editor Info Section */}
            <div className='rounded-lg bg-gray-50 p-6'>
              <h3 className='mb-4 text-lg font-medium text-gray-900'>
                Editor Information
              </h3>
              <div className='grid grid-cols-1 gap-6 sm:grid-cols-2'>
                <div>
                  <label className='block text-sm font-medium text-gray-700'>
                    Editor Name
                  </label>
                  <input
                    type='text'
                    value={editor.name}
                    disabled
                    className='mt-1 block w-full rounded-lg border-gray-300 bg-white py-3 shadow-sm focus:border-blue-500 focus:ring-blue-500'
                  />
                </div>

                <div>
                  <label className='block text-sm font-medium text-gray-700'>
                    Current Rating
                  </label>
                  <div className='mt-1 flex items-center space-x-2 rounded-lg border border-gray-300 bg-white px-4 py-3'>
                    <img src={starIcon} alt='Rating' className='h-5 w-5' />
                    <span className='font-medium text-gray-900'>
                      {editor.rating}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Video Selection Section */}
            <div className='rounded-lg bg-gray-50 p-6'>
              <h3 className='mb-2 text-lg font-medium text-gray-900'>
                Select Video
              </h3>
              <p className='mb-4 text-sm text-gray-500'>
                Choose the video you want the editor to work on
              </p>

              <div className='mt-4 max-h-[300px] overflow-y-auto rounded-lg border border-gray-200 bg-white'>
                {ownerVideos && ownerVideos.length > 0 ? (
                  ownerVideos.map((video) => (
                    <div
                      key={video._id}
                      className={`relative flex cursor-pointer border-b border-gray-200 p-4 last:border-b-0 hover:bg-gray-50 ${selectedVideo && selectedVideo._id === video._id
                        ? 'bg-blue-50 hover:bg-blue-50'
                        : ''
                        }`}
                      onClick={() => dispatch(setSelectedVideo(video))}>
                      <div className='flex-grow'>
                        <h3 className='text-lg font-semibold text-gray-900'>
                          {video.metaData.name}
                        </h3>
                        <div className='mt-2 flex flex-col space-y-2 text-sm text-gray-500'>
                          <div className='flex items-center space-x-4'>
                            <span>
                              Size:{' '}
                              {(video.metaData.size / (1024 * 1024)).toFixed(2)}{' '}
                              MB
                            </span>
                            <span>Type: {video.metaData.contentType}</span>
                          </div>
                          <div className='flex items-center space-x-4'>
                            <span>
                              Created:{' '}
                              {new Date(
                                video.metaData.timeCreated
                              ).toLocaleDateString()}
                            </span>
                            <span>
                              Updated:{' '}
                              {new Date(
                                video.metaData.updated
                              ).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>
                      {selectedVideo && selectedVideo._id === video._id && (
                        <div className='absolute right-4 top-1/2 -translate-y-1/2 transform'>
                          <svg
                            className='h-5 w-5 text-blue-500'
                            fill='currentColor'
                            viewBox='0 0 20 20'>
                            <path
                              fillRule='evenodd'
                              d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z'
                              clipRule='evenodd'
                            />
                          </svg>
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <div className='p-4 text-center text-gray-500'>
                    No videos available. Please upload some videos first.
                  </div>
                )}
              </div>
            </div>

            {/* Plan Selection Section */}
            <div className='rounded-lg bg-gray-50 p-6'>
              <h3 className='mb-2 text-lg font-medium text-gray-900'>
                Select Plan
              </h3>
              <p className='mb-4 text-sm text-gray-500'>
                Choose from our predefined plans or set a custom price
              </p>

              <div className='mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3'>
                {Object.entries(plans).map(([planName, planDetails]) => (
                  <div
                    key={planName}
                    className={`relative flex cursor-pointer rounded-lg border p-4 shadow-sm focus:outline-none ${selectedPlan === planName && !showCustomPrice
                      ? 'border-blue-500 ring-2 ring-blue-500'
                      : 'border-gray-300'
                      }`}
                    onClick={() => {
                      dispatch(setSelectedPlan(planName))
                      dispatch(setShowCustomPrice(false))
                    }}>
                    <div className='flex flex-1'>
                      <div className='flex flex-col'>
                        <span className='block text-sm font-medium text-gray-900'>
                          {planName}
                        </span>
                        <span className='mt-1 flex items-center text-sm text-gray-500'>
                          {planDetails.price}
                        </span>
                      </div>
                    </div>
                    <div
                      className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${selectedPlan === planName && !showCustomPrice
                        ? 'border-transparent bg-blue-500 text-white'
                        : 'border-gray-300 bg-white'
                        }`}>
                      {selectedPlan === planName && !showCustomPrice && (
                        <svg
                          className='h-3 w-3 text-white'
                          viewBox='0 0 12 12'
                          fill='currentColor'>
                          <path d='M3.707 5.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4a1 1 0 00-1.414-1.414L5 6.586 3.707 5.293z' />
                        </svg>
                      )}
                    </div>
                  </div>
                ))}

                {/* Custom Price Option */}
                <div
                  className={`relative flex cursor-pointer rounded-lg border p-4 shadow-sm focus:outline-none ${showCustomPrice ? 'border-blue-500 ring-2 ring-blue-500' : 'border-gray-300'}`}
                  onClick={() => dispatch(setShowCustomPrice(true))}>
                  <div className='flex flex-1'>
                    <div className='flex flex-col'>
                      <span className='block text-sm font-medium text-gray-900'>
                        Custom Price
                      </span>
                      <span className='mt-1 flex items-center text-sm text-gray-500'>
                        Set your own price
                      </span>
                    </div>
                  </div>
                  <div
                    className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${showCustomPrice ? 'border-transparent bg-blue-500 text-white' : 'border-gray-300 bg-white'}`}>
                    {showCustomPrice && (
                      <svg
                        className='h-3 w-3 text-white'
                        viewBox='0 0 12 12'
                        fill='currentColor'>
                        <path d='M3.707 5.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4a1 1 0 00-1.414-1.414L5 6.586 3.707 5.293z' />
                      </svg>
                    )}
                  </div>
                </div>
              </div>

              {/* Custom Price Input */}
              {showCustomPrice && (
                <div className='mt-4'>
                  <label className='block text-sm font-medium text-gray-700'>
                    Enter Custom Price (₹)
                  </label>
                  <div className='relative mt-1 rounded-lg shadow-sm'>
                    <div className='pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3'>
                      <span className='text-gray-500 sm:text-sm'>₹</span>
                    </div>
                    <input
                      type='number'
                      value={customPrice}
                      onChange={(e) => dispatch(setCustomPrice(e.target.value))}
                      className='block w-full rounded-lg border-gray-300 py-3 pl-7 focus:border-blue-500 focus:ring-blue-500'
                      placeholder='0.00'
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Description Section */}
            <div className='rounded-lg bg-gray-50 p-6'>
              <h3 className='mb-2 text-lg font-medium text-gray-900'>
                Project Description
              </h3>
              <p className='mb-4 text-sm text-gray-500'>
                Describe your project requirements, timeline, and any specific
                details the editor should know
              </p>
              <textarea
                value={projectDescription}
                onChange={(e) => dispatch(setProjectDescription(e.target.value))}
                rows={4}
                className='mt-2 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500'
                placeholder='I need help with...'
              />
            </div>

            {/* Show error if any */}
            {error && (
              <div className="p-4 rounded-lg bg-red-50 text-red-700">
                {error}
              </div>
            )}

            {/* Form Actions */}
            <div className='flex justify-end space-x-3 border-t border-gray-200 pt-6'>
              <button
                type='button'
                onClick={() => dispatch(resetBookingForm())}
                className='rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'>
                Cancel
              </button>
              <button
                type='submit'
                disabled={sendingRequest}
                className='rounded-lg bg-blue-600 px-8 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-70'>
                {sendingRequest ? 'Sending...' : 'Send Request'}
              </button>
            </div>
          </form>
        </div>
      </BookNowModal>
    </>
  )
}

export default Card
