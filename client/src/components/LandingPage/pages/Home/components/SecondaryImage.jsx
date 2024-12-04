import ImgOne from '../../../assets/images/secondary-image-1.png'
import ImgTwo from '../../../assets/images/secondary-image-2.png'


export default function SecondaryImage() {
  return (
    <div className="relative w-full h-[85vw] my-[7rem]">
        <img src={ImgOne} alt="" className="absolute bottom-0 left-0 z-10 w-[70%]" />
        <img src={ImgTwo} alt="" className="absolute top-o right-0 z-0 w-[60%]" />
    </div>
  )
}
