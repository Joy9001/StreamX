import { useAuth0 } from '@auth0/auth0-react'

export default function Headline() {
  const { loginWithRedirect } = useAuth0()
  return (
    <section
      id='home'
      style={{
        backgroundImage:
          'url("https://source.unsplash.com/1600x900/?video,studio")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        padding: '8rem 2rem', // Increased padding for larger height
        color: 'white',
        textAlign: 'center',
      }}>
      <div
        style={{
          backgroundColor: 'rgba(79,70,229,0.15)',
          borderRadius: '1rem',
          padding: '3rem', // Increased padding inside the content box
          display: 'inline-block',
          maxWidth: '80%', // Wider content area
        }}>
        <h1
          style={{
            color: 'black',
            fontSize: '4rem', // Increased font size
            fontWeight: 'bold',
            marginBottom: '1.5rem',
          }}>
          Welcome To StreamX
        </h1>
        <p
          style={{
            color: 'black',
            fontSize: '1.5rem', // Slightly larger text
            marginBottom: '1.5rem',
            opacity: '0.85',
            lineHeight: '1.8', // Increased line spacing for readability
          }}>
          Seamless experience for both video creators and editors for **Edit.
          Store. Upload.**
        </p>
        <p
          style={{
            color: 'black',
            fontSize: '1.5rem', // Consistent with the first paragraph
            marginBottom: '2.5rem',
            opacity: '0.85',
            lineHeight: '1.8',
          }}>
          Simplifying your video creation journey.
        </p>
        <a
          href='#'
          style={{
            display: 'inline-block',
            backgroundColor: '#4F46E5',
            color: 'white',
            padding: '1rem 2rem', // Larger button
            borderRadius: '0.5rem',
            fontSize: '1.25rem', // Larger font size for CTA
            fontWeight: '600',
            textDecoration: 'none',
            transition: 'background-color 0.3s',
          }}
          onMouseOver={(e) => (e.target.style.backgroundColor = '#4338CA')}
          onMouseOut={(e) => (e.target.style.backgroundColor = '#4F46E5')}
          onClick={() =>
            loginWithRedirect({
              access_type: 'offline',
              connection_scope: 'https://www.googleapis.com/auth/youtube',
              authorizationParams: {
                // connection: 'google-oauth2',
                access_type: 'offline',
                connection_scope: 'https://www.googleapis.com/auth/youtube',
                prompt: 'consent',
                scope:
                  'read:users read:user_idp_tokens read:current_user read:current_user_metadata update:current_user_metadata openid profile email offline_access',
              },
            })
          }>
          Sign In
        </a>
      </div>
    </section>
  )
}
