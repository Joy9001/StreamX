import React, { useState } from 'react'
import axios from 'axios'
import locationIcon from '../../assets/location.svg'
import languageIcon from '../../assets/language.svg'
import starIcon from '../../assets/star.svg'
import checkIcon from '../../assets/tick.svg'
import crossIcon from '../../assets/cross.svg'
import Drawer from '../Drawer.jsx'
import Model from './Model.jsx'
import dummyVideos from './dummyVideos.json'

function Card({ data }) {
  const [selectedPlan, setSelectedPlan] = useState('Basic')
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [isModelOpen, setIsModelOpen] = useState(false)
  const [customPrice, setCustomPrice] = useState('')
  const [description, setDescription] = useState('')
  const [showCustomPrice, setShowCustomPrice] = useState(false)
  const [selectedVideo, setSelectedVideo] = useState(null)

  // For demo purposes, let's use the first owner's videos
  const ownerVideos = dummyVideos.videos.filter(
    (video) => video.ownerId === '507f1f77bcf86cd799439011'
  )

  const toggleDrawer = () => {
    setIsDrawerOpen((prevState) => !prevState)
  }

  const plans = data.plans
    ? {
        Basic: {
          price: `₹${data.plans[0].basic.price}`,
          description: data.plans[0].basic.desc,
          delivery: `${data.plans[0].basic.deliveryTime} day delivery`,
          revisions: 'Unlimited revisions',
          availableSkills: data.plans[0].basic.ServiceOptions,
        },
        Standard: {
          price: `₹${data.plans[0].standard.price}`,
          description: data.plans[0].standard.desc,
          delivery: `${data.plans[0].standard.deliveryTime} day delivery`,
          revisions: 'Unlimited revisions',
          availableSkills: data.plans[0].standard.ServiceOptions,
        },
        Premium: {
          price: `₹${data.plans[0].premium.price}`,
          description: data.plans[0].premium.desc,
          delivery: `${data.plans[0].premium.deliveryTime} day delivery`,
          revisions: 'Unlimited revisions',
          availableSkills: data.plans[0].premium.ServiceOptions,
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
    setCurrentVideoIndex((prevIndex) =>
      direction === 'next'
        ? (prevIndex + 1) % videos.length
        : (prevIndex - 1 + videos.length) % videos.length
    )
  }

  return (
    <>
      {isDrawerOpen && (
        <div className='fixed inset-0 z-40 bg-gray-700 bg-opacity-80'></div>
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
                  onMouseEnter={(e) => e.target.play()}
                  onMouseLeave={(e) => e.target.pause()}
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
                {data.name}
              </h2>
              <div className='ml-4 mt-2 flex items-center'>
                <img
                  src={locationIcon}
                  alt='Location'
                  className='mr-2 h-5 w-5'
                />
                <p className='font-bold'>{data.address}</p>
                <div className='ml-6 flex'>
                  <img src={starIcon} alt='Rating' className='mr-2 h-5 w-5' />
                  <p>{data.rating}</p>
                </div>
                <div className='ml-8 flex items-center'>
                  <img
                    src={languageIcon}
                    alt='Languages'
                    className='mr-2 h-5 w-5'
                  />
                  <p className='font-bold'>{data.languages.join(', ')}</p>
                </div>
              </div>
              <div className='description mt-6 text-gray-800'>
                <p>
                  {data.bio}... <span className='text-blue-700'>Read More</span>
                </p>
              </div>
            </div>
          </div>
          <div className='skills mb-4 ml-4 mt-8 flex'>
            <div className='flex flex-wrap gap-2'>
              {data.skills.map((skill, index) => (
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
                onClick={toggleDrawer}>
                View Profile
              </button>
              <button
                className='rounded bg-green-500 px-4 py-2 text-white transition hover:bg-green-600'
                onClick={() => setIsModelOpen(true)}>
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
                className={`cursor-pointer rounded-lg border border-gray-300 px-4 py-2 text-center ${
                  selectedPlan === planName ? 'border-blue-500 shadow-lg' : ''
                }`}
                onClick={() => setSelectedPlan(planName)}>
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
                          src={checkIcon}
                          alt='Available'
                          className='mr-2 h-4 w-4'
                        />
                        <span className='text-black'>{skill}</span>
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
          className={`fixed right-0 top-0 z-50 h-screen w-3/5 transform overflow-y-auto bg-white shadow-lg transition-transform ${
            isDrawerOpen ? 'translate-x-0' : 'translate-x-full'
          }`}>
          <div className='drawer-header flex justify-between p-4'>
            <button onClick={toggleDrawer} className='text-black'>
              X
            </button>
          </div>
          <div className='drawer-content p-4'>
            <Drawer editorData={data}></Drawer>
          </div>
        </div>
      )}

      <Model isOpen={isModelOpen} onClose={() => setIsModelOpen(false)}>
        <div className='p-8'>
          {/* Header Section */}
          <div className='border-b border-gray-200 pb-6'>
            <h2 className='text-3xl font-bold text-gray-900'>
              Book {data.name}
            </h2>
            <p className='mt-2 text-sm text-gray-500'>
              Fill in the details below to send a booking request
            </p>
          </div>

          <form className='mt-8 space-y-8'>
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
                    value={data.name}
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
                      {data.rating}
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
                {ownerVideos.map((video, index) => (
                  <div
                    key={index}
                    className={`relative flex cursor-pointer border-b border-gray-200 p-4 last:border-b-0 hover:bg-gray-50 ${selectedVideo === video ? 'bg-blue-50 hover:bg-blue-50' : ''}`}
                    onClick={() => setSelectedVideo(video)}>
                    <div className='flex flex-1'>
                      <div className='min-w-0 flex-1'>
                        <div className='flex items-center justify-between'>
                          <p className='text-sm font-medium text-gray-900'>
                            {video.metaData.title}
                          </p>
                          <div className='ml-4 flex-shrink-0'>
                            <span
                              className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                video.ytUploadStatus === 'Uploaded'
                                  ? 'bg-green-100 text-green-800'
                                  : video.ytUploadStatus === 'Failed'
                                    ? 'bg-red-100 text-red-800'
                                    : 'bg-yellow-100 text-yellow-800'
                              }`}>
                              {video.ytUploadStatus}
                            </span>
                          </div>
                        </div>
                        <div className='mt-1'>
                          <p className='line-clamp-2 text-sm text-gray-500'>
                            {video.metaData.description}
                          </p>
                          <div className='mt-2 flex items-center text-xs text-gray-500'>
                            <span className='mr-4'>
                              Duration: {video.metaData.duration}
                            </span>
                            <span className='mr-4'>
                              Resolution: {video.metaData.resolution}
                            </span>
                            <span>Size: {video.metaData.fileSize}</span>
                          </div>
                        </div>
                      </div>
                      <div
                        className={`ml-4 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${
                          selectedVideo === video
                            ? 'border-transparent bg-blue-500 text-white'
                            : 'border-gray-300 bg-white'
                        }`}>
                        {selectedVideo === video && (
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
                ))}
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
                    className={`relative flex cursor-pointer rounded-lg border p-4 shadow-sm focus:outline-none ${
                      selectedPlan === planName && !showCustomPrice
                        ? 'border-blue-500 ring-2 ring-blue-500'
                        : 'border-gray-300'
                    }`}
                    onClick={() => {
                      setSelectedPlan(planName)
                      setShowCustomPrice(false)
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
                      className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${
                        selectedPlan === planName && !showCustomPrice
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
                  onClick={() => setShowCustomPrice(true)}>
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
                      onChange={(e) => setCustomPrice(e.target.value)}
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
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                className='mt-2 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500'
                placeholder='I need help with...'
              />
            </div>

            {/* Form Actions */}
            <div className='flex justify-end space-x-3 border-t border-gray-200 pt-6'>
              <button
                type='button'
                onClick={() => {
                  setSelectedVideo(null)
                  setIsModelOpen(false)
                }}
                className='rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'>
                Cancel
              </button>
              <button
                type='submit'
                onClick={async (e) => {
                  e.preventDefault()
                  if (!selectedVideo) {
                    alert('Please select a video to proceed')
                    return
                  }

                  try {
                    const requestData = {
                      editor_id: data._id, // Editor's ID from the card data
                      video_id: selectedVideo._id,
                      owner_id: selectedVideo.ownerId,
                      description: description,
                      price: showCustomPrice
                        ? Number(customPrice)
                        : Number(plans[selectedPlan].price.replace('₹', '')),
                      status: 'pending',
                    }

                    console.log('Sending request with data:', requestData) // Add logging
                    const response = await axios.post(
                      'http://localhost:3000/requests/create',
                      requestData
                    )

                    if (response.status === 201 || response.status === 200) {
                      alert('Request sent successfully!')
                      setIsModelOpen(false)
                      // Reset form
                      setSelectedVideo(null)
                      setDescription('')
                      setCustomPrice('')
                      setShowCustomPrice(false)
                    }
                  } catch (error) {
                    console.error('Error sending request:', error)
                    console.error('Request data was:', requestData) // Add error logging
                    alert('Failed to send request. Please try again.')
                  }
                }}
                className='rounded-lg bg-blue-600 px-8 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'>
                Send Request
              </button>
            </div>
          </form>
        </div>
      </Model>
    </>
  )
}

export default Card
