import { useContext, useEffect } from 'react'
import { ActiveTabContext } from '../../contexts/ActiveTabContext'
import AboutUs from '../../pages/Home/components/AboutUs'
import ClickToAction from '../../pages/Home/components/ClickToAction'
import OurPortofolio from '../../pages/Home/components/OurPortofolio'
import OurServices from '../../pages/Home/components/OurServices'
import Testimonial from '../../pages/Home/components/Testimonial'
import Headline from '../Home/components/Headline'

export default function Home() {
  const { setActiveTab } = useContext(ActiveTabContext)
  useEffect(() => {
    const position = {
      headline: document.getElementById('home').offsetTop - 150,
      about: document.getElementById('about').offsetTop - 150,
      services: document.getElementById('services').offsetTop - 150,
      projects: document.getElementById('projects').offsetTop - 150,
      testimonial: document.getElementById('testimonial').offsetTop - 150,
    }
    window.addEventListener('scroll', () => {
      if (window.scrollY > 0 && window.scrollY < position.about) {
        setActiveTab('home')
      } else if (
        window.scrollY > position.about &&
        window.scrollY < position.services
      ) {
        setActiveTab('about')
      } else if (
        window.scrollY > position.services &&
        window.scrollY < position.projects
      ) {
        setActiveTab('services')
      } else if (
        window.scrollY > position.projects &&
        window.scrollY < position.testimonial
      ) {
        setActiveTab('projects')
      } else if (window.scrollY > position.testimonial) {
        setActiveTab('testimonial')
      }
    })
  }, [])

  return (
    <>
      <main className='bg-white pt-16'>
        <Headline />
        <AboutUs />
        <OurServices />
        <OurPortofolio />
        <Testimonial />
        <ClickToAction />
      </main>
    </>
  )
}
