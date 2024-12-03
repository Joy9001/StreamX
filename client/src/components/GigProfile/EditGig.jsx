import React, { useState, useRef } from 'react'

function EditGig({ onClose }) {
  const [selectedPlan, setSelectedPlan] = useState('Basic')
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    languages: '',
    profileImage: null,
    bio: '',
    skills: '',
    gigDescription: '',
    price: '',
    description: '',
    deliveryTime: '',
    services: '',
    serviceOptions: '',
    sampleWork: null
  })

  const fileInputRef = useRef(null)
  const sampleWorkRef = useRef(null)

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setFormData(prev => ({
        ...prev,
        profileImage: file
      }))
    }
  }

  const handleSampleWorkUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      setFormData(prev => ({
        ...prev,
        sampleWork: file
      }))
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log('Form submitted:', formData)
    onClose()
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold text-pink-600 mb-6">Editor GIG Profile</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="space-y-4">
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="Name"
            className="input input-bordered w-full"
          />

          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleInputChange}
            placeholder="Address"
            className="input input-bordered w-full"
          />

          <input
            type="text"
            name="languages"
            value={formData.languages}
            onChange={handleInputChange}
            placeholder="Languages (comma-separated)"
            className="input input-bordered w-full"
          />

          <div className="flex items-center space-x-4">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
              accept="image/*"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="btn btn-outline"
            >
              Choose Profile Picture
            </button>
            <span className="text-gray-600">
              {formData.profileImage ? formData.profileImage.name : 'No file chosen'}
            </span>
          </div>

          <div className="flex items-center space-x-4">
            <input
              type="file"
              ref={sampleWorkRef}
              onChange={handleSampleWorkUpload}
              className="hidden"
              accept="video/*"
            />
            <button
              type="button"
              onClick={() => sampleWorkRef.current?.click()}
              className="btn btn-outline"
            >
              Upload Sample Work
            </button>
            <span className="text-gray-600">
              {formData.sampleWork ? formData.sampleWork.name : 'No file chosen'}
            </span>
          </div>

          <textarea
            name="bio"
            value={formData.bio}
            onChange={handleInputChange}
            placeholder="Bio"
            className="textarea textarea-bordered w-full h-24"
          />

          <input
            type="text"
            name="skills"
            value={formData.skills}
            onChange={handleInputChange}
            placeholder="Skills (comma-separated)"
            className="input input-bordered w-full"
          />

          <textarea
            name="gigDescription"
            value={formData.gigDescription}
            onChange={handleInputChange}
            placeholder="Gig Description"
            className="textarea textarea-bordered w-full h-24"
          />
        </div>

        {/* Pricing Plans */}
        <div className="space-y-4">
          <div className="flex justify-center space-x-4 mb-6">
            <button
              type="button"
              onClick={() => setSelectedPlan('Basic')}
              className={`btn ${selectedPlan === 'Basic' ? 'bg-pink-200 text-gray-700' : 'btn-ghost'}`}
            >
              Basic
            </button>
            <button
              type="button"
              onClick={() => setSelectedPlan('Standard')}
              className={`btn ${selectedPlan === 'Standard' ? 'bg-pink-200 text-gray-700' : 'btn-ghost'}`}
            >
              Standard
            </button>
            <button
              type="button"
              onClick={() => setSelectedPlan('Premium')}
              className={`btn ${selectedPlan === 'Premium' ? 'bg-pink-200 text-gray-700' : 'btn-ghost'}`}
            >
              Premium
            </button>
          </div>

          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleInputChange}
            placeholder="Price"
            className="input input-bordered w-full"
          />

          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Description"
            className="textarea textarea-bordered w-full h-24"
          />

          <input
            type="number"
            name="deliveryTime"
            value={formData.deliveryTime}
            onChange={handleInputChange}
            placeholder="Delivery Time (days)"
            className="input input-bordered w-full"
          />

          <textarea
            name="services"
            value={formData.services}
            onChange={handleInputChange}
            placeholder="Services (one per line)"
            className="textarea textarea-bordered w-full h-24"
          />

          <input
            type="text"
            name="serviceOptions"
            value={formData.serviceOptions}
            onChange={handleInputChange}
            placeholder="Service Options (comma-separated numbers)"
            className="input input-bordered w-full"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="btn w-full bg-pink-500 hover:bg-pink-600 text-white border-none"
        >
          Edit GIG Profile
        </button>
      </form>
    </div>
  )
}

export default EditGig
