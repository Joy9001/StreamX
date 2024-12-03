import React, { useState, useEffect } from 'react'

function EditorModal({ isOpen, onClose, onSubmit, editor, isCreating }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    location: '',
    software: '',
    specializations: '',
  })

  useEffect(() => {
    if (editor) {
      setFormData({
        name: editor.name || '',
        email: editor.email || '',
        phone: editor.phone || '',
        location: editor.location || '',
        software: editor.software ? editor.software.join(', ') : '',
        specializations: editor.specializations ? editor.specializations.join(', ') : '',
      })
    }
  }, [editor])

  const handleSubmit = (e) => {
    e.preventDefault()
    const submissionData = {
      ...formData,
      software: formData.software.split(',').map(item => item.trim()).filter(Boolean),
      specializations: formData.specializations.split(',').map(item => item.trim()).filter(Boolean)
    }
    onSubmit(submissionData)
  }

  if (!isOpen) return null

  return (
    <dialog open className="modal">
      <div className="modal-box">
        <h3 className="text-lg font-bold">
          {isCreating ? 'Add New Editor' : 'Edit Editor'}
        </h3>

        <form onSubmit={handleSubmit}>
          <div className="py-4">
            <label className="mb-2 block">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="input input-bordered mb-4 w-full"
              required
            />

            <label className="mb-2 block">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="input input-bordered mb-4 w-full"
              readOnly={!isCreating}
              required
            />

            <label className="mb-2 block">Phone</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="input input-bordered mb-4 w-full"
              required
            />

            <label className="mb-2 block">Location</label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              className="input input-bordered mb-4 w-full"
            />

            <label className="mb-2 block">Software (comma-separated)</label>
            <input
              type="text"
              name="software"
              value={formData.software}
              onChange={(e) => setFormData({ ...formData, software: e.target.value })}
              className="input input-bordered mb-4 w-full"
              placeholder="e.g. Adobe Premiere, Final Cut Pro, DaVinci Resolve"
            />

            <label className="mb-2 block">Specializations (comma-separated)</label>
            <input
              type="text"
              name="specializations"
              value={formData.specializations}
              onChange={(e) => setFormData({ ...formData, specializations: e.target.value })}
              className="input input-bordered mb-4 w-full"
              placeholder="e.g. Color Grading, Motion Graphics, Sound Design"
            />
          </div>

          <div className="modal-action">
            <button type="button" className="btn btn-ghost" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              {isCreating ? 'Create Editor' : 'Update Editor'}
            </button>
          </div>
        </form>
      </div>
    </dialog>
  )
}

export default EditorModal
