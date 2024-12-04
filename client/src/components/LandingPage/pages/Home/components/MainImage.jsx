import image from '../../../assets/images/main-image.png'
import starIcon from '../../../assets/icons/star.svg'
import profileImg from '../../../assets/images/pict-profile-1.jpeg'
import imgDecorationOrg from '../../../assets/images/img-decoration-org.svg'
import imgDecorationBlue from '../../../assets/images/img-decoration-blue.svg'


export default function MainImage() {
    return (
        <section className="relative mt-10 w-full lg:w-[60%] lg:mx-auto aspect-[1.47/1]">
            <div className="z-20 box-content absolute flex flex-col items-center  bg-white shadow-top-left -top-5 -left-3 lg:top-3 lg:-left-16  rounded-md drop-shadow-top-left px-4 py-2">
                <div className="flex flex-row gap-x-1 items-center ">
                    <img src={starIcon} alt="star icon" className="h-4 aspect-square"/>
                    <span className="font-quicksand text-[0.6rem] font-[700] text-black opacity-50">Great Project</span>
                </div>
                <span className="font-nunito text-[1rem] font-[400] text-black"><span className="font-[600]">800+</span> Done</span>
            </div>

            <div className="z-20 absolute w-1/3 p-3 bg-white shadow-bottom-right -bottom-3 -right-3 lg:-right-16 rounded-md drop-shadow-bottom-right">
                <div className="flex flex-row gap-2">
                    <div className="rounded-full overflow-hidden h-5 aspect-square">
                        <img src={profileImg} alt="profile picture"/>
                    </div>
                    <div className="flex flex-col font-quicksand">
                        <span className="text-[0.45rem] font-[600] text-black">Junaris Alf</span>
                        <span className="font-quicksand text-[0.3rem] text-black font-[600]  opacity-50">Junaris Alf</span>
                    </div>
                </div>
                <span className="inline-block mt-2 font-nunito text-[0.4rem] text-black opacity-80 font-[400] leading-none">“ This team is really the best in its field,I don't regret working with them, and will come back again thanks “</span>
            </div>

            <img src={image} alt="main image" className="z-10 absolute inset-0 w-full aspect-[1.47/1] mx-auto"/>
            <img src={imgDecorationOrg} alt="decoration" className="z-0 absolute -top-2 -right-2"/>
            <img src={imgDecorationBlue} alt="decoration" className="z-0 absolute -bottom-2 -left-2"/>


        </section>
    )
}