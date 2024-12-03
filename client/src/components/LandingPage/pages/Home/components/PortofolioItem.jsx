export default function PortofolioItem({ img, text, css}) {
    return (
        <div className="relative mx-auto px-10 flex flex-col items-center justify-center min-w-[16rem] w-1/2 aspect-square rounded-[2.5rem] bg-white drop-shadow-spread border border-1 border-grey border-opacity-20 lg:min-w-[11rem] hover:scale-105 duration-300">
            
            <span className="absolute bottom-4 z-10 px-2 font-quicksand text-[1.5rem] font-bold text-white text-center leading-6">
                {text}
            </span>
            <img src={img} alt="Portofolio Image" className="absolute z-0 w-full object-fit object-cover"/>
        </div>
    );
}
