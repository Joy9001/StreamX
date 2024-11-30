import Cards from './Cards.jsx'
import EditorNavbar from './EditorNavbar.jsx'
import Search from './Search.jsx'

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
