import { useAuth0 } from '@auth0/auth0-react'
import { Link, useLocation } from 'react-router-dom'
import { disablePageScroll, enablePageScroll } from 'scroll-lock'

import { useState } from 'react'
import { logoX } from '../assets'
import MenuSvg from '../assets/svg/MenuSvg'
import { navigation } from '../constants'
import Button from './Button'
import { HamburgerMenu } from './design/Header'

const Header = () => {
  const location = useLocation()
  const [openNavigation, setOpenNavigation] = useState(false)
  const { loginWithRedirect, isAuthenticated } = useAuth0()

  const toggleNavigation = () => {
    if (openNavigation) {
      setOpenNavigation(false)
      enablePageScroll()
    } else {
      setOpenNavigation(true)
      disablePageScroll()
    }
  }

  const handleClick = () => {
    if (!openNavigation) return

    enablePageScroll()
    setOpenNavigation(false)
  }

  const handleAuth0Login = () => {
    loginWithRedirect({
      access_type: 'offline',
      connection_scope: 'https://www.googleapis.com/auth/youtube',
      authorizationParams: {
        access_type: 'offline',
        connection_scope: 'https://www.googleapis.com/auth/youtube',
        prompt: 'consent',
        scope:
          'read:users read:user_idp_tokens read:current_user read:current_user_metadata update:current_user_metadata openid profile email offline_access',
      },
    })
  }

  // Check if we're on the landing page
  const isLandingPage = location.pathname === '/' && !isAuthenticated

  return (
    <div
      className={`fixed left-0 top-0 z-50 w-full border-b border-n-6 lg:bg-n-8/90 lg:backdrop-blur-sm ${
        openNavigation ? 'bg-n-8' : 'bg-n-8/90 backdrop-blur-sm'
      }`}>
      <div className='flex items-center px-5 max-lg:py-4 lg:px-7.5 xl:px-10'>
        {isLandingPage ? (
          <a className='block w-[12rem] xl:mr-8' href='#hero'>
            <div className='flex space-x-3'>
              <img src={logoX} width={50} height={40} alt='StreamX' />
              <p className='py-5 text-gray-400'>StreamX</p>
            </div>
          </a>
        ) : (
          <Link className='block w-[12rem] xl:mr-8' to='/'>
            <div className='flex space-x-3'>
              <img src={logoX} width={50} height={40} alt='StreamX' />
              <p className='py-5 text-gray-400'>StreamX</p>
            </div>
          </Link>
        )}

        <nav
          className={`${
            openNavigation ? 'flex' : 'hidden'
          } fixed bottom-0 left-0 right-0 top-[5rem] bg-n-8 lg:static lg:mx-auto lg:flex lg:bg-transparent`}>
          <div className='relative z-2 m-auto flex flex-col items-center justify-center lg:flex-row'>
            {navigation.map((item) =>
              item.isLandingPageSection && isLandingPage ? (
                <a
                  key={item.id}
                  href={item.url}
                  onClick={handleClick}
                  className={`relative block font-code text-2xl uppercase text-n-1 transition-colors hover:text-color-1 ${
                    item.onlyMobile ? 'lg:hidden' : ''
                  } px-6 py-6 md:py-8 lg:-mr-0.25 lg:text-xs lg:font-semibold ${
                    item.url === location.hash
                      ? 'z-2 lg:text-n-1'
                      : 'lg:text-n-1/50'
                  } lg:leading-5 lg:hover:text-n-1 xl:px-12`}>
                  {item.title}
                </a>
              ) : (
                <Link
                  key={item.id}
                  to={item.isLandingPageSection ? '/' + item.url : item.url}
                  onClick={handleClick}
                  className={`relative block font-code text-2xl uppercase text-n-1 transition-colors hover:text-color-1 ${
                    item.onlyMobile ? 'lg:hidden' : ''
                  } px-6 py-6 md:py-8 lg:-mr-0.25 lg:text-xs lg:font-semibold ${
                    location.pathname === item.url
                      ? 'z-2 lg:text-n-1'
                      : 'lg:text-n-1/50'
                  } lg:leading-5 lg:hover:text-n-1 xl:px-12`}>
                  {item.title}
                </Link>
              )
            )}
          </div>

          <HamburgerMenu />
        </nav>

        {!isAuthenticated && (
          <>
            <div
              className='button mr-8 hidden text-n-1/50 transition-colors hover:cursor-pointer hover:text-n-1 lg:block'
              onClick={handleAuth0Login}>
              New account
            </div>
            <Button className='hidden lg:flex' onClick={handleAuth0Login}>
              Sign in
            </Button>
          </>
        )}

        {isAuthenticated && (
          <Link
            to='/storage'
            className='mr-8 hidden text-n-1/50 transition-colors hover:text-n-1 lg:block'>
            Dashboard
          </Link>
        )}

        <Button
          className='ml-auto lg:hidden'
          px='px-3'
          onClick={toggleNavigation}>
          <MenuSvg openNavigation={openNavigation} />
        </Button>
      </div>
    </div>
  )
}

export default Header
