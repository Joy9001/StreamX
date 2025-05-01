import React, { useState, useEffect } from 'react'

function OwnerModal({ isOpen, onClose, onSubmit, owner, isCreating }) {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    YTchannelname: '',
    ytChannelLink: '',
    storageLimit: 10 * 1024, // Default 10GB in KB
  })

  useEffect(() => {
    if (owner) {
      setFormData({
        username: owner.username || '',
        email: owner.email || '',
        password: owner.password || '',
        YTchannelname: owner.YTchannelname || '',
        ytChannelLink: owner.ytChannelLink || '',
        storageLimit: owner.storageLimit || 10 * 1024,
      })
    }
  }, [owner])

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit(formData)
  }

  if (!isOpen) return null

  return (
    <dialog open className='modal'>
      <div className='modal-box'>
        <h3 className='text-lg font-bold'>
          {isCreating ? 'Add New Owner' : 'Edit Owner'}
        </h3>

        <form onSubmit={handleSubmit}>
          <div className='py-4'>
            <label className='mb-2 block'>Username</label>
            <input
              type='text'
              name='username'
              value={formData.username}
              onChange={(e) =>
                setFormData({ ...formData, username: e.target.value })
              }
              className='input input-bordered mb-4 w-full'
              required
            />

            <label className='mb-2 block'>Email</label>
            <input
              type='email'
              name='email'
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              className='input input-bordered mb-4 w-full'
              readOnly={!isCreating}
              required
            />

            {isCreating && (
              <>
                <label className='mb-2 block'>Password</label>
                <input
                  type='password'
                  name='password'
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  className='input input-bordered mb-4 w-full'
                  required
                />
              </>
            )}

            <label className='mb-2 block'>YouTube Channel Name</label>
            <input
              type='text'
              name='YTchannelname'
              value={formData.YTchannelname}
              onChange={(e) =>
                setFormData({ ...formData, YTchannelname: e.target.value })
              }
              className='input input-bordered mb-4 w-full'
            />

            <label className='mb-2 block'>YouTube Channel Link</label>
            <input
              type='text'
              name='ytChannelLink'
              value={formData.ytChannelLink}
              onChange={(e) =>
                setFormData({ ...formData, ytChannelLink: e.target.value })
              }
              className='input input-bordered mb-4 w-full'
            />

            <label className='mb-2 block'>Storage Limit (GB)</label>
            <input
              type='number'
              name='storageLimit'
              value={formData.storageLimit / 1024}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  storageLimit: Number(e.target.value) * 1024,
                })
              }
              className='input input-bordered mb-4 w-full'
              min='1'
              required
            />
          </div>

          <div className='modal-action'>
            <button type='button' className='btn btn-ghost' onClick={onClose}>
              Cancel
            </button>
            <button type='submit' className='btn btn-primary'>
              {isCreating ? 'Create Owner' : 'Update Owner'}
            </button>
          </div>
        </form>
      </div>
    </dialog>
  )
}

export default OwnerModal
