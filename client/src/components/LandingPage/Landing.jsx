import ButtonGradient from './assets/svg/ButtonGradient'
import Benefits from './components/Benefits'
import Collaboration from './components/Collaboration'
import Footer from './components/Footer'
import Header from './components/Header'
import Hero from './components/Hero'
import Pricing from './components/Pricing'
import Roadmap from './components/Roadmap'
// import Services from "./components/Services";

const Landing = () => {
  return (
    <>
      <div className='overflow-hidden pt-[4.75rem] lg:pt-[5.25rem]'>
        <Header />
        <Hero />
        <Benefits />
        <Collaboration />
        {/* <Services /> */}
        <Pricing />
        <Roadmap />
        <Footer />
      </div>

      <ButtonGradient />
    </>
  )
}

export default Landing
