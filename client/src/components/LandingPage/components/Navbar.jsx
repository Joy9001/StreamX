import { useContext, useState } from 'react'
import { ActiveTabContext } from '../contexts/ActiveTabContext'

export default () => {
  const { activeTab, setActiveTab } = useContext(ActiveTabContext)
  const [open, setOpen] = useState(false)
  const onClickHandler = (tabClicked) => {
    setOpen(!open)
    setActiveTab(tabClicked)
  }
  return (
    <nav
      className={
        'fixed inset-x-0 top-0 z-50 grid auto-rows-min grid-cols-2 items-center justify-between bg-white px-5 py-6 drop-shadow-md md:px-[100px] lg:bottom-auto lg:flex lg:flex-row lg:py-2 h-20' +
        (open ? ' bottom-0' : ' ')
      }>
      <div className='flex'>
        <img
          className=' h-[3rem] w-[3rem]'
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
            'hover:bg-blue py-4 text-center duration-300 hover:bg-opacity-10 lg:hover:bg-white lg:hover:bg-opacity-100 lg:hover:font-semibold text-[18px]' +
            (activeTab == 'home' ? ' lg:font-semibold' : '')
          }
          onClick={() => onClickHandler('home')}>
          <a href='#home'>Home</a>
        </li>
        <li
          className={
            'hover:bg-blue py-4 text-center duration-300 hover:bg-opacity-10 lg:hover:bg-white lg:hover:bg-opacity-100 lg:hover:font-semibold text-[18px]' +
            (activeTab == 'about' ? ' lg:font-semibold' : '')
          }
          onClick={() => onClickHandler('about')}>
          <a href='#about'>About</a>
        </li>
        <li
          className={
            'hover:bg-blue py-4 text-center duration-300 hover:bg-opacity-10 lg:hover:bg-white lg:hover:bg-opacity-100 lg:hover:font-semibold text-[18px]' +
            (activeTab == 'services' ? ' lg:font-semibold' : '')
          }
          onClick={() => onClickHandler('services')}>
          <a href='#services'>Services</a>
        </li>
        <li
          className={
            'hover:bg-blue py-4 text-center duration-300 hover:bg-opacity-10 lg:hover:bg-white lg:hover:bg-opacity-100 lg:hover:font-semibold text-[18px]' +
            (activeTab == 'projects' ? ' lg:font-semibold' : '')
          }
          onClick={() => onClickHandler('projects')}>
          <a href='#projects'>Pricing</a>
        </li>
        <li
          className={
            'hover:bg-blue py-4 text-center duration-300 hover:bg-opacity-10 lg:hover:bg-white lg:hover:bg-opacity-100 lg:hover:font-semibold text-[18px]' +
            (activeTab == 'testimonial' ? ' lg:font-semibold' : '')
          }
          onClick={() => onClickHandler('testimonial')}>
          <a href='#testimonial'>Testimonial</a>
        </li>
        <li
          className={
            'hover:bg-blue py-4 text-center duration-300 hover:bg-opacity-10 lg:hover:bg-white lg:hover:bg-opacity-100 lg:hover:font-semibold text-[18px]' +
            (activeTab == 'testimonial' ? ' lg:font-semibold' : '')
          }>
          <button className="bg-transparent text-blue-600  font-semibold px-4 rounded-lg">
            Sign in
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
