import { Facebook, Github, Globe, Instagram, Twitter } from 'lucide-react'

function SocialLinks() {
  return (
    <div className='w-[300px] rounded-lg bg-white p-6 shadow-lg transition-all duration-300 ease-in-out hover:-translate-y-1 hover:shadow-xl'>
      <div className='mb-6 flex items-center justify-between'>
        <h3 className='bg-gradient-to-r from-pink-300 to-pink-500 bg-clip-text text-2xl font-bold text-transparent'>
          Social Links
        </h3>
      </div>
      <ul className='space-y-4'>
        <li className='hover:text-primary-500 flex items-center gap-4 text-gray-700 transition-colors duration-300'>
          <Globe className='h-5 w-5' />
          <span>Website</span>
        </li>
        <li className='hover:text-primary-500 flex items-center gap-4 text-gray-700 transition-colors duration-300'>
          <Github className='h-5 w-5' />
          <span>GitHub</span>
        </li>
        <li className='hover:text-primary-500 flex items-center gap-4 text-gray-700 transition-colors duration-300'>
          <Twitter className='h-5 w-5' />
          <span>Twitter</span>
        </li>
        <li className='hover:text-primary-500 flex items-center gap-4 text-gray-700 transition-colors duration-300'>
          <Instagram className='h-5 w-5' />
          <span>Instagram</span>
        </li>
        <li className='hover:text-primary-500 flex items-center gap-4 text-gray-700 transition-colors duration-300'>
          <Facebook className='h-5 w-5' />
          <span>Facebook</span>
        </li>
      </ul>
    </div>
  )
}

export default SocialLinks
