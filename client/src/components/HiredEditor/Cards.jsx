import axios from 'axios'
import { useEffect, useState } from 'react'
import Card from './Card'

function Cards() {
  const [editorData, setEditorData] = useState([])
  const [plansData, setPlansData] = useState([])
  const [combinedData, setCombinedData] = useState([])
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    const fetchData = async () => {
      console.log('Fetching data...')
      try {
        const editorRes = await axios.get('http://localhost:3000/editor_gig')
        setEditorData(editorRes.data || [])
        console.log('Editor Response:', editorRes)

        const plansRes = await axios.get(
          'http://localhost:3000/editor_gig/plans'
        )
        setPlansData(plansRes.data || [])
        console.log('Plans Response:', plansRes)
      } catch (err) {
        console.error('Error fetching data:', err)
      }
    }

    fetchData()
  }, [])

  useEffect(() => {
    console.log('Editor Data Updated:', editorData)
    console.log(
      'Plans Data Updated:',
      plansData,
      editorData.length,
      plansData.length
    )
    if (editorData.length > 0 && plansData.length > 0) {
      const combined = editorData.map((editor) => {
        const plans = plansData.filter(
          (plan) =>
            plan.email.trim().toLowerCase() ===
            editor.email.trim().toLowerCase()
        )
        return { ...editor, plans }
      })

      console.log('Combined Data:', combined)
      setCombinedData(combined)
    }
  }, [editorData, plansData])

  // Filter combined data based on search term
  const filteredData = combinedData.filter((editor) =>
    editor.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div>
      {/* Search Input */}
      <div className='my-4 ml-14 flex'>
        <input
          type='text'
          placeholder='Search for any Skill, domain, or name...'
          className='input input-bordered w-1/2 rounded border-2 border-solid border-gray-300 p-2'
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Render Filtered Cards */}
      <div>
        {filteredData.map((editor) => (
          <Card key={editor._id} data={editor} />
        ))}
      </div>
    </div>
  )
}

export default Cards
