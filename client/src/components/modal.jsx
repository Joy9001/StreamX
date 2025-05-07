function Modal({ currentEditor, onClose, onSave }) {
  const handleEditorData = async (editorData) => {
    try {
      onSave(editorData)
    } catch (error) {
      console.error('Error saving editor:', error)
    }
  }

  const handleFormSubmit = async (e) => {
    e.preventDefault()

    const editorData = {
      // name: e.target.name.value,
      name: document.querySelector('input[name="name"]').value,
      // email: e.target.email.value,
      email: document.querySelector('input[name="email"]').value,
      // phone: e.target.phone.value,
      phone: document.querySelector('input[name="phone"]').value,
      // location: e.target.location.value,
      location: document.querySelector('input[name="location"]').value,
      // software: e.target.software.value.split(', '),
      software: document
        .querySelector('input[name="software"]')
        .value.split(', '),
      // specializations: e.target.specializations.value.split(', '),
      specializations: document
        .querySelector('input[name="specializations"]')
        .value.split(', '),
    }

    await handleEditorData(editorData)
    onClose()
  }

  return (
    <dialog open className='modal'>
      <div className='modal-box'>
        <h3 className='text-lg font-bold'>
          {currentEditor ? 'Edit Editor' : 'Add New Editor'}
        </h3>

        <form>
          <div className='py-4'>
            <label className='mb-2 block'>Name</label>
            <input
              type='text'
              name='name'
              defaultValue={currentEditor?.name || ''}
              className='input input-bordered mb-4 w-full'
              required
            />

            <label className='mb-2 block'>Email</label>
            <input
              type='email'
              name='email'
              defaultValue={currentEditor?.email || ''}
              className='input input-bordered mb-4 w-full'
              readOnly={!!currentEditor} // Make email read-only if editing
              required
            />

            <label className='mb-2 block'>Phone</label>
            <input
              type='text'
              name='phone'
              defaultValue={currentEditor?.phone || ''}
              className='input input-bordered mb-4 w-full'
              required
            />

            <label className='mb-2 block'>Location</label>
            <input
              type='text'
              name='location'
              defaultValue={currentEditor?.location || ''}
              className='input input-bordered mb-4 w-full'
            />

            <label className='mb-2 block'>Software</label>
            <input
              type='text'
              name='software'
              defaultValue={
                currentEditor?.software ? currentEditor.software.join(', ') : ''
              }
              className='input input-bordered mb-4 w-full'
            />

            <label className='mb-2 block'>Specializations</label>
            <input
              type='text'
              name='specializations'
              defaultValue={
                currentEditor?.specializations
                  ? currentEditor.specializations.join(', ')
                  : ''
              }
              className='input input-bordered mb-4 w-full'
            />

            <div className='modal-action'>
              <button
                type='submit'
                className='btn btn-primary'
                onClick={handleFormSubmit}>
                {currentEditor ? 'Save Changes' : 'Add Editor'}
              </button>
            </div>
          </div>
        </form>
      </div>

      <form method='dialog' className='modal-backdrop'>
        <button className='btn' onClick={onClose}>
          Close
        </button>
      </form>
    </dialog>
  )
}

export default Modal
