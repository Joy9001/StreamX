import { Camera } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useAuth0 } from '@auth0/auth0-react'
import axios from 'axios'

export default function ProfileForm() {
  const fileInputRef = useRef(null)
  const userData = useSelector((state) => state.user.userData)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const { getAccessTokenSilently } = useAuth0()

  const [formData, setFormData] = useState({
    username: '',
    bio: '',
    profilephoto: ''
  })

  useEffect(() => {
    const fetchOwnerData = async () => {
      if (userData?.email) {
        try {
          const token = await getAccessTokenSilently()
          const response = await axios.get(
            `${import.meta.env.VITE_BACKEND_URL}/api/ownerProfile/${userData.email}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          )
          const ownerData = response.data
          setFormData({
            username: ownerData.username || '',
            bio: ownerData.bio || '',
            profilephoto: ownerData.profilephoto || ''
          })
        } catch (err) {
          console.error('Error fetching owner data:', err)
          setError(err.response?.data?.message || 'Error fetching owner data')
        }
      }
    }

    fetchOwnerData()
  }, [userData, getAccessTokenSilently])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, profilephoto: reader.result }))
      }
      reader.readAsDataURL(file)
    }
  }

  const handleEditProfile = async () => {
    setLoading(true)
    setError(null)

    try {
      const token = await getAccessTokenSilently()
      const formDataToSend = new FormData()
      formDataToSend.append('name', formData.username)
      formDataToSend.append('bio', formData.bio)

      // If there's a new profile photo (in base64 format), convert it to a file
      if (formData.profilephoto && formData.profilephoto.startsWith('data:')) {
        const response = await fetch(formData.profilephoto)
        const blob = await response.blob()
        const file = new File([blob], 'profile-photo.jpg', { type: 'image/jpeg' })
        formDataToSend.append('file', file)
      }

      const response = await axios.patch(
        `${import.meta.env.VITE_BACKEND_URL}/api/owner/profile/basic/${userData._id}`,
        formDataToSend,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`,
          },
        }
      )

      if (response.data.owner) {
        setFormData({
          username: response.data.owner.username || '',
          bio: response.data.owner.bio || '',
          profilephoto: response.data.owner.profilephoto || ''
        })
      }
      console.log('Profile updated:', response.data)
    } catch (err) {
      console.error('Error updating profile:', err)
      setError(err.response?.data?.message || 'Error updating profile')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='p-4'>
      <div className='mb-6 flex items-center justify-between'>
        <h2 className='bg-gradient-to-r from-pink-300 to-pink-500 bg-clip-text text-2xl font-bold text-transparent'>
          Edit Profile
        </h2>
        <button 
          onClick={handleEditProfile} 
          className='btn btn-primary btn-sm'
        >
          {loading ? (
            <span className='loading loading-spinner'></span>
          ) : (
            'Edit Profile'
          )}
        </button>
      </div>

      <div className='space-y-4'>
        <div className='relative mx-auto mb-8 h-32 w-32'>
          <img
            src={formData.profilephoto || 'https://via.placeholder.com/128'}
            alt='Profile'
            className='h-full w-full rounded-full object-cover'
          />
          <input
            type='file'
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept='image/*'
            className='hidden'
          />
          <button
            type='button'
            onClick={() => fileInputRef.current?.click()}
            className='absolute bottom-0 right-0 rounded-full bg-pink-500 p-2 text-white hover:bg-pink-600'>
            <Camera className='h-5 w-5' />
          </button>
        </div>

        <div>
          <label className='label'>
            <span className='label-text'>Username</span>
          </label>
          <input
            type='text'
            name='username'
            value={formData.username}
            onChange={handleInputChange}
            className='input input-bordered w-full'
          />
        </div>

        <div>
          <label className='label'>
            <span className='label-text'>Bio</span>
          </label>
          <textarea
            name='bio'
            value={formData.bio}
            onChange={handleInputChange}
            className='textarea textarea-bordered w-full'
            rows={4}
          />
        </div>

        {error && (
          <div className='mt-4 text-error'>
            {error}
          </div>
        )}
      </div>
    </div>
  )
}
