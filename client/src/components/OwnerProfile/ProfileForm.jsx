import { Camera, Edit2, Save, X } from 'lucide-react'
import { useState, useRef } from 'react'
import profileData from '../../data/profileData.json'

export default function ProfileForm() {
  const [isEditing, setIsEditing] = useState(false)
  const fileInputRef = useRef(null)
  const currentProfile = profileData.profiles[1] // Using Sarah's profile as default

  const [formData, setFormData] = useState({
    username: currentProfile.name,
    bio: currentProfile.bio,
    socials: {
      website: currentProfile.website || '',
      github: `https://github.com/${currentProfile.github || ''}`,
      twitter: `https://twitter.com/${currentProfile.twitter?.replace('@', '') || ''}`,
      instagram: `https://instagram.com/${currentProfile.instagram || ''}`,
      facebook: `https://facebook.com/${currentProfile.facebook || ''}`,
    },
    profilephoto: currentProfile.profilePicture,
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
  }

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
                onClick={() => setIsEditing(false)}
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

      <div className='flex flex-col gap-8 md:flex-row'>
        <div className='flex-1'>
          <div className='form-control w-full'>
            <label className='label'>
              <span className='label-text'>Username</span>
            </label>
            <input
              type='text'
              name='username'
              className={`input input-bordered w-full ${
                errors.username ? 'input-error' : ''
              }`}
              value={formData.username}
              onChange={handleInputChange}
              disabled={!isEditing}
            />
            {errors.username && (
              <label className='label'>
                <span className='label-text-alt text-error'>
                  {errors.username}
                </span>
              </label>
            )}
          </div>

          <div className='form-control w-full'>
            <label className='label'>
              <span className='label-text'>Bio</span>
            </label>
            <textarea
              name='bio'
              className='textarea textarea-bordered h-24'
              value={formData.bio}
              onChange={handleInputChange}
              disabled={!isEditing}
            />
          </div>

          <div className='divider'>Social Links</div>

          <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
            <div className='form-control'>
              <label className='label'>
                <span className='label-text'>Website</span>
              </label>
              <input
                type='url'
                name='social_website'
                className='input input-bordered'
                value={formData.socials.website}
                onChange={handleInputChange}
                disabled={!isEditing}
              />
            </div>

            <div className='form-control'>
              <label className='label'>
                <span className='label-text'>GitHub</span>
              </label>
              <input
                type='url'
                name='social_github'
                className='input input-bordered'
                value={formData.socials.github}
                onChange={handleInputChange}
                disabled={!isEditing}
              />
            </div>

            <div className='form-control'>
              <label className='label'>
                <span className='label-text'>Twitter</span>
              </label>
              <input
                type='url'
                name='social_twitter'
                className='input input-bordered'
                value={formData.socials.twitter}
                onChange={handleInputChange}
                disabled={!isEditing}
              />
            </div>

            <div className='form-control'>
              <label className='label'>
                <span className='label-text'>Instagram</span>
              </label>
              <input
                type='url'
                name='social_instagram'
                className='input input-bordered'
                value={formData.socials.instagram}
                onChange={handleInputChange}
                disabled={!isEditing}
              />
            </div>

            <div className='form-control'>
              <label className='label'>
                <span className='label-text'>Facebook</span>
              </label>
              <input
                type='url'
                name='social_facebook'
                className='input input-bordered'
                value={formData.socials.facebook}
                onChange={handleInputChange}
                disabled={!isEditing}
              />
            </div>
          </div>
        </div>

        <div className='w-64'>
          <div className='text-center'>
            <div className='avatar'>
              <div className='w-32 rounded-full ring ring-primary ring-offset-2 ring-offset-base-100'>
                <img src={formData.profilephoto} alt='Profile' />
              </div>
            </div>
            {isEditing && (
              <div className='mt-4'>
                <input
                  type='file'
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  accept='image/*'
                  className='hidden'
                />
                <button
                  className='btn btn-outline btn-sm'
                  onClick={() => fileInputRef.current?.click()}>
                  <Camera className='h-4 w-4' />
                  Upload Photo
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
