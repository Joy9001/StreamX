import React, { useState } from 'react'
import locationIcon from '../../assets/location.svg'
import languageIcon from '../../assets/language.svg'
import starIcon from '../../assets/star.svg'
import checkIcon from '../../assets/tick.svg'
import crossIcon from '../../assets/cross.svg'
import Drawer from '../Drawer.jsx'

function Card({ data }) {
  const [selectedPlan, setSelectedPlan] = useState('Basic')
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)

  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen)
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

  const nextVideo = () => {
    setCurrentVideoIndex((prevIndex) =>
      prevIndex === videos.length - 1 ? 0 : prevIndex + 1
    )
  }

  const prevVideo = () => {
    setCurrentVideoIndex((prevIndex) =>
      prevIndex === 0 ? videos.length - 1 : prevIndex - 1
    )
  }

  return (
    <>
      {/* Overlay to block interaction and blur the background when drawer is open */}
      {isDrawerOpen && (
        <div className='fixed inset-0 z-40 bg-gray-700 bg-opacity-80'></div>
      )}

      <div className='flex cursor-pointer'>
        {/* Card */}
        <div
          className='Cards relative z-30 ml-14 mt-10 flex h-[50vh] w-8/12 flex-col items-center border-2 border-solid border-gray-300 bg-white'
          onClick={toggleDrawer}>
          <div className='flex'>
            <div className='flex items-center'>
              <button
                onClick={prevVideo}
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
                onClick={nextVideo}
                className='rounded-full p-2 text-black shadow-md transition hover:bg-gray-400'>
                &gt;
              </button>
            </div>

            {/* Card Body */}
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

              {/* Description Section - Drawer will open when clicked */}

              <div className='description mt-6 text-gray-800'>
                <p>
                  {data.bio}... <span className='text-blue-700'>Read More</span>
                </p>
              </div>

              {/* Action Buttons */}
            </div>
          </div>
          {/* Skills */}
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
              <button className='rounded bg-blue-500 px-4 py-2 text-white transition hover:bg-blue-600'>
                View Profile
              </button>
              <button className='rounded bg-green-500 px-4 py-2 text-white transition hover:bg-green-600'>
                Book Now
              </button>
            </div>
          </div>
        </div>

        {/* Plans Section - No drawer trigger here */}
        <div className='plan mr-20 mt-10 h-[50vh] max-w-80 border-2 border-solid border-gray-300 bg-white shadow-xl'>
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

      {/* Drawer Component */}
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
    </>
  )
}

export default Card
