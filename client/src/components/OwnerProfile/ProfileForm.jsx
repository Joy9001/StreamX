import { Camera, Edit2, Save, X } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'
import { useSelector } from 'react-redux'
import axios from 'axios'

export default function ProfileForm() {
  const [isEditing, setIsEditing] = useState(false)
  const fileInputRef = useRef(null)
  const userData = useSelector((state) => state.user.userData)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const [formData, setFormData] = useState({
    username: '',
    bio: '',
    profilephoto: ''
  })

  useEffect(() => {
    if (userData) {
      setFormData({
        username: userData.name || '',
        bio: userData.bio || '',
        profilephoto: userData.profilephoto || ''
      })
    }
  }, [userData])

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

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
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
          },
        }
      )

      console.log('Profile updated:', response.data)
      setIsEditing(false)
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
        <div className='flex gap-2'>
          {isEditing ? (
            <>
              <button
                onClick={() => setIsEditing(false)}
                className='btn btn-ghost btn-sm'
                disabled={loading}>
                <X className='h-5 w-5' />
                Cancel
              </button>
              <button 
                onClick={handleSubmit} 
                className='btn btn-primary btn-sm'
                disabled={loading}>
                {loading ? (
                  <span className='loading loading-spinner'></span>
                ) : (
                  <Save className='h-5 w-5' />
                )}
                Save Changes
              </button>
            </>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className='btn btn-ghost btn-sm'>
              <Edit2 className='h-5 w-5' />
              Edit
            </button>
          )}
        </div>
      </div>

      {error && (
        <div className='alert alert-error mb-4'>
          <span>{error}</span>
        </div>
      )}

      <div className='flex flex-col gap-8 md:flex-row'>
        <div className='flex-1'>
          <div className='form-control w-full'>
            <label className='label'>
              <span className='label-text'>Username</span>
            </label>
            <input
              type='text'
              name='username'
              placeholder={userData?.name || 'Enter your name'}
              className='input input-bordered w-full'
              value={formData.username}
              onChange={handleInputChange}
              disabled={!isEditing}
            />
          </div>

          <div className='form-control w-full'>
            <label className='label'>
              <span className='label-text'>Bio</span>
            </label>
            <textarea
              name='bio'
              placeholder={userData?.bio || 'Tell us about yourself'}
              className='textarea textarea-bordered h-24'
              value={formData.bio}
              onChange={handleInputChange}
              disabled={!isEditing}
            />
          </div>
        </div>

        <div className='flex flex-col items-center gap-4'>
          <div className='relative'>
            <div className='w-32 h-32 rounded-full ring ring-primary ring-offset-2 ring-offset-base-100 overflow-hidden'>
              <img
                src={formData.profilephoto || userData?.profilephoto || '/default-avatar.png'}
                alt='Profile'
                className='w-full h-full object-cover'
              />
            </div>
            {isEditing && (
              <button
                onClick={() => fileInputRef.current?.click()}
                className='absolute bottom-0 right-0 rounded-full bg-primary p-2 text-white hover:bg-primary-focus'>
                <Camera className='h-4 w-4' />
              </button>
            )}
          </div>
          <input
            ref={fileInputRef}
            type='file'
            accept='image/*'
            className='hidden'
            onChange={handleFileUpload}
          />
        </div>
      </div>
    </div>
  )
}
