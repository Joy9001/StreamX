import PropTypes from 'prop-types'
import YtUploadBtn from '../YtStatusBtnComponents/YtUploadBtn'

const UploadFooter = ({ onUpload, onRequest }) => {
  return (
    <footer className='mt-4 flex items-center justify-between border-t border-neutral-600 pt-4'>
      <div className='flex gap-4'>
        <div onClick={onUpload}>
          <YtUploadBtn />
        </div>
        <button
          onClick={onRequest}
          className='btn btn-outline btn-neutral'
          type='button'>
          <span>Request Upload</span>
        </button>
      </div>
    </footer>
  )
}

UploadFooter.propTypes = {
  onUpload: PropTypes.func.isRequired,
  onRequest: PropTypes.func.isRequired,
}

export default UploadFooter
