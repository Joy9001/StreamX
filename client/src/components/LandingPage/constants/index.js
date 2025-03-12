import {
  benefitIcon1,
  benefitIcon2,
  benefitIcon3,
  benefitIcon4,
  benefitImage2,
  chromecast,
  disc02,
  discord,
  discordBlack,
  facebook,
  figma,
  file02,
  framer,
  homeSmile,
  instagram,
  logoX,
  notification2,
  notification3,
  notification4,
  notion,
  photoshop,
  plusSquare,
  protopie,
  raindrop,
  recording01,
  recording03,
  roadmap2,
  roadmap3,
  searchMd,
  slack,
  sliders04,
  telegram,
  twitter,
} from '../assets'

export const navigation = [
  {
    id: '0',
    title: 'Services',
    url: '#features',
  },
  {
    id: '1',
    title: 'Pricing',
    url: '#pricing',
  },
  {
    id: '2',
    title: 'How to use',
    url: '#how-to-use',
  },
  // {
  //   id: "3",
  //   title: "Roadmap",
  //   url: "#roadmap",
  // },
  // {
  //   id: "4",
  //   title: "New account",
  //   url: "#signup",
  //   onlyMobile: true,
  // },
  // {
  //   id: "5",
  //   title: "Sign in",
  //   url: "#login",
  //   onlyMobile: true,
  // },
]

export const heroIcons = [homeSmile, file02, searchMd, plusSquare]

export const notificationImages = [notification4, notification3, notification2]

export const companyLogos = [logoX, logoX, logoX, logoX, logoX]

export const brainwaveServices = [
  'Photo generating',
  'Photo enhance',
  'Seamless Integration',
]

export const brainwaveServicesIcons = [
  recording03,
  recording01,
  disc02,
  chromecast,
  sliders04,
]

export const roadmap = [
  {
    id: '0',
    title: 'Cloud Storage',
    text: 'User will Need to Not to Worry about Data Loss or Synchronization Issues',
    date: 'March 2025',
    status: 'done',
    imageUrl: roadmap3,
    colorful: true,
  },
  {
    id: '1',
    title: 'Employment Generation',
    text: 'Our Business Model apart From Earning, We Make Sure We create Job Opprtunities As Well',
    date: 'March 2025',
    status: 'progress',
    imageUrl: roadmap2,
  },
  {
    id: '2',
    title: 'Editing On The Go',
    text: 'Creators Just Need to Upload Once and Forget, Our Editors and We in Charge Will Take Care of Deliverance to Youtube',
    date: 'March 2025',
    status: 'done',
    imageUrl: roadmap2,
  },
  {
    id: '3',
    title: 'Top-notch Security For Private Data',
    text: 'Our Robust Authentication Method Keeps Your Content Private and Secure',
    date: 'March 2025',
    status: 'progress',
    imageUrl: roadmap3,
  },
]

export const collabText =
  'With Best in Class Editors and Top notch Security, Now Content Creators Need Not To Worry About Their Content Anymore'

export const collabContent = [
  {
    id: '0',
    title: 'Seamless Upload',
    text: collabText,
  },
  {
    id: '1',
    title: 'Best Editors To Hire',
  },
  {
    id: '2',
    title: 'Top-notch Security',
  },
]

export const collabApps = [
  {
    id: '0',
    title: 'Figma',
    icon: figma,
    width: 26,
    height: 36,
  },
  {
    id: '1',
    title: 'Notion',
    icon: notion,
    width: 34,
    height: 36,
  },
  {
    id: '2',
    title: 'Discord',
    icon: discord,
    width: 36,
    height: 28,
  },
  {
    id: '3',
    title: 'Slack',
    icon: slack,
    width: 34,
    height: 35,
  },
  {
    id: '4',
    title: 'Photoshop',
    icon: photoshop,
    width: 34,
    height: 34,
  },
  {
    id: '5',
    title: 'Protopie',
    icon: protopie,
    width: 34,
    height: 34,
  },
  {
    id: '6',
    title: 'Framer',
    icon: framer,
    width: 26,
    height: 34,
  },
  {
    id: '7',
    title: 'Raindrop',
    icon: raindrop,
    width: 38,
    height: 32,
  },
]

export const pricing = [
  {
    id: '0',
    title: 'Bronze',
    description: '10 GigaBytes of Initial Storage To Start With',
    price: 'Free',
    features: [
      'Free Storage',
      'Upload Speed Greater Than 30 MB/s',
      'Ability to explore the app and its features without any cost',
    ],
  },
  {
    id: '1',
    title: 'Silver',
    description: '100 GigaBytes of Storage and Faster Uploads',
    price: '9.99',
    features: [
      'Faster Uploads Speed Greater Than 100 MB/s',
      'Access to Filtering Features',
      'Higher Priority Support',
    ],
  },
  {
    id: '2',
    title: 'Gold',
    description: '500 GigaBytes of Storage and Faster Uploads',
    price: 99.99,
    features: [
      'Faster Uploads Speed Greater Than 500 MB/s',
      'Premium Support and 24/7 Staff Standby',
      'Access to Advanced Features and Analytics',
    ],
  },
]

export const benefits = [
  {
    id: '0',
    title: 'Cloud Storage',
    text: 'Store your files in the cloud, so you can access them from anywhere.No need to worry about data loss or synchronization issues.',
    backgroundUrl: './src/assets/benefits/card-1.svg',
    iconUrl: benefitIcon1,
    imageUrl: benefitImage2,
  },
  {
    id: '1',
    title: 'Best In Class Editors',
    text: "Our editors are designed to provide the best possible experience for users. Whether you're a beginner or an experienced editor, we've got you covered.",
    backgroundUrl: './src/assets/benefits/card-2.svg',
    iconUrl: benefitIcon2,
    imageUrl: benefitImage2,
    light: true,
  },
  {
    id: '2',
    title: 'Connect everywhere',
    text: 'Connect to the StreamX platform from anywhere, on any device, making it more accessible and convenient.',
    backgroundUrl: './src/assets/benefits/card-3.svg',
    iconUrl: benefitIcon3,
    imageUrl: benefitImage2,
  },
  {
    id: '3',
    title: 'Fast Service',
    text: "Our team is always available to help you with any issues you may encounter. We're here to make sure you have a seamless experience.",

    backgroundUrl: './src/assets/benefits/card-4.svg',
    iconUrl: benefitIcon4,
    imageUrl: benefitImage2,
    light: true,
  },
  {
    id: '4',
    title: 'Secure Platform',
    text: 'We take security seriously and use the latest encryption protocols to protect your data. Your information is safe with us.',

    backgroundUrl: './src/assets/benefits/card-5.svg',
    iconUrl: benefitIcon1,
    imageUrl: benefitImage2,
  },
  {
    id: '5',
    title: 'Easy to Use',
    text: 'Our platform is designed to be user-friendly and intuitive, making it easy for you to get the most out of it.',

    backgroundUrl: './src/assets/benefits/card-6.svg',
    iconUrl: benefitIcon2,
    imageUrl: benefitImage2,
  },
]

export const socials = [
  {
    id: '0',
    title: 'Discord',
    iconUrl: discordBlack,
    url: '#',
  },
  {
    id: '1',
    title: 'Twitter',
    iconUrl: twitter,
    url: '#',
  },
  {
    id: '2',
    title: 'Instagram',
    iconUrl: instagram,
    url: '#',
  },
  {
    id: '3',
    title: 'Telegram',
    iconUrl: telegram,
    url: '#',
  },
  {
    id: '4',
    title: 'Facebook',
    iconUrl: facebook,
    url: '#',
  },
]
