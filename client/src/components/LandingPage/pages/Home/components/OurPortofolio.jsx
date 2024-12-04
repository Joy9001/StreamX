export default function OurPortofolio() {
  return (
    <section id='projects'>
      <h2 className='font-quicksand pt-16 text-center text-[36px] font-semibold text-sky-600'>
        Our Pricing
      </h2>
      <div
  style={{
    display: 'flex',
    justifyContent: 'center',
    gap: '2rem',
    flexWrap: 'wrap',
    marginTop: '2rem',
  }}
>
  {/* Basic Plan */}
  <div
    style={{
      background: 'linear-gradient(135deg, #f9fafb, #ffffff)',
      borderRadius: '1.5rem',
      padding: '2rem',
      boxShadow: '0 8px 12px rgba(0, 0, 0, 0.1)',
      width: '320px',
      textAlign: 'center',
      transition: 'transform 0.3s, box-shadow 0.3s',
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.transform = 'scale(1.05)';
      e.currentTarget.style.boxShadow = '0 12px 20px rgba(0, 0, 0, 0.2)';
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.transform = 'scale(1)';
      e.currentTarget.style.boxShadow = '0 8px 12px rgba(0, 0, 0, 0.1)';
    }}
  >
    <h3 style={{ fontSize: '1.75rem', fontWeight: '700', marginBottom: '1rem' }}>Basic Plan</h3>
    <p style={{ fontSize: '1.125rem', color: '#4B5563', marginBottom: '1.5rem' }}>$9.99/month</p>
    <ul style={{ listStyleType: 'none', padding: '0', marginBottom: '2rem' }}>
      <li style={{ marginBottom: '0.5rem', fontSize: '1rem' }}>5 Video Uploads</li>
      <li style={{ marginBottom: '0.5rem', fontSize: '1rem' }}>Basic Video Editing</li>
      <li style={{ marginBottom: '0.5rem', fontSize: '1rem' }}>1 GB Cloud Storage</li>
    </ul>
  </div>

  {/* Repeat for Standard Plan */}
  <div
    style={{
      background: 'linear-gradient(135deg, #edf2f7, #ffffff)',
      borderRadius: '1.5rem',
      padding: '2rem',
      boxShadow: '0 8px 12px rgba(0, 0, 0, 0.1)',
      width: '320px',
      textAlign: 'center',
      transition: 'transform 0.3s, box-shadow 0.3s',
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.transform = 'scale(1.05)';
      e.currentTarget.style.boxShadow = '0 12px 20px rgba(0, 0, 0, 0.2)';
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.transform = 'scale(1)';
      e.currentTarget.style.boxShadow = '0 8px 12px rgba(0, 0, 0, 0.1)';
    }}
  >
    <h3 style={{ fontSize: '1.75rem', fontWeight: '700', marginBottom: '1rem' }}>Standard Plan</h3>
    <p style={{ fontSize: '1.125rem', color: '#4B5563', marginBottom: '1.5rem' }}>$19.99/month</p>
    <ul style={{ listStyleType: 'none', padding: '0', marginBottom: '2rem' }}>
      <li style={{ marginBottom: '0.5rem', fontSize: '1rem' }}>20 Video Uploads</li>
      <li style={{ marginBottom: '0.5rem', fontSize: '1rem' }}>Advanced Video Editing</li>
      <li style={{ marginBottom: '0.5rem', fontSize: '1rem' }}>10 GB Cloud Storage</li>
    </ul>
  </div>

  {/* Premium Plan */}
  <div
    style={{
      background: 'linear-gradient(135deg, #f7fafc, #ffffff)',
      borderRadius: '1.5rem',
      padding: '2rem',
      boxShadow: '0 8px 12px rgba(0, 0, 0, 0.1)',
      width: '320px',
      textAlign: 'center',
      transition: 'transform 0.3s, box-shadow 0.3s',
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.transform = 'scale(1.05)';
      e.currentTarget.style.boxShadow = '0 12px 20px rgba(0, 0, 0, 0.2)';
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.transform = 'scale(1)';
      e.currentTarget.style.boxShadow = '0 8px 12px rgba(0, 0, 0, 0.1)';
    }}
  >
    <h3 style={{ fontSize: '1.75rem', fontWeight: '700', marginBottom: '1rem' }}>Premium Plan</h3>
    <p style={{ fontSize: '1.125rem', color: '#4B5563', marginBottom: '1.5rem' }}>$49.99/month</p>
    <ul style={{ listStyleType: 'none', padding: '0', marginBottom: '2rem' }}>
      <li style={{ marginBottom: '0.5rem', fontSize: '1rem' }}>Unlimited Video Uploads</li>
      <li style={{ marginBottom: '0.5rem', fontSize: '1rem' }}>Professional Video Editing</li>
      <li style={{ marginBottom: '0.5rem', fontSize: '1rem' }}>100 GB Cloud Storage</li>
    </ul>
  </div>
</div>

    </section>
  )
}
