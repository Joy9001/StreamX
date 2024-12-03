export default function Footer() {
  return (
    <footer
      style={{
        backgroundColor: '#1F2937',
        padding: '2rem 1rem',
        color: 'white',
      }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          alignItems: 'center',
        }}>
        {/* Logo Section */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
          }}>
          <div
            style={{
              backgroundColor: 'white',
              borderRadius: '1rem',
              padding: '1rem',
              width: '120px',
              height: '120px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <img
              src='http://localhost:5173/src/assets/logoX.png'
              alt='Logo'
              style={{ width: '80%', height: 'auto' }}
            />
          </div>
          <div style={{
              
              fontSize: '48px',
              marginLeft: '16px',
              padding: '1rem',
              width: '120px',
              height: '120px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}>  StreamX</div>
        </div>

        {/* Footer Links */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            width: '100%',
            marginTop: '2rem',
          }}>
          {/* Terms & Policies */}
          <div style={{ flex: '1', padding: '1rem' }}>
            <h4
              style={{
                fontSize: '1.25rem',
                fontWeight: '600',
                marginBottom: '0.5rem',
              }}>
              Terms & Policies
            </h4>
            <p style={{ fontSize: '1rem', marginBottom: '0.5rem' }}>
              Terms and Services
            </p>
            <p style={{ fontSize: '1rem', marginBottom: '0.5rem' }}>
              Privacy Policy
            </p>
          </div>

          {/* Contact */}
          <div style={{ flex: '1', padding: '1rem' }}>
            <h4
              style={{
                fontSize: '1.25rem',
                fontWeight: '600',
                marginBottom: '0.5rem',
              }}>
              Contact
            </h4>
            <p style={{ fontSize: '1rem', marginBottom: '0.5rem' }}>
              (+62) 893912392190
            </p>
            <p style={{ fontSize: '1rem', marginBottom: '0.5rem' }}>
              StreamX@gmail.com
            </p>
          </div>

          {/* Location */}
          <div style={{ flex: '1', padding: '1rem' }}>
            <h4
              style={{
                fontSize: '1.25rem',
                fontWeight: '600',
                marginBottom: '0.5rem',
              }}>
              Location
            </h4>
            <p style={{ fontSize: '1rem', marginBottom: '0.5rem' }}>
              IIIT Sri City
            </p>
            <p style={{ fontSize: '1rem', marginBottom: '0.5rem' }}>
              team@StreamX.com
            </p>
          </div>
        </div>
      </div>

      {/* Footer Bottom Section */}
      <div
        style={{
          marginTop: '2rem',
          textAlign: 'center',
          borderTop: '1px solid #374151',
          paddingTop: '1rem',
        }}>
        <p style={{ fontSize: '0.875rem' }}>
          © 2024 StreamX. All Rights Reserved.
        </p>
      </div>
    </footer>
  )
}
