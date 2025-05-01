import { companyLogos } from '../constants'

const CompanyLogos = ({ className }) => {
  return (
    <div className={className}>
      <h5 className='tagline mb-6 text-center text-n-1/50'>
        Helping people create beautiful content at
      </h5>
      <ul className='flex'>
        {companyLogos.map((logo, index) => (
          <li
            className='flex h-[8.5rem] flex-1 items-center justify-center'
            key={index}>
            <img src={logo} width={50} height={28} alt={logo} />
          </li>
        ))}
      </ul>
    </div>
  )
}

export default CompanyLogos
