import { useEffect } from 'react'
import Card from './Card'
import searchIcon from '../../assets/search-svgrepo-com.svg'
import { useSelector, useDispatch } from 'react-redux'
import { useAuth0 } from '@auth0/auth0-react'
import {
  fetchEditors,
  fetchEditorPlans,
  fetchOwnerVideos,
  setSearchTerm,
  setPriceFilter,
  setLanguageFilter,
  setRatingFilter,
} from '../../store/slices/editorSlice'

function Cards() {
  const dispatch = useDispatch()
  const { getAccessTokenSilently } = useAuth0()

  // Get state from Redux store
  const userData = useSelector((state) => state.user.userData)
  const {
    combinedData,
    searchTerm,
    priceFilter,
    languageFilter,
    ratingFilter,
    loadingEditors,
    loadingPlans,
    error,
  } = useSelector((state) => state.editors)

  // Fetch access token and dispatch initial data loading
  useEffect(() => {
    async function initialize() {
      try {
        const token = await getAccessTokenSilently()

        // Fetch editors and plans in parallel
        dispatch(fetchEditors())
        dispatch(fetchEditorPlans())

        // Fetch videos if userData is available
        if (userData && userData.user_metadata && userData.user_metadata.role) {
          dispatch(
            fetchOwnerVideos({
              userId: userData._id,
              role: userData.user_metadata.role,
              token,
            })
          )
        }
      } catch (error) {
        console.error('Error initializing data:', error)
      }
    }

    initialize()
  }, [dispatch, getAccessTokenSilently, userData])

  // Filter combined data based on search term and filters
  const filteredData = combinedData.filter((editor) => {
    const matchesSearch = editor.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase())

    const matchesPrice =
      priceFilter === 'all' ||
      (() => {
        // Check if editor has plans
        if (
          !editor.plans ||
          !Array.isArray(editor.plans) ||
          editor.plans.length === 0
        ) {
          return false
        }

        // Get all valid prices from basic, standard, and premium plans
        const prices = editor.plans
          .flatMap((plan) => {
            const validPrices = []
            if (plan.basic && typeof plan.basic.price === 'number') {
              validPrices.push(plan.basic.price)
            }
            if (plan.standard && typeof plan.standard.price === 'number') {
              validPrices.push(plan.standard.price)
            }
            if (plan.premium && typeof plan.premium.price === 'number') {
              validPrices.push(plan.premium.price)
            }
            return validPrices
          })
          .filter((price) => !isNaN(price) && price > 0)

        // If no valid prices found, return false
        if (prices.length === 0) {
          return false
        }

        const minPrice = Math.min(...prices)

        switch (priceFilter) {
          case 'under100':
            return minPrice < 100
          case '100to150':
            return minPrice >= 100 && minPrice <= 500
          case 'over500':
            return minPrice >= 500
          default:
            return true
        }
      })()

    const matchesLanguage =
      languageFilter === 'all' ||
      (editor.languages &&
        Array.isArray(editor.languages) &&
        editor.languages.some(
          (lang) => lang && lang.toLowerCase() === languageFilter.toLowerCase()
        ))

    const matchesRating =
      ratingFilter === 'all' ||
      (() => {
        const rating = parseFloat(editor.rating) || 0
        switch (ratingFilter) {
          case '4.8plus':
            return rating >= 4.8
          case '3to4':
            return rating >= 3 && rating < 4
          case 'under3':
            return rating < 3
          default:
            return true
        }
      })()

    return matchesSearch && matchesPrice && matchesLanguage && matchesRating
  })

  // Show loading state
  if (loadingEditors || loadingPlans) {
    return (
      <div className='flex h-64 items-center justify-center'>
        <div className='h-16 w-16 animate-spin rounded-full border-b-4 border-t-4 border-blue-500'></div>
      </div>
    )
  }

  // Show error state
  if (error) {
    return (
      <div className='p-4 text-center text-red-500'>
        Error loading data: {error}
      </div>
    )
  }

  return (
    <div className='cards-container'>
      <div className='search-filters-container'>
        {/* Search Input and Filters */}
        <div className='my-4 ml-14 flex items-center gap-4'>
          <div className='relative w-1/2'>
            <input
              type='text'
              onChange={(e) => dispatch(setSearchTerm(e.target.value))}
              placeholder='Search for any Skill, domain, or name...'
              className='input input-bordered w-full rounded border-2 border-solid border-gray-300 p-2 pr-10'
              value={searchTerm}
            />
            <img
              src={searchIcon}
              alt='Search'
              className='absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 transform text-gray-400'
            />
          </div>

          {/* Filters */}
          <div className='relative'>
            <select
              value={priceFilter}
              onChange={(e) => dispatch(setPriceFilter(e.target.value))}
              className='input input-bordered cursor-pointer appearance-none rounded border-2 border-solid border-gray-300 bg-white p-2 pr-10 hover:border-gray-400 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary'>
              <option value='all'>All Prices</option>
              <option value='under100'>Under ₹100</option>
              <option value='100to150'>₹100 - ₹500</option>
              <option value='over500'>Over ₹500</option>
            </select>
            <svg
              className='pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-gray-500'
              fill='currentColor'
              viewBox='0 0 20 20'>
              <path
                fillRule='evenodd'
                d='M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z'
                clipRule='evenodd'
              />
            </svg>
          </div>

          <div className='relative'>
            <select
              value={languageFilter}
              onChange={(e) => dispatch(setLanguageFilter(e.target.value))}
              className='input input-bordered cursor-pointer appearance-none rounded border-2 border-solid border-gray-300 bg-white p-2 pr-10 hover:border-gray-400 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary'>
              <option value='all'>All Languages</option>
              <option value='english'>English</option>
              <option value='hindi'>Hindi</option>
              <option value='spanish'>Spanish</option>
            </select>
            <svg
              className='pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-gray-500'
              fill='currentColor'
              viewBox='0 0 20 20'>
              <path
                fillRule='evenodd'
                d='M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z'
                clipRule='evenodd'
              />
            </svg>
          </div>

          <div className='relative'>
            <select
              value={ratingFilter}
              onChange={(e) => dispatch(setRatingFilter(e.target.value))}
              className='input input-bordered cursor-pointer appearance-none rounded border-2 border-solid border-gray-300 bg-white p-2 pr-10 hover:border-gray-400 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary'>
              <option value='all'>All Ratings</option>
              <option value='4.8plus'>4.8★ & Above</option>
              <option value='3to4'>3★ to 4★</option>
              <option value='under3'>Under 3★</option>
            </select>
            <svg
              className='pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-gray-500'
              fill='currentColor'
              viewBox='0 0 20 20'>
              <path
                fillRule='evenodd'
                d='M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z'
                clipRule='evenodd'
              />
            </svg>
          </div>
        </div>
      </div>

      {/* Editor Cards */}
      <div className='cards-grid'>
        {filteredData.length > 0 ? (
          filteredData.map((editor) => (
            <Card key={editor._id} editor={editor} userData={userData} />
          ))
        ) : (
          <div className='col-span-full py-10 text-center text-gray-500'>
            No editors found matching your criteria.
          </div>
        )}
      </div>
    </div>
  )
}

export default Cards
