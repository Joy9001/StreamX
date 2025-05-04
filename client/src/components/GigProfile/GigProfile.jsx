'use client'

import { useAuth0 } from '@auth0/auth0-react'
import axios from 'axios'
import { Clock, DollarSign, Globe, Mail, MapPin, Star } from 'lucide-react'
import { useEffect, useState } from 'react'
import Navbar from '../NavBar/Navbar'
import EditGig from './EditGig'
import GigHeader from './GigHeader'

function GigProfile() {
  const [showEditForm, setShowEditForm] = useState(false)
  const [activeTab, setActiveTab] = useState('basic')
  const [editorData, setEditorData] = useState(null)
  const [editorPlans, setEditorPlans] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const { user, getAccessTokenSilently } = useAuth0()

  useEffect(() => {
    const fetchEditorData = async () => {
      if (!user?.email) return

      try {
        setLoading(true)
        const token = await getAccessTokenSilently()

        // Fetch editor gig data
        const gigResponse = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/editorGig/email/${user.email}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )

        // Fetch editor plans data
        const plansResponse = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/editorGig/plans/email/${user.email}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )

        setEditorData(gigResponse.data.data)
        setEditorPlans(plansResponse.data.data)
        setError(null)
      } catch (err) {
        console.error('Error fetching editor data:', err)
        setError(err.response?.data?.message || 'Error fetching editor data')
      } finally {
        setLoading(false)
      }
    }

    fetchEditorData()
  }, [user?.email, getAccessTokenSilently])

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' bytes'
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB'
    else return (bytes / 1048576).toFixed(1) + ' MB'
  }

  if (loading) {
    return (
      <div className='flex h-screen items-center justify-center'>
        <div className='h-32 w-32 animate-spin rounded-full border-b-2 border-pink-500'></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className='flex h-screen items-center justify-center'>
        <div className='text-center text-red-500'>
          <h2 className='mb-2 text-2xl font-bold'>Error Loading Profile</h2>
          <p>{error}</p>
          <button
            onClick={() => window.location.reload()}
            className='mt-4 rounded bg-pink-500 px-4 py-2 text-white hover:bg-pink-600'>
            Try Again
          </button>
        </div>
      </div>
    )
  }

  if (!editorData || !editorPlans) {
    return (
      <div className='flex h-screen items-center justify-center'>
        <div className='text-center'>
          <h2 className='mb-2 text-2xl font-bold'>No Profile Found</h2>
          <p>Please create your editor profile first.</p>
        </div>
      </div>
    )
  }

  return (
    <div className='flex h-screen'>
      <div className='navbar h-full w-[15%] pl-0 transition-all duration-300'>
        <Navbar title='Profile' />
      </div>
      <div className='flex flex-1 flex-col overflow-auto p-2'>
        <GigHeader onEditClick={() => setShowEditForm(true)} />

        <div className='space-y-4 p-6'>
          <div className='grid grid-cols-1 gap-6'>
            <div className='overflow-hidden rounded-lg bg-white shadow-xl'>
              <div className='flex flex-col md:flex-row'>
                <div className='w-full bg-pink-50 p-6 md:w-1/3'>
                  <div className='flex flex-col items-center space-y-6'>
                    <div className='relative'>
                      <img
                        src='https://imgix.ranker.com/list_img_v2/1360/2681360/original/the-best-ichigo-quotes?auto=format&q=50&fit=crop&fm=pjpg&dpr=2&crop=faces&h=185.86387434554973&w=355'
                        alt='Profile'
                        className='h-36 w-36 rounded-full border-4 border-white object-cover shadow-lg'
                      />
                      <div className='absolute -bottom-2 -right-2 rounded-full bg-pink-100 p-2 shadow-md'>
                        <Star className='h-6 w-6 text-yellow-400' />
                      </div>
                    </div>

                    <div className='space-y-2 text-center'>
                      <h2 className='text-2xl font-bold text-pink-800'>
                        {editorData.name}
                      </h2>
                      <div className='flex items-center justify-center'>
                        <span className='text-lg font-semibold text-gray-600'>
                          {editorData.rating || '0'} Rating
                        </span>
                      </div>
                    </div>

                    <div className='w-full space-y-4 border-t border-pink-200 pt-4'>
                      <div className='flex items-center space-x-3 rounded-lg bg-white p-3 shadow-sm transition-shadow hover:shadow-md'>
                        <Mail className='h-5 w-5 text-pink-500' />
                        <div className='flex flex-col'>
                          <span className='text-sm text-gray-500'>Email</span>
                          <span className='text-sm font-medium'>
                            {editorData.email}
                          </span>
                        </div>
                      </div>

                      <div className='flex items-center space-x-3 rounded-lg bg-white p-3 shadow-sm transition-shadow hover:shadow-md'>
                        <MapPin className='h-5 w-5 text-pink-500' />
                        <div className='flex flex-col'>
                          <span className='text-sm text-gray-500'>
                            Location
                          </span>
                          <span className='text-sm font-medium'>
                            {editorData.address}
                          </span>
                        </div>
                      </div>

                      <div className='flex items-center space-x-3 rounded-lg bg-white p-3 shadow-sm transition-shadow hover:shadow-md'>
                        <Globe className='h-5 w-5 text-pink-500' />
                        <div className='flex flex-col'>
                          <span className='text-sm text-gray-500'>
                            Languages
                          </span>
                          <span className='text-sm font-medium'>
                            {editorData.languages?.join(', ')}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className='w-full p-6 md:w-2/3'>
                  <div className='space-y-6'>
                    <div>
                      <h3 className='mb-2 text-xl font-bold text-gray-800'>
                        About Me
                      </h3>
                      <p className='text-gray-600'>{editorData.bio}</p>
                    </div>

                    <div>
                      <h3 className='mb-2 text-xl font-bold text-gray-800'>
                        Skills
                      </h3>
                      <div className='flex flex-wrap gap-2'>
                        {editorData.skills?.map((skill, index) => (
                          <span
                            key={index}
                            className='rounded-full bg-pink-100 px-3 py-1 text-sm text-pink-800'>
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className='mb-4 text-xl font-bold text-gray-800'>
                        Gig Description
                      </h3>
                      <p className='text-gray-600'>
                        {editorData.gig_description}
                      </p>
                    </div>

                    <div>
                      <h3 className='mb-4 text-xl font-bold text-gray-800'>
                        Pricing Plans
                      </h3>
                      <div className='grid grid-cols-1 gap-4 md:grid-cols-3'>
                        {['basic', 'standard', 'premium'].map((plan) => (
                          <div
                            key={plan}
                            className={`rounded-lg border-2 p-4 ${
                              activeTab === plan
                                ? 'border-pink-500 bg-pink-50'
                                : 'border-gray-200'
                            }`}>
                            <h4 className='mb-2 text-lg font-semibold capitalize'>
                              {plan}
                            </h4>
                            <div className='mb-4 flex items-center'>
                              <DollarSign className='h-5 w-5 text-pink-500' />
                              <span className='text-2xl font-bold'>
                                {editorPlans[plan]?.price || 0}
                              </span>
                            </div>
                            <p className='mb-4 text-gray-600'>
                              {editorPlans[plan]?.desc}
                            </p>
                            <div className='mb-2 flex items-center text-gray-500'>
                              <Clock className='mr-2 h-4 w-4' />
                              <span>
                                {editorPlans[plan]?.deliveryTime || 0} days
                                delivery
                              </span>
                            </div>
                            {editorPlans[plan]?.services && (
                              <ul className='space-y-2'>
                                {editorPlans[plan].services.map(
                                  (service, index) => (
                                    <li
                                      key={index}
                                      className='flex items-center'>
                                      <span className='mr-2 h-2 w-2 rounded-full bg-pink-500'></span>
                                      {service}
                                    </li>
                                  )
                                )}
                              </ul>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Edit Gig Modal */}
      <dialog
        id='edit_gig_modal'
        className={`modal ${showEditForm ? 'modal-open' : ''}`}>
        <div className='modal-box max-w-4xl'>
          <form method='dialog'>
            <button
              className='btn btn-circle btn-ghost btn-sm absolute right-2 top-2'
              onClick={() => setShowEditForm(false)}>
              ✕
            </button>
          </form>
          {showEditForm && (
            <EditGig
              onClose={() => setShowEditForm(false)}
              editorData={editorData}
              editorPlans={editorPlans}
            />
          )}
        </div>
        <form method='dialog' className='modal-backdrop'>
          <button onClick={() => setShowEditForm(false)}>close</button>
        </form>
      </dialog>
    </div>
  )
}

export default GigProfile
