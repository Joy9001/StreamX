import PropTypes from 'prop-types'

function NavLogin({ loginWithRedirect }) {
  return (
    <div className='flex items-center gap-4'>
      <button className='btn' onClick={() => loginWithRedirect()}>
        Login
      </button>
      <button className='btn btn-primary'>Sign Up</button>
    </div>
  )
}

NavLogin.propTypes = {
  loginWithRedirect: PropTypes.func.isRequired,
}

export default NavLogin
