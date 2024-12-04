import profileImgOne from '../../../assets/images/pict-profile-1.jpeg'
import profileImgTwo from '../../../assets/images/pict-profile-2.jpg'
import TestimonialItem from '../../Home/components/TestimonialItem'

export default function Testimonial() {
  return (
    <section id='testimonial'>
      <div className='pt-16'></div>
      <div className=''>
        <h2 className='font-quicksand text-sky-600 mt-24 text-center text-[1.8rem] font-semibold pb-5'>
          Testimonial
        </h2>
        <h3 className='font-nunito text-center text-[2rem] font-bold text-black pb-5'>
          People Talk About Us
        </h3>
      </div>

      <div className='lg:flex lg:flex-row lg:flex-wrap lg:justify-between lg:gap-4 '>
        <TestimonialItem
          img={profileImgOne}
          name='Munawar'
          position='Web Developer'>
          "As a small business, we needed a quick and effective way to get our
          marketing videos edited and uploaded. This platform delivered
          everything we needed—fast, reliable, and high-quality results every
          time. Their customer support is top-notch, too."
        </TestimonialItem>

        <TestimonialItem
          img={profileImgTwo}
          name='Garry'
          position='Creative Manager'>
          "From uploading my raw footage to getting it edited and uploaded
          directly to YouTube, this service has saved me so much time. The
          team’s attention to detail and commitment to quality makes them my
          go-to choice for video editing!"
        </TestimonialItem>

        <TestimonialItem
          img={profileImgOne}
          name='Priyanshu'
          position='Web Developer'>
          "I’ve been using this service for months, and it’s transformed my
          video production process. The editing team is professional, and the
          cloud storage makes it so easy to manage all my content. The direct
          YouTube upload feature is a game changer! Highly recommend!"
        </TestimonialItem>
      </div>
    </section>
  )
}
