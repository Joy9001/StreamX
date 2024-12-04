import { motion, useAnimation } from 'framer-motion'
import { Award, Check, Zap } from 'lucide-react'
import { useEffect } from 'react'
import { useInView } from 'react-intersection-observer'

export default function OurPricing() {
  const { ref: sectionRef, inView: sectionInView } = useInView({
    threshold: 0.5,
    triggerOnce: false,
  })

  const sectionControls = useAnimation()

  useEffect(() => {
    if (sectionInView) {
      sectionControls.start('visible')
    } else {
      sectionControls.start('hidden')
    }
  }, [sectionInView, sectionControls])

  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0 },
  }

  const plans = [
    {
      title: 'Bronze Plan',
      price: '$9.99',
      features: [
        '5 Video Uploads',
        'Basic Video Editing',
        '1 GB Cloud Storage',
      ],
      icon: <Award color='#CD7F32' size={48} />,
      color: {
        from: '#F5DEB3',
        to: '#D2691E',
      },
      recommend: false,
    },
    {
      title: 'Silver Plan',
      price: '$19.99',
      features: [
        '20 Video Uploads',
        'Advanced Video Editing',
        '10 GB Cloud Storage',
      ],
      icon: <Zap color='#C0C0C0' size={48} />,
      color: {
        from: '#E6E6FA',
        to: '#4169E1',
      },
      recommend: true,
    },
    {
      title: 'Gold Plan',
      price: '$49.99',
      features: [
        'Unlimited Video Uploads',
        'Professional Video Editing',
        '100 GB Cloud Storage',
      ],
      icon: <Zap color='#FFD700' size={48} />,
      color: {
        from: '#FFE4B5',
        to: '#DAA520',
      },
      recommend: false,
    },
  ]

  return (
    <section id='projects' ref={sectionRef} className='bg-violet-25 py-16'>
      <motion.h2
        initial='hidden'
        animate={sectionControls}
        variants={cardVariants}
        transition={{ duration: 1.2, ease: 'easeInOut' }}
        className='mb-12 text-center text-4xl font-bold text-gray-800'>
        Choose Your Perfect Plan
      </motion.h2>

      <motion.div
        initial='hidden'
        animate={sectionControls}
        variants={cardVariants}
        transition={{ duration: 1.2, ease: 'easeInOut', delay: 0.2 }}
        className='flex flex-wrap items-center justify-center gap-8 px-4'>
        {plans.map((plan, index) => (
          <motion.div
            key={index}
            initial='hidden'
            animate={sectionControls}
            variants={cardVariants}
            transition={{
              duration: 1.2,
              ease: 'easeInOut',
              delay: index * 0.2,
            }}
            className={`hover:shadow-3xl relative w-[350px] overflow-hidden rounded-2xl p-6 text-center shadow-2xl transition-all duration-300 hover:scale-105 ${plan.recommend ? 'border-4 border-blue-500' : ''} `}
            style={{
              background: `linear-gradient(135deg, ${plan.color.from}, ${plan.color.to})`,
              backgroundClip: 'border-box',
              color: 'white',
            }}
            whileHover={{
              scale: 1.05,
              boxShadow:
                '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
            }}>
            {plan.recommend && (
              <div className='absolute right-0 top-0 rounded-bl-lg bg-blue-500 px-3 py-1 text-white'>
                Recommended
              </div>
            )}

            <div className='mb-6 flex justify-center'>{plan.icon}</div>

            <h3 className='mb-4 text-2xl font-bold'>{plan.title}</h3>

            <div className='mb-6 text-4xl font-extrabold'>
              {plan.price}
              <span className='text-base'>/month</span>
            </div>

            <ul className='mb-8 space-y-3'>
              {plan.features.map((feature, i) => (
                <li key={i} className='flex items-center justify-center gap-2'>
                  <Check size={20} className='text-white' />
                  {feature}
                </li>
              ))}
            </ul>
          </motion.div>
        ))}
      </motion.div>
    </section>
  )
}
