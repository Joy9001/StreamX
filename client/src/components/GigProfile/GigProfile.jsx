'use client'

import React, { useState } from 'react'
import Navbar from '../NavBar/Navbar'
import GigHeader from './GigHeader'
import EditGig from './EditGig'
import { Mail, MapPin, Globe, Briefcase, Star, DollarSign, Clock, Play } from 'lucide-react'

// Mock data for demonstration
const editorData = {
  name: "Jane Doe",
  email: "jane.doe@example.com",
  address: "123 Editor Street, Writeville, WC 12345",
  languages: ["English", "Spanish", "French"],
  image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=256&q=80",
  bio: "Experienced editor with a passion for perfecting written content.",
  skills: ["Proofreading", "Copy Editing", "Content Editing"],
  gig_description: "I offer top-notch editing services to polish your writing to perfection.",
  rating: 4.8,
  plans: {
    basic: {
      price: 50,
      desc: "Basic proofreading and grammar check",
      deliveryTime: 2,
      services: ["Grammar check", "Spelling check", "Punctuation check"],
      serviceOptions: [1, 2, 3]
    },
    standard: {
      price: 100,
      desc: "Comprehensive editing including style improvements",
      deliveryTime: 4,
      serviceOptions: [1, 2, 3, 4]
    },
    premium: {
      price: 200,
      desc: "In-depth editing with multiple revisions",
      deliveryTime: 7,
      serviceOptions: [1, 2, 3, 4, 5]
    }
  },
  preview: {
    videos: [
      {
        video_id: 1,
        thumbnail: "/placeholder.svg?height=150&width=150",
        metadata: { filename: "sample_1.mp4", size: 15000000 }
      },
      {
        video_id: 2,
        thumbnail: "/placeholder.svg?height=150&width=150",
        metadata: { filename: "sample_2.mp4", size: 20000000 }
      }
    ]
  }
}

function GigProfile() {
  const [showEditForm, setShowEditForm] = useState(false)
  const [activeTab, setActiveTab] = useState('basic')

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' bytes'
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB'
    else return (bytes / 1048576).toFixed(1) + ' MB'
  }

  return (
    <div className="flex h-screen">
      <div className="navbar h-full transition-all duration-300 w-[15%] pl-0">
        <Navbar title='Gig Profile'/>
      </div>
      <div className="flex-1 flex flex-col overflow-auto p-2">
        <GigHeader onEditClick={() => setShowEditForm(true)} />
        
        <div className="p-6 space-y-4">
          {/* Gig Cards Container */}
          <div className="grid grid-cols-1 gap-6">
            {/* Gig Card */}
            <div className="bg-white rounded-lg shadow-xl overflow-hidden">
              <div className="flex flex-col md:flex-row">
                {/* Left Section - Image and Basic Info */}
                <div className="w-full md:w-1/3 bg-pink-50 p-6">
                  <div className="flex flex-col items-center space-y-6">
                    <div className="relative">
                      <img src={editorData.image} alt={editorData.name} className="w-36 h-36 rounded-full object-cover border-4 border-white shadow-lg" />
                      <div className="absolute -bottom-2 -right-2 bg-pink-100 rounded-full p-2 shadow-md">
                        <Star className="text-yellow-400 w-6 h-6" />
                      </div>
                    </div>

                    <div className="text-center space-y-2">
                      <h2 className="text-2xl font-bold text-pink-800">{editorData.name}</h2>
                      <div className="flex items-center justify-center">
                        <span className="text-lg font-semibold text-gray-600">{editorData.rating} Rating</span>
                      </div>
                    </div>

                    <div className="w-full space-y-4 pt-4 border-t border-pink-200">
                      <div className="flex items-center space-x-3 p-3 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
                        <Mail className="text-pink-500 w-5 h-5" />
                        <div className="flex flex-col">
                          <span className="text-xs text-pink-500 font-medium">Email</span>
                          <span className="text-sm text-gray-700">{editorData.email}</span>
                        </div>
                      </div>

                      <div className="flex items-center space-x-3 p-3 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
                        <MapPin className="text-pink-500 w-5 h-5" />
                        <div className="flex flex-col">
                          <span className="text-xs text-pink-500 font-medium">Address</span>
                          <span className="text-sm text-gray-700">{editorData.address}</span>
                        </div>
                      </div>

                      <div className="flex items-center space-x-3 p-3 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
                        <Globe className="text-pink-500 w-5 h-5" />
                        <div className="flex flex-col">
                          <span className="text-xs text-pink-500 font-medium">Languages</span>
                          <span className="text-sm text-gray-700">{editorData.languages.join(", ")}</span>
                        </div>
                      </div>

                      <div className="flex items-center space-x-3 p-3 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
                        <Briefcase className="text-pink-500 w-5 h-5" />
                        <div className="flex flex-col">
                          <span className="text-xs text-pink-500 font-medium">Skills</span>
                          <span className="text-sm text-gray-700">{editorData.skills.join(", ")}</span>
                        </div>
                      </div>
                    </div>

                    <div className="w-full pt-4 border-t border-pink-200">
                      <div className="text-center">
                        <span className="inline-block px-4 py-2 bg-pink-100 text-pink-700 rounded-full text-sm font-medium">
                          Professional Editor
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Section - Pricing Plans */}
                <div className="w-full md:w-2/3 p-6">
                  <div className="mb-4">
                    <h3 className="text-lg font-semibold text-pink-700 mb-2">About This Gig</h3>
                    <p className="text-gray-700">{editorData.gig_description}</p>
                  </div>

                  <div className="space-y-4">
                    {Object.entries(editorData.plans).map(([planName, plan]) => (
                      <div key={planName} className="bg-gray-50 rounded-lg p-4">
                        <div className="flex justify-between items-center mb-2">
                          <h4 className="text-lg font-semibold text-pink-600 capitalize">{planName}</h4>
                          <div className="flex items-center">
                            <DollarSign className="text-green-500 w-4 h-4" />
                            <span className="text-xl font-bold text-green-600">{plan.price}</span>
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{plan.desc}</p>
                        <div className="flex items-center text-sm text-gray-500">
                          <Clock className="w-4 h-4 mr-1" />
                          <span>{plan.deliveryTime} days delivery</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Preview Videos */}
                  <div className="mt-6">
                    <h3 className="text-lg font-semibold text-pink-700 mb-2">Sample Work</h3>
                    <div className="grid grid-cols-2 gap-4">
                      {editorData.preview.videos.map((video) => (
                        <div key={video.video_id} className="bg-gray-50 p-2 rounded">
                          <div className="relative">
                            <img src={video.thumbnail} alt={`Thumbnail ${video.video_id}`} className="w-full h-24 object-cover rounded" />
                            <div className="absolute inset-0 flex items-center justify-center">
                              <Play className="text-white bg-pink-500 rounded-full p-1" />
                            </div>
                          </div>
                          <p className="text-sm mt-1 truncate">{video.metadata.filename}</p>
                          <p className="text-xs text-gray-500">{formatFileSize(video.metadata.size)}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Edit Gig Modal */}
        <dialog
          id="edit_gig_modal"
          className={`modal ${showEditForm ? 'modal-open' : ''}`}
        >
          <div className="modal-box max-w-4xl">
            <form method="dialog">
              <button
                className="btn btn-circle btn-ghost btn-sm absolute right-2 top-2"
                onClick={() => setShowEditForm(false)}
              >
                ✕
              </button>
            </form>
            <EditGig onClose={() => setShowEditForm(false)} />
          </div>
          <form method="dialog" className="modal-backdrop">
            <button onClick={() => setShowEditForm(false)}>close</button>
          </form>
        </dialog>
      </div>
    </div>
  )
}

export default GigProfile
