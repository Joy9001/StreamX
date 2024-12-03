import './assets/styles/tailwind.css'
import Container from './components/MainContainer'
import Navbar from './components/Navbar'
import ActiveTabContextProvider from './contexts/ActiveTabContext'
import Home from './pages/Home'
import Footer from './pages/Home/components/Footer'

const Landing = () => {
  return (
    <ActiveTabContextProvider>
      <Navbar />
      <Container>
        <Home />
      </Container>
      <Footer />
    </ActiveTabContextProvider>
  )
}

export default Landing
