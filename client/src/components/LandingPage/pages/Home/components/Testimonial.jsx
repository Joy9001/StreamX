import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useEffect } from 'react';
import profileImgOne from '../../../assets/images/pict-profile-1.jpeg';
import profileImgTwo from '../../../assets/images/pict-profile-2.jpg';
import TestimonialItem from '../../Home/components/TestimonialItem';

export default function Testimonial() {
  const { ref: sectionRef, inView: sectionInView } = useInView({
    threshold: 0.2,
    triggerOnce: false, // Trigger on both scroll directions
  });

  const sectionControls = useAnimation();

  useEffect(() => {
    if (sectionInView) {
      sectionControls.start('visible');
    } else {
      sectionControls.start('hidden');
    }
  }, [sectionInView, sectionControls]);

  const cardVariants = {
    hidden: { opacity: 0, y: 50 }, // Fade out and slide down
    visible: { opacity: 1, y: 0 }, // Fade in and slide up
  };

  return (
    <section id="testimonial" ref={sectionRef} className="pt-16">
      {/* Header */}
      <motion.div
        initial="hidden"
        animate={sectionControls}
        variants={cardVariants}
        transition={{ duration: 1.2, ease: 'easeInOut' }}
        className="text-center"
      >
        <h2 className="font-quicksand text-sky-600 mt-24 text-[1.8rem] font-semibold pb-5">
          Testimonial
        </h2>
        <h3 className="font-nunito text-[2rem] font-bold text-black pb-5">
          People Talk About Us
        </h3>
      </motion.div>

      {/* Testimonial Items */}
      <motion.div
        initial="hidden"
        animate={sectionControls}
        variants={cardVariants}
        transition={{ duration: 1.2, ease: 'easeInOut', delay: 0.2 }}
        className="lg:flex lg:flex-row lg:flex-wrap lg:justify-between lg:gap-4"
      >
        {[ // Array of testimonials
          {
            img: profileImgOne,
            name: 'Munawar',
            position: 'Web Developer',
            quote:
              'As a small business, we needed a quick and effective way to get our marketing videos edited and uploaded. This platform delivered everything we needed—fast, reliable, and high-quality results every time. Their customer support is top-notch, too.',
          },
          {
            img: profileImgTwo,
            name: 'Garry',
            position: 'Creative Manager',
            quote:
              'From uploading my raw footage to getting it edited and uploaded directly to YouTube, this service has saved me so much time. The team’s attention to detail and commitment to quality makes them my go-to choice for video editing!',
          },
          {
            img: profileImgOne,
            name: 'Priyanshu',
            position: 'Web Developer',
            quote:
              'I’ve been using this service for months, and it’s transformed my video production process. The editing team is professional, and the cloud storage makes it so easy to manage all my content. The direct YouTube upload feature is a game changer! Highly recommend!',
          },
        ].map((testimonial, index) => (
          <motion.div
            key={index}
            initial="hidden"
            animate={sectionControls}
            variants={cardVariants}
            transition={{ duration: 1.2, ease: 'easeInOut', delay: index * 0.2 }}
          >
            <TestimonialItem
              img={testimonial.img}
              name={testimonial.name}
              position={testimonial.position}
            >
              {testimonial.quote}
            </TestimonialItem>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
