import { setSelectedCategory } from '@/store/slices/ytFormSlice'
import PropTypes from 'prop-types'
import { useDispatch, useSelector } from 'react-redux'

const CategoryDropdown = () => {
  const selectedCategory = useSelector((state) => state.ytForm.selectedCategory)
  const dispatch = useDispatch()

  // Mapping of categories with their corresponding IDs
  const categories = {
    'Film & Animation': 1,
    'Autos & Vehicles': 2,
    Music: 10,
    'Pets & Animals': 15,
    Sports: 17,
    'Short Movies': 18,
    'Travel & Events': 19,
    Gaming: 20,
    Videoblogging: 21,
    'People & Blogs': 22,
    Comedy: 23,
    Entertainment: 24,
    'News & Politics': 25,
    'Howto & Style': 26,
    Education: 27,
    'Science & Technology': 28,
    Movies: 30,
    'Anime/Animation': 31,
    'Action/Adventure': 32,
    Classics: 33,
    Documentary: 35,
    Drama: 36,
    Family: 37,
    Foreign: 38,
    Horror: 39,
    'Sci-Fi/Fantasy': 40,
    Thriller: 41,
    Shorts: 42,
    Shows: 43,
    Trailers: 44,
  }

  // Handler to update selected category (ID)
  const handleCategoryChange = (e) => {
    dispatch(setSelectedCategory(categories[e.target.value]))
  }

  return (
    <div className='mt-6'>
      <label className='mb-1 block font-medium'>Select Category</label>
      <p className='mb-4 text-sm text-gray-600'>
        Add your video to a category so that viewers can find it more easily
      </p>
      <select
        className='w-full rounded-md border-2 border-solid border-black p-2'
        value={
          Object.keys(categories).find(
            (key) => categories[key] === selectedCategory
          ) || ''
        }
        onChange={handleCategoryChange}>
        <option value='' disabled>
          Choose a category
        </option>
        {Object.keys(categories).map((category) => (
          <option key={categories[category]} value={category}>
            {category}
          </option>
        ))}
      </select>
    </div>
  )
}

CategoryDropdown.propTypes = {
  selectedCategory: PropTypes.number, // The selected category ID
}

export default CategoryDropdown
