import { useAuth0 } from '@auth0/auth0-react'

function Login() {
  const { loginWithRedirect } = useAuth0()

  return (
    <div>
      <button
        onClick={() =>
          loginWithRedirect({
            access_type: 'offline',
            connection_scope: 'https://www.googleapis.com/auth/youtube',
            authorizationParams: {
              connection: 'google-oauth2',
              access_type: 'offline',
              connection_scope: 'https://www.googleapis.com/auth/youtube',
              prompt: 'consent',
              scope:
                'read:users read:user_idp_tokens read:current_user read:current_user_metadata update:current_user_metadata openid profile email offline_access',
            },
          })
        }>
        Log in
      </button>
    </div>
  )
}

export default Login
