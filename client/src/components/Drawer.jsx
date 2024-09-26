import React from "react";
import locationIcon from "../assets/location.svg";
import languageIcon from "../assets/language.svg";
import starIcon from "../assets/star.svg";
const dummyReviews = [
  {
    id: 1,
    text: "This is a fantastic service! The editor really understood my vision and brought it to life. The video quality was top-notch, and I couldn't be happier with the final product. Highly recommend!",
    user: "Alice Johnson",
    rating: 5,
  },
  {
    id: 2,
    text: "Great experience! The editor was responsive and attentive to my feedback. They made several adjustments without hesitation, and the final video exceeded my expectations. Will definitely come back for more projects.",
    user: "Bob Smith",
    rating: 4,
  },
  {
    id: 3,
    text: "Very professional and efficient. The turnaround time was impressive, and the quality of the edits was remarkable. Loved the creative touches added to my video; it truly made it stand out!",
    user: "Catherine Lee",
    rating: 5,
  },
  {
    id: 4,
    text: "Absolutely satisfied with the results! The editor was able to capture the essence of my content perfectly. They provided valuable insights and suggestions that improved the overall flow of the video. I'm thrilled with the outcome!",
    user: "David Brown",
    rating: 4,
  },
  {
    id: 5,
    text: "An amazing experience from start to finish. The communication was seamless, and the editor took the time to understand my needs. The final edit was polished and professional, making my video shine. I will definitely recommend their services!",
    user: "Ella Davis",
    rating: 5,
  },
];

function Drawer({ editorData }) {
  console.log(editorData.image);
  return (
    <div>
      <div className="MainProfile shadow-xl w-full rounded-lg bg-white h-2/3">
        {/* Part 1 */}
        <div className="Part1 bg-blue-500 rounded-lg h-64 relative">
          <div className="ml-6 ">
            <img
              src={editorData.image}
              alt="PROFILE"
              className="absolute mt-36"
            />
          </div>
        </div>

        {/* Part 2 */}
        <div className="Part-2 mt-16 p-4">
          <h1 className="font-bold text-gray-800 text-4xl ml-2">
            {editorData.name}
          </h1>
          <p className="mt-10 ml-4">{editorData.bio}</p>

          {/* Location and Languages Section */}
          <div className="flex ml-4 items-center mt-10">
            <img src={locationIcon} alt="Location" className="h-5 w-5 mr-2" />
            <p className="font-bold">{editorData.address}</p>

            <div className="ml-8 flex items-center">
              <img
                src={languageIcon}
                alt="Languages"
                className="h-5 w-5 mr-2"
              />
              <p className="font-bold">{editorData.languages.join(", ")}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="Reviews mt-8">
        <h1 className="font-bold text-gray-800 text-4xl ml-4 mt-24">
          Review & Testimonials
        </h1>
        <div className="carousel carousel-center rounded-box w-full space-x-4 p-4">
          {dummyReviews.map((review) => (
            <div key={review.id} className="carousel-item w-full max-w-xs p-4">
              <div className="bg-white rounded-lg shadow-md p-4">
                <p className="text-gray-500 italic text-lg">"{review.text}"</p>
                <div className="flex items-center mt-2">
                  <img src={starIcon} alt="Rating" className="h-5 w-5 mr-1" />
                  <p className="font-bold">{review.rating} / 5</p>
                </div>
                <p className="font-bold text-right mt-2 text-md">
                  {review.user}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Drawer;
