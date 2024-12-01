import { Auth0Provider } from '@auth0/auth0-react'
import PropTypes from 'prop-types'
import AuthenticationWrapper from './AuthenticationWrapper'

const Auth0ProviderWrapper = ({ children }) => {
  const domain = import.meta.env.VITE_AUTH0_DOMAIN
  const clientId = import.meta.env.VITE_AUTH0_CLIENT_ID
  return (
    <Auth0Provider
      domain={domain}
      clientId={clientId}
      authorizationParams={{
        redirect_uri: window.location.origin,
        audience: `https://${import.meta.env.VITE_AUTH0_DOMAIN}/api/v2/`,
        scope:
          'read:users read:user_idp_tokens read:current_user read:current_user_metadata update:current_user_metadata profile email ',
      }}>
      <AuthenticationWrapper>{children}</AuthenticationWrapper>
    </Auth0Provider>
  )
}

Auth0ProviderWrapper.propTypes = {
  children: PropTypes.node.isRequired,
}

export default Auth0ProviderWrapper
