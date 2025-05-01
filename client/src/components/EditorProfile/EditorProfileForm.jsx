import { Camera, Edit2, Save, X } from 'lucide-react'
import { useState, useRef } from 'react'

export default function EditorProfileForm({ initialData, onClose }) {
  const [isEditing, setIsEditing] = useState(false)

  const [formData, setFormData] = useState({
    username: initialData.name,
    bio: initialData.bio,
    socials: {
      website: initialData.website || '',
      github: initialData.github
        ? `https://github.com/${initialData.github}`
        : '',
      twitter: initialData.twitter
        ? `https://twitter.com/${initialData.twitter.replace('@', '')}`
        : '',
      instagram: initialData.instagram
        ? `https://instagram.com/${initialData.instagram}`
        : '',
      facebook: initialData.facebook
        ? `https://facebook.com/${initialData.facebook}`
        : '',
    },
    profilephoto: initialData.profilePicture,
  })

  const [errors, setErrors] = useState({})

  const validations = {
    username: /^[A-Za-z0-9_\s]{3,30}$/,
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    if (name.startsWith('social_')) {
      const socialNetwork = name.replace('social_', '')
      setFormData((prev) => ({
        ...prev,
        socials: {
          ...prev.socials,
          [socialNetwork]: value,
        },
      }))
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }))
    }
    if (name === 'username') validateField(name, value)
  }

  const validateField = (name, value) => {
    let error = ''
    if (name === 'username' && !validations.username.test(value)) {
      error =
        'Username must be 3-30 characters and can only contain letters, numbers, spaces, and underscores.'
    }
    setErrors((prev) => ({ ...prev, [name]: error }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log('Form submitted:', formData)
    setIsEditing(false)
    onClose()
  }

  const fileInputRef = useRef(null)

  const handleFileUpload = (e) => {
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
    <div className='p-4'>
      <div className='mb-6 flex items-center justify-between'>
        <h2 className='bg-gradient-to-r from-pink-300 to-pink-500 bg-clip-text text-2xl font-bold text-transparent'>
          Edit Profile
        </h2>
        <div className='flex gap-2'>
          {isEditing ? (
            <>
              <button
                onClick={() => {
                  setIsEditing(false)
                  onClose()
                }}
                className='btn btn-ghost btn-sm'>
                <X className='h-5 w-5' />
                Cancel
              </button>
              <button onClick={handleSubmit} className='btn btn-primary btn-sm'>
                <Save className='h-5 w-5' />
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

      <form onSubmit={handleSubmit} className='space-y-6'>
        <div className='flex justify-center'>
          <div className='relative'>
            <img
              src={formData.profilephoto}
              alt='Profile'
              className='h-32 w-32 rounded-full object-cover'
            />
            <button
              type='button'
              onClick={() => fileInputRef.current?.click()}
              className='absolute bottom-0 right-0 rounded-full bg-white p-2 shadow-lg'
              disabled={!isEditing}>
              <Camera className='h-5 w-5 text-gray-600' />
            </button>
            <input
              ref={fileInputRef}
              type='file'
              accept='image/*'
              onChange={handleFileUpload}
              className='hidden'
              disabled={!isEditing}
            />
          </div>
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
            className={`input input-bordered w-full ${
              errors.username ? 'input-error' : ''
            }`}
            placeholder='Enter username'
            disabled={!isEditing}
          />
          {errors.username && (
            <p className='mt-1 text-sm text-red-500'>{errors.username}</p>
          )}
        </div>

        <div>
          <label className='label'>
            <span className='label-text'>Bio</span>
          </label>
          <textarea
            name='bio'
            value={formData.bio}
            onChange={handleInputChange}
            className='textarea textarea-bordered h-24 w-full'
            placeholder='Tell us about yourself'
            disabled={!isEditing}
          />
        </div>

        <div className='space-y-4'>
          <h3 className='text-lg font-semibold'>Social Links</h3>
          <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
            <div>
              <label className='label'>
                <span className='label-text'>Website</span>
              </label>
              <input
                type='url'
                name='social_website'
                value={formData.socials.website}
                onChange={handleInputChange}
                className='input input-bordered w-full'
                placeholder='https://your-website.com'
                disabled={!isEditing}
              />
            </div>

            <div>
              <label className='label'>
                <span className='label-text'>GitHub</span>
              </label>
              <input
                type='url'
                name='social_github'
                value={formData.socials.github}
                onChange={handleInputChange}
                className='input input-bordered w-full'
                placeholder='https://github.com/username'
                disabled={!isEditing}
              />
            </div>

            <div>
              <label className='label'>
                <span className='label-text'>Twitter</span>
              </label>
              <input
                type='url'
                name='social_twitter'
                value={formData.socials.twitter}
                onChange={handleInputChange}
                className='input input-bordered w-full'
                placeholder='https://twitter.com/username'
                disabled={!isEditing}
              />
            </div>

            <div>
              <label className='label'>
                <span className='label-text'>Instagram</span>
              </label>
              <input
                type='url'
                name='social_instagram'
                value={formData.socials.instagram}
                onChange={handleInputChange}
                className='input input-bordered w-full'
                placeholder='https://instagram.com/username'
                disabled={!isEditing}
              />
            </div>

            <div>
              <label className='label'>
                <span className='label-text'>Facebook</span>
              </label>
              <input
                type='url'
                name='social_facebook'
                value={formData.socials.facebook}
                onChange={handleInputChange}
                className='input input-bordered w-full'
                placeholder='https://facebook.com/username'
                disabled={!isEditing}
              />
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}
