import { useAuth0 } from '@auth0/auth0-react';
import { useState } from 'react';
import { useInView } from 'react-intersection-observer';

export default function Headline() {
  const { loginWithRedirect } = useAuth0();
  const [ref, inView] = useInView({ threshold: 0.2 });
  const [hasAnimated, setHasAnimated] = useState(false);

  // Trigger animation only once when the element is in view
  if (inView && !hasAnimated) {
    setHasAnimated(true);
  }

  return (
    <section
      id="home"
      style={{
        backgroundImage: 'url("https://source.unsplash.com/1600x900/?video,studio")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        padding: '8rem 2rem',
        color: 'white',
        textAlign: 'center',
      }}
    >
      <div
        ref={ref}
        style={{
          backgroundColor: 'rgba(79,70,229,0.15)',
          borderRadius: '1rem',
          padding: '3rem',
          display: 'inline-block',
          maxWidth: '80%',
          transform: hasAnimated ? 'translateY(0)' : 'translateY(50px)',
          opacity: hasAnimated ? 1 : 0,
          transition: 'transform 0.6s ease-out, opacity 0.6s ease-out',
        }}
      >
        {/* Headline Title */}
        <h1
          style={{
            color: 'black',
            fontSize: '4rem',
            fontWeight: 'bold',
            marginBottom: '1.5rem',
          }}
        >
          Welcome To StreamX
        </h1>

        {/* Subheading */}
        <p
          style={{
            color: 'black',
            fontSize: '1.5rem',
            marginBottom: '1.5rem',
            opacity: '0.85',
            lineHeight: '1.8',
          }}
        >
          Seamless experience for both video creators and editors for{' '}
          <strong>Edit. Store. Upload.</strong>
        </p>

        <p
          style={{
            color: 'black',
            fontSize: '1.5rem',
            marginBottom: '2.5rem',
            opacity: '0.85',
            lineHeight: '1.8',
          }}
        >
          Simplifying your video creation journey.
        </p>

        {/* Sign-In Button */}
        <a
          href="#"
          style={{
            display: 'inline-block',
            backgroundColor: '#4F46E5',
            color: 'white',
            padding: '1rem 2rem',
            borderRadius: '0.5rem',
            fontSize: '1.25rem',
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
                access_type: 'offline',
                connection_scope: 'https://www.googleapis.com/auth/youtube',
                prompt: 'consent',
                scope:
                  'read:users read:user_idp_tokens read:current_user read:current_user_metadata update:current_user_metadata openid profile email offline_access',
              },
            })
          }
        >
          Sign In
        </a>
      </div>
    </section>
  );
}
