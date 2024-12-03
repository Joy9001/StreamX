import React, { useState, useRef, useEffect } from 'react'
import { useAuth0 } from '@auth0/auth0-react'
import axios from 'axios'

function EditGig({ onClose, editorData, editorPlans }) {
  const { getAccessTokenSilently } = useAuth0()
  const [selectedPlan, setSelectedPlan] = useState('basic')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  
  // Initialize form data with existing editor data
  const [formData, setFormData] = useState({
    name: editorData?.name || '-',
    email: editorData?.email || '-',
    address: editorData?.address || '-',
    languages: editorData?.languages?.join(', ') || '-',
    image: editorData?.image || null,
    bio: editorData?.bio || '-',
    skills: editorData?.skills?.join(', ') || '-',
    gig_description: editorData?.gig_description || '-',
    rating: editorData?.rating || 0,
    plans: {
      basic: {
        price: editorPlans?.basic?.price || 0,
        desc: editorPlans?.basic?.desc || '-',
        deliveryTime: editorPlans?.basic?.deliveryTime || 0,
        services: editorPlans?.basic?.services?.join(', ') || '-'
      },
      standard: {
        price: editorPlans?.standard?.price || 0,
        desc: editorPlans?.standard?.desc || '-',
        deliveryTime: editorPlans?.standard?.deliveryTime || 0,
        services: editorPlans?.standard?.services?.join(', ') || '-'
      },
      premium: {
        price: editorPlans?.premium?.price || 0,
        desc: editorPlans?.premium?.desc || '-',
        deliveryTime: editorPlans?.premium?.deliveryTime || 0,
        services: editorPlans?.premium?.services?.join(', ') || '-'
      }
    }
  })

  const fileInputRef = useRef(null)

  const handleInputChange = (e) => {
    const { name, value } = e.target
    if (name.includes('.')) {
      // Handle nested plan data
      const [plan, field] = name.split('.')
      setFormData(prev => ({
        ...prev,
        plans: {
          ...prev.plans,
          [plan]: {
            ...prev.plans[plan],
            [field]: value
          }
        }
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }))
    }
  }

  const handleFileChange = async (e) => {
    const file = e.target.files[0]
    if (file) {
      // Here you would typically upload the file to your server or cloud storage
      // For now, we'll just store it as a local URL
      const imageUrl = URL.createObjectURL(file)
      setFormData(prev => ({
        ...prev,
        image: imageUrl
      }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const token = await getAccessTokenSilently()

      // Prepare editor gig data
      const editorGigData = {
        name: formData.name,
        email: formData.email,
        address: formData.address,
        languages: formData.languages.split(',').map(lang => lang.trim()),
        image: formData.image,
        bio: formData.bio,
        skills: formData.skills.split(',').map(skill => skill.trim()),
        gig_description: formData.gig_description,
        rating: formData.rating
      }

      // Prepare plans data
      const plansData = {
        basic: {
          price: Number(formData.plans.basic.price),
          desc: formData.plans.basic.desc,
          deliveryTime: Number(formData.plans.basic.deliveryTime),
          services: formData.plans.basic.services.split(',').map(service => service.trim())
        },
        standard: {
          price: Number(formData.plans.standard.price),
          desc: formData.plans.standard.desc,
          deliveryTime: Number(formData.plans.standard.deliveryTime),
          services: formData.plans.standard.services.split(',').map(service => service.trim())
        },
        premium: {
          price: Number(formData.plans.premium.price),
          desc: formData.plans.premium.desc,
          deliveryTime: Number(formData.plans.premium.deliveryTime),
          services: formData.plans.premium.services.split(',').map(service => service.trim())
        }
      }

      // Update editor gig
      await axios.patch(
        `${import.meta.env.VITE_BACKEND_URL}/editor_gig/email/${formData.email}`,
        editorGigData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      // Update plans
      await axios.patch(
        `${import.meta.env.VITE_BACKEND_URL}/editor_gig/plans/email/${formData.email}`,
        plansData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      onClose()
      // Optionally refresh the page or update the parent component
      window.location.reload()
    } catch (err) {
      console.error('Error updating profile:', err)
      setError(err.response?.data?.message || 'Error updating profile')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold text-pink-600 mb-6">Edit Editor GIG Profile</h2>
      
      {error && (
        <div className="alert alert-error mb-4">
          <p>{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="space-y-4">
          <div className="form-control">
            <label className="label">
              <span className="label-text font-semibold">Full Name</span>
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Name"
              className="input input-bordered w-full"
            />
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text font-semibold">Address</span>
            </label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              placeholder="Address"
              className="input input-bordered w-full"
            />
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text font-semibold">Languages</span>
            </label>
            <input
              type="text"
              name="languages"
              value={formData.languages}
              onChange={handleInputChange}
              placeholder="Languages (comma-separated)"
              className="input input-bordered w-full"
            />
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text font-semibold">Profile Image</span>
            </label>
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
                Upload Profile Image
              </button>
              {formData.image && <span className="text-sm text-gray-600">Image selected</span>}
            </div>
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text font-semibold">Bio</span>
            </label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleInputChange}
              placeholder="Tell us about yourself"
              className="textarea textarea-bordered w-full h-24"
            />
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text font-semibold">Skills</span>
            </label>
            <input
              type="text"
              name="skills"
              value={formData.skills}
              onChange={handleInputChange}
              placeholder="Skills (comma-separated)"
              className="input input-bordered w-full"
            />
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text font-semibold">Gig Description</span>
            </label>
            <textarea
              name="gig_description"
              value={formData.gig_description}
              onChange={handleInputChange}
              placeholder="Describe your services"
              className="textarea textarea-bordered w-full h-24"
            />
          </div>
        </div>

        {/* Plans */}
        <div className="space-y-6">
          <h3 className="text-xl font-semibold text-pink-600">Pricing Plans</h3>
          
          <div className="flex space-x-4">
            <button
              type="button"
              onClick={() => setSelectedPlan('basic')}
              className={`btn ${selectedPlan === 'basic' ? 'btn-primary' : 'btn-outline'}`}
            >
              Basic
            </button>
            <button
              type="button"
              onClick={() => setSelectedPlan('standard')}
              className={`btn ${selectedPlan === 'standard' ? 'btn-primary' : 'btn-outline'}`}
            >
              Standard
            </button>
            <button
              type="button"
              onClick={() => setSelectedPlan('premium')}
              className={`btn ${selectedPlan === 'premium' ? 'btn-primary' : 'btn-outline'}`}
            >
              Premium
            </button>
          </div>

          <div className="space-y-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">Price</span>
              </label>
              <input
                type="number"
                name={`${selectedPlan}.price`}
                value={formData.plans[selectedPlan].price}
                onChange={handleInputChange}
                placeholder="Price"
                className="input input-bordered w-full"
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">Plan Description</span>
              </label>
              <textarea
                name={`${selectedPlan}.desc`}
                value={formData.plans[selectedPlan].desc}
                onChange={handleInputChange}
                placeholder="Plan Description"
                className="textarea textarea-bordered w-full"
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">Delivery Time (days)</span>
              </label>
              <input
                type="number"
                name={`${selectedPlan}.deliveryTime`}
                value={formData.plans[selectedPlan].deliveryTime}
                onChange={handleInputChange}
                placeholder="Delivery Time (days)"
                className="input input-bordered w-full"
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">Services</span>
              </label>
              <textarea
                name={`${selectedPlan}.services`}
                value={formData.plans[selectedPlan].services}
                onChange={handleInputChange}
                placeholder="Services (comma-separated)"
                className="textarea textarea-bordered w-full"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={onClose}
            className="btn btn-outline"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
          >
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default EditGig
