import { Camera, Edit2, Eye, EyeOff, Lock, Save, X } from 'lucide-react'
import { useState } from 'react'

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
    <div className='flex min-h-screen items-center justify-center px-4 py-12 sm:px-6 lg:px-8'>
      <form
        onSubmit={handleSubmit}
        className='w-full max-w-md space-y-8 rounded-xl bg-white p-8 shadow-2xl'>
        <div className='text-center'>
          <div className='mx-auto mb-4 h-32 w-32 overflow-hidden rounded-full border-4 border-purple-200 shadow-lg'>
            <img
              src={formData.profilephoto}
              alt='Profile'
              className='h-full w-full object-cover'
            />
          </div>
          <div className='flex justify-center space-x-4'>
            <button
              type='button'
              onClick={() => document.getElementById('avatar-upload').click()}
              className='inline-flex items-center rounded-md border border-transparent bg-purple-100 px-4 py-2 text-sm font-medium text-purple-600 hover:bg-purple-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2'>
              <Camera className='mr-2 h-5 w-5' />
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
              className='inline-flex items-center rounded-md border border-transparent bg-red-100 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2'>
              <X className='mr-2 h-5 w-5' />
              Remove Avatar
            </button>
          </div>
        </div>

        <div className='space-y-6'>
          <div>
            <label
              htmlFor='username'
              className='mb-1 block text-sm font-medium text-gray-700'>
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
              className='w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-purple-500 focus:ring-purple-500 disabled:bg-gray-100 disabled:text-gray-500'
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
              className='mb-1 block text-sm font-medium text-gray-700'>
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
              className='w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-purple-500 focus:ring-purple-500 disabled:bg-gray-100 disabled:text-gray-500'
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
              className='mb-1 block text-sm font-medium text-gray-700'>
              YouTube Channel Name
            </label>
            <input
              id='YTchannelname'
              name='YTchannelname'
              type='text'
              value={formData.YTchannelname}
              onChange={handleInputChange}
              disabled={!isEditing}
              className='w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-purple-500 focus:ring-purple-500 disabled:bg-gray-100 disabled:text-gray-500'
            />
          </div>
        </div>

        <div className='flex justify-between pt-6'>
          <button
            type='button'
            onClick={() => setIsChangingPassword(!isChangingPassword)}
            className='inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2'>
            <Lock className='mr-2 h-5 w-5' />
            Change Password
          </button>
          {isEditing ? (
            <button
              type='submit'
              className='inline-flex items-center rounded-md border border-transparent bg-purple-600 px-4 py-2 text-sm font-medium text-white hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2'>
              <Save className='mr-2 h-5 w-5' />
              Save Changes
            </button>
          ) : (
            <button
              type='button'
              onClick={() => setIsEditing(true)}
              className='inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2'>
              <Edit2 className='mr-2 h-5 w-5' />
              Edit
            </button>
          )}
        </div>

        {isChangingPassword && (
          <div className='mt-6 rounded-md bg-gray-50 p-4'>
            <h3 className='mb-4 text-lg font-medium text-gray-900'>
              Change Password
            </h3>
            <form onSubmit={handlePasswordChange} className='space-y-4'>
              <div>
                <label
                  htmlFor='currentPassword'
                  className='block text-sm font-medium text-gray-700'>
                  Current Password
                </label>
                <div className='relative mt-1'>
                  <input
                    id='currentPassword'
                    name='currentPassword'
                    type={showPassword ? 'text' : 'password'}
                    value={formData.currentPassword}
                    onChange={handleInputChange}
                    required
                    className='w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-purple-500 focus:ring-purple-500'
                  />
                  <button
                    type='button'
                    onClick={() => setShowPassword(!showPassword)}
                    className='absolute inset-y-0 right-0 flex items-center pr-3'>
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
                <div className='relative mt-1'>
                  <input
                    id='newPassword'
                    name='newPassword'
                    type={showPassword ? 'text' : 'password'}
                    value={formData.newPassword}
                    onChange={handleInputChange}
                    required
                    className='w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-purple-500 focus:ring-purple-500'
                  />
                  <button
                    type='button'
                    onClick={() => setShowPassword(!showPassword)}
                    className='absolute inset-y-0 right-0 flex items-center pr-3'>
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
                className='inline-flex w-full items-center justify-center rounded-md border border-transparent bg-purple-600 px-4 py-2 text-sm font-medium text-white hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2'>
                <Save className='mr-2 h-5 w-5' />
                Save New Password
              </button>
            </form>
          </div>
        )}
      </form>
    </div>
  )
}
