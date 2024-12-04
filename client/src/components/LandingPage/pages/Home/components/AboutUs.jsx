import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useEffect } from 'react';
import ImgDecoration from '../../../assets/images/img-decoration-purple.svg';
import image from '../../../assets/images/our-team.png';

export default function AboutUs() {
  const { ref: textRef, inView: textInView } = useInView({
    threshold: 0.2,
    triggerOnce: false, // Trigger animations both on enter and exit
  });
  const { ref: imgRef, inView: imgInView } = useInView({
    threshold: 0.2,
    triggerOnce: false,
  });

  const textControls = useAnimation();
  const imgControls = useAnimation();

  useEffect(() => {
    // Animate text section
    if (textInView) {
      textControls.start('visible');
    } else {
      textControls.start('hidden');
    }

    // Animate image section
    if (imgInView) {
      imgControls.start('visible');
    } else {
      imgControls.start('hidden');
    }
  }, [textInView, imgInView, textControls, imgControls]);

  return (
    <section id="about" className="mt-24 flex flex-col lg:flex-row-reverse lg:flex-wrap lg:justify-between">
      {/* Header Section */}
      <motion.div
        ref={textRef}
        initial="hidden"
        animate={textControls}
        variants={{
          hidden: { opacity: 0, x: -100 },
          visible: { opacity: 1, x: 0 },
        }}
        transition={{ duration: 1.5, ease: 'easeInOut' }}
        className="w-full text-center"
      >
        <h2 className="font-quicksand text-[24px] font-semibold text-sky-600">
          About Us
        </h2>
        <h3 className="font-nunito text-[36px] font-bold text-black">
          Meet Our Team
        </h3>
      </motion.div>

      {/* Content Section */}
      <motion.div
        ref={textRef}
        initial="hidden"
        animate={textControls}
        variants={{
          hidden: { opacity: 0, x: -100 },
          visible: { opacity: 1, x: 0 },
        }}
        transition={{ duration: 1.5, ease: 'easeInOut' }}
        className="lg:mt-10 lg:w-[50%]"
      >
        <ul className="list-inside space-y-2 font-medium text-gray-700">
          <li className="text-[24px] font-bold text-gray-900">Our Team Members</li>
          <li className="hover:text-blue-500 transition-colors duration-200">Joy Mridha</li>
          <li className="hover:text-blue-500 transition-colors duration-200">Rishabh Raj</li>
          <li className="hover:text-blue-500 transition-colors duration-200">Devansh Vashist</li>
          <li className="hover:text-blue-500 transition-colors duration-200">Priyanshu Kushwah</li>
          <li className="hover:text-blue-500 transition-colors duration-200">Nithin Sai Kelavathu</li>
        </ul>

        <p className="pt-5 mt-3 text-[1.3rem] font-normal leading-8 text-gray-800 font-sans">
          Our team is a vibrant mix of innovators, creators, and problem-solvers,
          all working together to redefine the video editing experience. With
          expertise ranging from video editing to cloud technology, our mission is
          to provide users with a seamless journey from creation to sharing. We
          value collaboration, technical excellence, and a shared passion for
          delivering high-quality solutions that empower video creators around the
          globe.
        </p>
      </motion.div>

      {/* Image Section */}
      <motion.div
        ref={imgRef}
        initial="hidden"
        animate={imgControls}
        variants={{
          hidden: { opacity: 0, y: 100 },
          visible: { opacity: 1, y: 0 },
        }}
        transition={{ duration: 1.5, ease: 'easeInOut' }}
        className="relative mt-16 aspect-[1.47/1] w-full lg:mt-10 lg:w-[45%]"
      >
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
      </motion.div>
    </section>
  );
}
