import arrow from '../../../assets/icons/arrow-right.svg'
import ItemOne from '../../../assets/icons/monitor.svg'
import ItemThree from '../../../assets/icons/pen-tool.svg'
import ItemTwo from '../../../assets/icons/settings.svg'
import ItemFour from '../../../assets/icons/tv.svg'
import ServiceItem from '../components/ServiceItem'

export default function OurServices() {
  return (
    <section id='services' className='mt-32 flex flex-col py-16 lg:flex-row'>
      {/* Text Section */}
      <div className='lg:w-[45%] lg:flex-none'>
        <h2 className='font-quicksand text-center text-[1.5rem] font-semibold text-sky-600'>
          Our Services
        </h2>
        <h3 className='font-nunito text-center text-[2rem] font-bold text-black'>
          Perfect and Fast Solutions
        </h3>
        <p className='text-grey mt-5 font-sans text-[1.3rem] font-normal leading-7'>
          <b>Professional Video Editors</b>
          <br />
          Our skilled team of video editors specializes in creating high-quality
          and visually appealing videos tailored to your requirements. From
          color correction to audio enhancements, we ensure your content stands
          out.
          <br />
          <hr className='my-4' />
          <b>Direct Upload to YouTube</b>
          <br />
          Say goodbye to manual uploads! Once editing is complete, we simplify
          the sharing process with seamless direct uploads to your YouTube
          channel.
          <hr className='my-4' />
          <b>Cloud Storage for Videos</b>
          <br />
          With our secure cloud storage service, you can easily store and manage
          your videos without worrying about space or security. Our platform
          ensures that your content is stored safely and is accessible anytime,
          anywhere, making it easy to keep your files organized.
        </p>
        <a
          href='#'
          className='mt-4 flex flex-row items-center gap-2 duration-300 hover:gap-3'>
          <span className='font-quicksand text-blue hover:text-dark-blue text-[0.85rem] font-bold duration-300'>
            Read More
          </span>
          <img src={arrow} alt='arrow icon' className='aspect-square w-6' />
        </a>
      </div>

      {/* Service Items Section */}
      <div className='mt-6 flex flex-row flex-wrap justify-end gap-6 lg:-mt-6 lg:w-[55%] lg:flex-none'>
        <ServiceItem
          icon={ItemOne}
          text='YouTube Channel Management'
          bgColor='#377DFF'
        />
        <ServiceItem icon={ItemTwo} text='Manage Videos' bgColor='#FF2D2D' />
        <ServiceItem icon={ItemThree} text='Edit Videos' bgColor='#7CE761' />
        <ServiceItem icon={ItemFour} text='Upload Videos' bgColor='#FFA800' />
      </div>
    </section>
  )
}
