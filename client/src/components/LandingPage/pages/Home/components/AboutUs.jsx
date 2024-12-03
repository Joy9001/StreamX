import ImgDecoration from '../../../assets/images/img-decoration-purple.svg'
import image from '../../../assets/images/our-team.png'

export default function AboutUs() {
  return (
    <section
  id="about"
  className="mt-24 flex flex-col lg:flex-row-reverse lg:flex-wrap lg:justify-between"
>
  {/* Header Section */}
  <div className="w-full text-center">
    <h2 className="font-quicksand text-[24px] font-semibold text-sky-600">
      About Us
    </h2>
    <h3 className="font-nunito text-[36px] font-bold text-black">
      Meet Our Team
    </h3>
  </div>

  {/* Content Section */}
  <div className="lg:mt-10 lg:w-[50%]">
    {/* Teammates List */}
    <ul className="list-inside space-y-2 font-medium text-gray-700">
      <li className="text-[24px] font-bold text-gray-900">Our Team Members</li>
      <li className="hover:text-blue-500 transition-colors duration-200">
        Joy Mridha
      </li>
      <li className="hover:text-blue-500 transition-colors duration-200">
        Rishabh Raj
      </li>
      <li className="hover:text-blue-500 transition-colors duration-200">
        Devansh Vashist
      </li>
      <li className="hover:text-blue-500 transition-colors duration-200">
        Priyanshu Kushwah
      </li>
      <li className="hover:text-blue-500 transition-colors duration-200">
        Nithin Sai Kelavathu
      </li>
    </ul>

    {/* About the Team */}
    <p className="pt-5 mt-3 text-[1.3rem] font-normal leading-8 text-gray-800 font-sans">
      Our team is a vibrant mix of innovators, creators, and problem-solvers,
      all working together to redefine the video editing experience. With
      expertise ranging from video editing to cloud technology, our mission is
      to provide users with a seamless journey from creation to sharing. We
      value collaboration, technical excellence, and a shared passion for
      delivering high-quality solutions that empower video creators around the
      globe.
    </p>
  </div>

  {/* Image Section */}
  <div className="relative mt-16 aspect-[1.47/1] w-full lg:mt-10 lg:w-[45%]">
    <img
      src={image}
      alt="Our Team"
      className="absolute inset-0 z-10 mx-auto aspect-[1.47/1] w-full rounded-xl shadow-lg"
    />
    <img
      src={ImgDecoration}
      alt="Decorative Element"
      className="absolute -top-4 left-0 z-0 lg:-left-5 opacity-60"
    />
  </div>
</section>

  )
}
