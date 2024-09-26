import { useState } from 'react'
import { Camera, X, Edit2, Save, Lock, Eye, EyeOff } from 'lucide-react'

export default function ProfileForm() {
  const [isEditing, setIsEditing] = useState(false)
  const [isChangingPassword, setIsChangingPassword] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    YTchannelname: '',
    profilephoto:
      'https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp',
    currentPassword: '',
    newPassword: '',
  })
  const [errors, setErrors] = useState({})

  const validations = {
    email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    username: /^[A-Za-z0-9_]{3,15}$/,
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    validateField(name, value)
  }

  const validateField = (name, value) => {
    let error = ''
    if (name === 'email' && !validations.email.test(value)) {
      error = 'Please enter a valid email address.'
    } else if (name === 'username' && !validations.username.test(value)) {
      error =
        'Username must be 3-15 characters and can only contain letters, numbers, and underscores.'
    }
    setErrors((prev) => ({ ...prev, [name]: error }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log('Form submitted:', formData)
    setIsEditing(false)
  }

  const handlePasswordChange = (e) => {
    e.preventDefault()
    console.log('Password change submitted:', {
      currentPassword: formData.currentPassword,
      newPassword: formData.newPassword,
    })
    setIsChangingPassword(false)
    setFormData((prev) => ({ ...prev, currentPassword: '', newPassword: '' }))
  }

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setFormData((prev) => ({ ...prev, profilephoto: reader.result }))
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-purple-100 to-indigo-200 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8'>
      <form
        onSubmit={handleSubmit}
        className='max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-2xl'>
        <div className='text-center'>
          <div className='w-32 h-32 mx-auto mb-4 border-4 border-purple-200 shadow-lg rounded-full overflow-hidden'>
            <img
              src={formData.profilephoto}
              alt='Profile'
              className='w-full h-full object-cover'
            />
          </div>
          <div className='flex justify-center space-x-4'>
            <button
              type='button'
              onClick={() => document.getElementById('avatar-upload').click()}
              className='inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-purple-600 bg-purple-100 hover:bg-purple-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500'>
              <Camera className='w-5 h-5 mr-2' />
              Change Avatar
            </button>
            <input
              id='avatar-upload'
              type='file'
              accept='image/*'
              className='hidden'
              onChange={handleAvatarChange}
            />
            <button
              type='button'
              onClick={() =>
                setFormData((prev) => ({
                  ...prev,
                  profilephoto: '/placeholder.svg?height=128&width=128',
                }))
              }
              className='inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-red-600 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500'>
              <X className='w-5 h-5 mr-2' />
              Remove Avatar
            </button>
          </div>
        </div>

        <div className='space-y-6'>
          <div>
            <label
              htmlFor='username'
              className='block text-sm font-medium text-gray-700 mb-1'>
              Username
            </label>
            <input
              id='username'
              name='username'
              type='text'
              value={formData.username}
              onChange={handleInputChange}
              disabled={!isEditing}
              required
              className='w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500 disabled:bg-gray-100 disabled:text-gray-500'
            />
            {errors.username && (
              <p className='mt-1 text-xs text-red-500'>{errors.username}</p>
            )}
            <p className='mt-1 text-xs text-gray-500'>
              Username must be 3-15 characters and can only contain letters,
              numbers, and underscores.
            </p>
          </div>

          <div>
            <label
              htmlFor='email'
              className='block text-sm font-medium text-gray-700 mb-1'>
              Email
            </label>
            <input
              id='email'
              name='email'
              type='email'
              value={formData.email}
              onChange={handleInputChange}
              disabled={!isEditing}
              required
              className='w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500 disabled:bg-gray-100 disabled:text-gray-500'
            />
            {errors.email && (
              <p className='mt-1 text-xs text-red-500'>{errors.email}</p>
            )}
            <p className='mt-1 text-xs text-gray-500'>
              Please enter a valid email address.
            </p>
          </div>

          <div>
            <label
              htmlFor='YTchannelname'
              className='block text-sm font-medium text-gray-700 mb-1'>
              YouTube Channel Name
            </label>
            <input
              id='YTchannelname'
              name='YTchannelname'
              type='text'
              value={formData.YTchannelname}
              onChange={handleInputChange}
              disabled={!isEditing}
              className='w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500 disabled:bg-gray-100 disabled:text-gray-500'
            />
          </div>
        </div>

        <div className='flex justify-between pt-6'>
          <button
            type='button'
            onClick={() => setIsChangingPassword(!isChangingPassword)}
            className='inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'>
            <Lock className='w-5 h-5 mr-2' />
            Change Password
          </button>
          {isEditing ? (
            <button
              type='submit'
              className='inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500'>
              <Save className='w-5 h-5 mr-2' />
              Save Changes
            </button>
          ) : (
            <button
              type='button'
              onClick={() => setIsEditing(true)}
              className='inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'>
              <Edit2 className='w-5 h-5 mr-2' />
              Edit
            </button>
          )}
        </div>

        {isChangingPassword && (
          <div className='mt-6 p-4 bg-gray-50 rounded-md'>
            <h3 className='text-lg font-medium text-gray-900 mb-4'>
              Change Password
            </h3>
            <form onSubmit={handlePasswordChange} className='space-y-4'>
              <div>
                <label
                  htmlFor='currentPassword'
                  className='block text-sm font-medium text-gray-700'>
                  Current Password
                </label>
                <div className='mt-1 relative'>
                  <input
                    id='currentPassword'
                    name='currentPassword'
                    type={showPassword ? 'text' : 'password'}
                    value={formData.currentPassword}
                    onChange={handleInputChange}
                    required
                    className='w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500'
                  />
                  <button
                    type='button'
                    onClick={() => setShowPassword(!showPassword)}
                    className='absolute inset-y-0 right-0 pr-3 flex items-center'>
                    {showPassword ? (
                      <EyeOff className='h-5 w-5 text-gray-400' />
                    ) : (
                      <Eye className='h-5 w-5 text-gray-400' />
                    )}
                  </button>
                </div>
              </div>
              <div>
                <label
                  htmlFor='newPassword'
                  className='block text-sm font-medium text-gray-700'>
                  New Password
                </label>
                <div className='mt-1 relative'>
                  <input
                    id='newPassword'
                    name='newPassword'
                    type={showPassword ? 'text' : 'password'}
                    value={formData.newPassword}
                    onChange={handleInputChange}
                    required
                    className='w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500'
                  />
                  <button
                    type='button'
                    onClick={() => setShowPassword(!showPassword)}
                    className='absolute inset-y-0 right-0 pr-3 flex items-center'>
                    {showPassword ? (
                      <EyeOff className='h-5 w-5 text-gray-400' />
                    ) : (
                      <Eye className='h-5 w-5 text-gray-400' />
                    )}
                  </button>
                </div>
              </div>
              <button
                type='submit'
                className='w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500'>
                <Save className='w-5 h-5 mr-2' />
                Save New Password
              </button>
            </form>
          </div>
        )}
      </form>
    </div>
  )
}
