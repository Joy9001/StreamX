import React from 'react'
import { Globe, Github, Twitter, Instagram, Facebook } from 'lucide-react'

function SocialLinks({ profile }) {
  return (
    <div className="w-[300px] bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out hover:-translate-y-1">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-bold bg-gradient-to-r from-pink-300 to-pink-500 bg-clip-text text-transparent">
          Social Links
        </h3>
      </div>
      <ul className="space-y-4">
        <li className="flex items-center gap-4 text-gray-700 hover:text-primary-500 transition-colors duration-300">
          <Globe className="w-5 h-5" />
          <a href={profile.website} className="hover:underline">{profile.website}</a>
        </li>
        <li className="flex items-center gap-4 text-gray-700 hover:text-primary-500 transition-colors duration-300">
          <Github className="w-5 h-5" />
          <a href={profile.github} className="hover:underline">{profile.github}</a>
        </li>
        <li className="flex items-center gap-4 text-gray-700 hover:text-primary-500 transition-colors duration-300">
          <Twitter className="w-5 h-5" />
          <a href={profile.twitter} className="hover:underline">{profile.twitter}</a>
        </li>
        <li className="flex items-center gap-4 text-gray-700 hover:text-primary-500 transition-colors duration-300">
          <Instagram className="w-5 h-5" />
          <a href={profile.instagram} className="hover:underline">{profile.instagram}</a>
        </li>
        <li className="flex items-center gap-4 text-gray-700 hover:text-primary-500 transition-colors duration-300">
          <Facebook className="w-5 h-5" />
          <a href={profile.facebook} className="hover:underline">{profile.facebook}</a>
        </li>
      </ul>
    </div>
  )
}

export default SocialLinks
