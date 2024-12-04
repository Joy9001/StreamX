function HiredEditors() {
  const [editors, setEditors] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const userData = useSelector((state) => state.user.userData)

  useEffect(() => {
    const fetchHiredEditors = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/hired-editors/${userData._id}`
        )
        setEditors(response.data)
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch editors')
      } finally {
        setLoading(false)
      }
    }

    if (userData?._id) {
      fetchHiredEditors()
    }
  }, [userData])

  if (loading) {
    return (
      <div className='w-[300px] rounded-lg bg-white p-6 shadow-lg'>
        <div className='flex items-center justify-center'>
          <div className='h-8 w-8 animate-spin rounded-full border-4 border-pink-300 border-t-transparent'></div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className='w-[300px] rounded-lg bg-white p-6 shadow-lg'>
        <p className='text-center text-red-500'>Error: {error}</p>
      </div>
    )
  }

  return (
    <div className='w-[300px] rounded-lg bg-white p-6 shadow-lg transition-all duration-300 ease-in-out hover:-translate-y-1 hover:shadow-xl'>
      <div className='mb-6 flex items-center justify-between'>
        <h3 className='bg-gradient-to-r from-pink-300 to-pink-500 bg-clip-text text-2xl font-bold text-transparent'>
          Hired Editors
        </h3>
        <span className='rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800'>
          {editors.length} Editors
        </span>
      </div>
      {editors.length === 0 ? (
        <div className='flex flex-col items-center justify-center space-y-2 py-8 text-gray-500'>
          <Users className='h-12 w-12' />
          <p>No editors hired yet</p>
        </div>
      ) : (
        <ul className='space-y-4'>
          {editors.map((editor, index) => (
            <li
              key={editor._id}
              className='flex items-center justify-between border-b pb-4'>
              <div className='flex items-center gap-4'>
                <div className='h-10 w-10 overflow-hidden rounded-full'>
                  <img
                    src={editor.profilephoto || "https://imgix.ranker.com/list_img_v2/1360/2681360/original/the-best-ichigo-quotes?auto=format&q=50&fit=crop&fm=pjpg&dpr=2&crop=faces&h=185.86387434554973&w=355"}
                    alt={editor.username}
                    className='h-full w-full object-cover'
                  />
                </div>
                <div className='flex flex-col'>
                  <span className='font-medium text-gray-800'>
                    {editor.username}
                  </span>
                  <span className='text-sm text-gray-500'>{editor.email}</span>
                </div>
              </div>
              {editor.YTchannelname && (
                <a
                  href={editor.ytChannelLink}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='rounded-full bg-red-100 px-3 py-1 text-sm font-medium text-red-600 hover:bg-red-200'>
                  YouTube
                </a>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default HiredEditors
