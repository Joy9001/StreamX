import { useContext, useEffect, useState } from 'react'
import { ActiveTabContext } from '../../contexts/ActiveTabContext'
import AboutUs from '../../pages/Home/components/AboutUs'
import OurPortofolio from '../../pages/Home/components/OurPortofolio'
import OurServices from '../../pages/Home/components/OurServices'
import Testimonial from '../../pages/Home/components/Testimonial'
import Headline from '../Home/components/Headline'

export default function Home() {
  const { setActiveTab } = useContext(ActiveTabContext)
  const [scrollPosition, setScrollPosition] = useState(0)
  const [backgroundStyle, setBackgroundStyle] = useState({
    backgroundImage: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
  })

  useEffect(() => {
    const position = {
      headline: document.getElementById('home').offsetTop,
      about: document.getElementById('about').offsetTop,
      services: document.getElementById('services').offsetTop,
      projects: document.getElementById('projects').offsetTop,
      testimonial: document.getElementById('testimonial').offsetTop,
    }

    const handleScroll = () => {
      const scrollY = window.scrollY
      setScrollPosition(scrollY)

      let newBackgroundStyle

      // Dynamic gradient based on scroll position
      if (scrollY < position.about) {
        newBackgroundStyle = {
          backgroundImage: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
          transition: 'background-image 0.5s ease',
        }
        setActiveTab('home')
      } else if (scrollY < position.services) {
        newBackgroundStyle = {
          backgroundImage: 'linear-gradient(135deg, #e6f3e6 0%, #b0d0b0 100%)',
          transition: 'background-image 0.5s ease',
        }
        setActiveTab('about')
      } else if (scrollY < position.projects) {
        newBackgroundStyle = {
          backgroundImage: 'linear-gradient(135deg, #fff5e6 0%, #ffd699 100%)',
          transition: 'background-image 0.5s ease',
        }
        setActiveTab('services')
      } else if (scrollY < position.testimonial) {
        newBackgroundStyle = {
          backgroundImage: 'linear-gradient(135deg, #f0e6ff 0%, #d1b3ff 100%)',
          transition: 'background-image 0.5s ease',
        }
        setActiveTab('projects')
      } else {
        newBackgroundStyle = {
          backgroundImage: 'linear-gradient(135deg, #e6e0ff 0%, #a188ff 100%)',
          transition: 'background-image 0.5s ease',
        }
        setActiveTab('testimonial')
      }

      setBackgroundStyle(newBackgroundStyle)
    }

    window.addEventListener('scroll', handleScroll)
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [setActiveTab])

  // Background object generator
  const renderBackgroundObjects = () => {
    const objects = [
      { type: 'circle', color: 'bg-blue-200', size: 150, delay: 0.1 },
      { type: 'triangle', color: 'bg-green-200', size: 100, delay: 0.2 },
      { type: 'square', color: 'bg-purple-200', size: 120, delay: 0.3 },
      { type: 'diamond', color: 'bg-grey-200', size: 80, delay: 0.4 },
      { type: 'hexagon', color: 'bg-yellow-200', size: 90, delay: 0.5 },
    ]

    return objects.map((obj, index) => {
      // Different scroll speeds for parallax effect
      const scrollMultiplier = (index + 1) * 0.2
      const rotateMultiplier = (index + 1) * 0.1

      // Dynamic shape rendering
      const renderShape = () => {
        switch (obj.type) {
          case 'triangle':
            return (
              <div
                className={`absolute ${obj.color} rotate-45 transform`}
                style={{
                  width: `${obj.size}px`,
                  height: `${obj.size}px`,
                  clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)',
                }}
              />
            )
          case 'square':
            return (
              <div
                className={`absolute ${obj.color}`}
                style={{
                  width: `${obj.size}px`,
                  height: `${obj.size}px`,
                }}
              />
            )
          case 'diamond':
            return (
              <div
                className={`absolute ${obj.color} rotate-45 transform`}
                style={{
                  width: `${obj.size}px`,
                  height: `${obj.size}px`,
                }}
              />
            )
          case 'hexagon':
            return (
              <div
                className={`absolute ${obj.color}`}
                style={{
                  width: `${obj.size}px`,
                  height: `${obj.size}px`,
                  clipPath:
                    'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)',
                }}
              />
            )
          default:
            return (
              <div
                className={`absolute rounded-full ${obj.color}`}
                style={{
                  width: `${obj.size}px`,
                  height: `${obj.size}px`,
                }}
              />
            )
        }
      }

      return (
        <div
          key={index}
          className='absolute opacity-30 mix-blend-multiply transition-transform duration-500 ease-out'
          style={{
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            transform: `
              translateY(${scrollPosition * scrollMultiplier}px) 
              rotate(${scrollPosition * rotateMultiplier}deg)
            `,
            animationDelay: `${obj.delay}s`,
          }}>
          {renderShape()}
        </div>
      )
    })
  }

  return (
    <div
      className='relative min-h-screen overflow-hidden bg-cover bg-fixed bg-center'
      style={{
        ...backgroundStyle,
        perspective: '1000px',
      }}>
      {/* Animated Background Objects */}
      <div className='absolute inset-0 overflow-hidden opacity-20'>
        {renderBackgroundObjects()}
      </div>

      <main className='relative z-10 bg-white bg-opacity-90'>
        <Headline />
        <AboutUs />
        <OurServices />
        <OurPortofolio />
        <Testimonial />
      </main>
    </div>
  )
}
