import Cards from './Cards.jsx'
import EditorNavbar from './EditorNavbar.jsx'
import { useDispatch } from 'react-redux'
import { useEffect } from 'react'

function HiredEditor() {
  const dispatch = useDispatch()

  // Reset any editor-related state when component unmounts
  useEffect(() => {
    return () => {
      // Could dispatch a cleanup action here if needed
      // dispatch(resetEditorState())
    }
  }, [dispatch])

  return (
    <div className='min-h-screen bg-gray-100'>
      <EditorNavbar />
      <Cards />
    </div>
  )
}

export default HiredEditor
