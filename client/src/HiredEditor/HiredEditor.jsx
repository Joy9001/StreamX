import Cards from '../components/Cards.jsx'
import EditorNavbar from '../components/EditorNavbar.jsx'
import Search from '../components/Search.jsx'

function HiredEditor() {
  return (
    <div className='min-h-screen bg-gray-100'>
      <EditorNavbar />
      <Search />
      <Cards />
    </div>
  )
}

export default HiredEditor