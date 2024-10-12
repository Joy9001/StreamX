import PropTypes from 'prop-types'
import YtUploadBtn from '../YtStatusBtnComponents/YtUploadBtn'

const UploadFooter = ({ onUpload }) => {
  return (
    <footer className='mt-4 flex items-center justify-between border-t border-neutral-600 pt-4'>
      <div onClick={onUpload}>
        <YtUploadBtn />
      </div>
    </footer>
  )
}

UploadFooter.propTypes = {
  onUpload: PropTypes.func.isRequired, // Function to call when upload button is clicked
}

export default UploadFooter
