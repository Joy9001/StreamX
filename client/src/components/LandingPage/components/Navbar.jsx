import { useAuth0 } from '@auth0/auth0-react'
import { useContext, useState } from 'react'
import { ActiveTabContext } from '../contexts/ActiveTabContext'

export default function Navbar() {
  const { activeTab, setActiveTab } = useContext(ActiveTabContext)
  const { loginWithRedirect } = useAuth0()

  const [open, setOpen] = useState(false)
  const onClickHandler = (tabClicked) => {
    setOpen(!open)
    setActiveTab(tabClicked)
  }
  return (
    <nav
      className={
        'fixed inset-x-0 top-0 z-50 grid h-20 auto-rows-min grid-cols-2 items-center justify-between bg-white px-5 py-6 drop-shadow-md md:px-[100px] lg:bottom-auto lg:flex lg:flex-row lg:py-2' +
        (open ? ' bottom-0' : ' ')
      }>
      <div className='flex'>
        <img
          className='h-[3rem] w-[3rem]'
          src='http://localhost:5173/src/assets/logoX.png'
          alt='logo'
        />
        <p className='text-[30px] font-bold'>StreamX</p>
      </div>
      <ul
        className={
          'font-nunito order-3 col-span-2 mt-5 text-[1.1rem] font-semibold lg:mt-0 lg:flex lg:flex-row lg:gap-6 lg:text-xs lg:font-light' +
          (open ? ' block' : ' hidden')
        }>
        <li
          className={
            'hover:bg-blue py-4 text-center text-[18px] duration-300 hover:bg-opacity-10 lg:hover:bg-white lg:hover:bg-opacity-100 lg:hover:font-semibold' +
            (activeTab == 'home' ? ' lg:font-semibold' : '')
          }
          onClick={() => onClickHandler('home')}>
          <a href='#home'>Home</a>
        </li>
        <li
          className={
            'hover:bg-blue py-4 text-center text-[18px] duration-300 hover:bg-opacity-10 lg:hover:bg-white lg:hover:bg-opacity-100 lg:hover:font-semibold' +
            (activeTab == 'about' ? ' lg:font-semibold' : '')
          }
          onClick={() => onClickHandler('about')}>
          <a href='#about'>About</a>
        </li>
        <li
          className={
            'hover:bg-blue py-4 text-center text-[18px] duration-300 hover:bg-opacity-10 lg:hover:bg-white lg:hover:bg-opacity-100 lg:hover:font-semibold' +
            (activeTab == 'services' ? ' lg:font-semibold' : '')
          }
          onClick={() => onClickHandler('services')}>
          <a href='#services'>Services</a>
        </li>
        <li
          className={
            'hover:bg-blue py-4 text-center text-[18px] duration-300 hover:bg-opacity-10 lg:hover:bg-white lg:hover:bg-opacity-100 lg:hover:font-semibold' +
            (activeTab == 'projects' ? ' lg:font-semibold' : '')
          }
          onClick={() => onClickHandler('projects')}>
          <a href='#projects'>Pricing</a>
        </li>
        <li
          className={
            'hover:bg-blue py-4 text-center text-[18px] duration-300 hover:bg-opacity-10 lg:hover:bg-white lg:hover:bg-opacity-100 lg:hover:font-semibold' +
            (activeTab == 'testimonial' ? ' lg:font-semibold' : '')
          }
          onClick={() => onClickHandler('testimonial')}>
          <a href='#testimonial'>Testimonial</a>
        </li>
        <li
          className={
            'hover:bg-blue py-4 text-center text-[18px] duration-300 hover:bg-opacity-10 lg:hover:bg-white lg:hover:bg-opacity-100 lg:hover:font-semibold' +
            (activeTab == 'testimonial' ? ' lg:font-semibold' : '')
          }>
          <button
            className='rounded-lg bg-transparent px-4 font-semibold text-blue-600'
            onClick={() =>
              loginWithRedirect({
                access_type: 'offline',
                connection_scope: 'https://www.googleapis.com/auth/youtube',
                authorizationParams: {
                  // connection: 'google-oauth2',
                  access_type: 'offline',
                  connection_scope: 'https://www.googleapis.com/auth/youtube',
                  prompt: 'consent',
                  scope:
                    'read:users read:user_idp_tokens read:current_user read:current_user_metadata update:current_user_metadata openid profile email offline_access',
                },
              })
            }>
            Sign In
          </button>
        </li>
      </ul>
      <div
        className='order-2 flex w-min flex-col items-center gap-y-1 justify-self-end lg:hidden'
        onClick={onClickHandler}>
        <span
          className={
            'block h-0.5 w-5 bg-black duration-100 ease-in' +
            (open ? ' translate-y-1.5 rotate-45' : '')
          }
        />
        <span
          className={
            'block h-0.5 w-4 bg-black duration-75 ease-in' +
            (open ? ' invisible' : 'visible')
          }
        />
        <span
          className={
            'block h-0.5 w-5 bg-black duration-100 ease-in' +
            (open ? ' -translate-y-1.5 -rotate-45' : '')
          }
        />
      </div>
    </nav>
  )
}
