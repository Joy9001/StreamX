import React, { useState } from "react";
import locationIcon from "../assets/location.svg";
import languageIcon from "../assets/language.svg";
import starIcon from "../assets/star.svg";
import checkIcon from "../assets/tick.svg";
import crossIcon from "../assets/cross.svg";

function Card({ data }) {
  const [selectedPlan, setSelectedPlan] = useState("Basic");
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);

  const plans = data.plans
    ? {
        Basic: {
          price: `₹${data.plans[0].basic.price}`,
          description: data.plans[0].basic.desc,
          delivery: `${data.plans[0].basic.deliveryTime} day delivery`,
          revisions: "Unlimited revisions",
          availableSkills: data.plans[0].basic.ServiceOptions,
        },
        Standard: {
          price: `₹${data.plans[0].standard.price}`,
          description: data.plans[0].standard.desc,
          delivery: `${data.plans[0].standard.deliveryTime} day delivery`,
          revisions: "Unlimited revisions",
          availableSkills: data.plans[0].standard.ServiceOptions,
        },
        Premium: {
          price: `₹${data.plans[0].premium.price}`,
          description: data.plans[0].premium.desc,
          delivery: `${data.plans[0].premium.deliveryTime} day delivery`,
          revisions: "Unlimited revisions",
          availableSkills: data.plans[0].premium.ServiceOptions,
        },
      }
    : {};

  const services = [
    "React",
    "JavaScript",
    "Tailwind CSS",
    "Node.js",
    "MongoDB",
  ];

  const videos = [
    "https://www.w3schools.com/html/mov_bbb.mp4",
    "https://www.w3schools.com/html/movie.mp4",
    "https://www.learningcontainer.com/wp-content/uploads/2020/05/sample-mp4-file.mp4",
  ];

  const nextVideo = () => {
    setCurrentVideoIndex((prevIndex) =>
      prevIndex === videos.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevVideo = () => {
    setCurrentVideoIndex((prevIndex) =>
      prevIndex === 0 ? videos.length - 1 : prevIndex - 1
    );
  };

  return (
    <div className="Cards cursor-pointer flex items-center">
      <div className="card rounded-none shadow-xl w-8/12 mt-10 ml-14 flex-col h-[50vh] bg-white border-solid border-gray-300 border-2">
        <div className="flex">
          <div className="flex items-center">
            <button
              onClick={prevVideo}
              className="text-black p-2 rounded-full shadow-md hover:bg-gray-400 transition mr-0"
            >
              &lt;
            </button>
            <div className="Profilevideo mt-2 h-60 w-60 overflow-hidden flex-shrink-0">
              <video
                key={currentVideoIndex}
                src={videos[currentVideoIndex]}
                controls
                className="object-cover w-full h-full"
                onMouseEnter={(e) => e.target.play()}
                onMouseLeave={(e) => e.target.pause()}
              />
            </div>
            <button
              onClick={nextVideo}
              className="text-black p-2 rounded-full shadow-md hover:bg-gray-400 transition"
            >
              &gt;
            </button>
          </div>
          <div className="card-body">
            <h2 className="card-title font-bold text-3xl text-black ml-4">
              {data.name}
            </h2>
            <div className="flex ml-4 items-center mt-2">
              <img src={locationIcon} alt="Location" className="h-5 w-5 mr-2" />
              <p className="font-bold">{data.address}</p>
              <div className="ml-6 flex">
                <img src={starIcon} alt="Rating" className="h-5 w-5 mr-2" />
                <p>{data.rating}</p>
              </div>
              <div className="ml-8 flex items-center">
                <img
                  src={languageIcon}
                  alt="Languages"
                  className="h-5 w-5 mr-2"
                />
                <p className="font-bold">{data.languages.join(", ")}</p>
              </div>
            </div>
            <div className="description mt-6 text-gray-800">
              <p>
                {data.bio}... <span className="text-blue-700">Read More</span>
              </p>
            </div>
          </div>
        </div>

        <div className="skills mb-4 mt-8 ml-4 flex">
          <div className="flex flex-wrap gap-2">
            {data.skills.map((skill, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-gray-200 text-black rounded-lg h-8 w-auto"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="plan bg-white h-[50vh] shadow-xl mr-20 mt-10 max-w-80 border-solid border-gray-300 border-2">
        <div className="pricing-tabs grid grid-cols-3 gap-2 mt-8 mx-2">
          {["Basic", "Standard", "Premium"].map((planName) => (
            <div
              key={planName}
              className={`px-4 py-2 text-center cursor-pointer border border-gray-300 rounded-lg ${
                selectedPlan === planName ? "border-blue-500 shadow-lg" : ""
              }`}
              onClick={() => setSelectedPlan(planName)}
            >
              <p
                className={
                  selectedPlan === planName
                    ? "font-bold text-blue-700"
                    : "text-gray-700"
                }
              >
                {planName}
              </p>
            </div>
          ))}
        </div>

        <div className="pricing-details mt-8 mb-8 ml-6">
          <p className="text-black text-3xl font-bold mt-4">
            {plans[selectedPlan]?.price}
          </p>
          <p className="text-black mt-6 mr-4 break-words">
            {plans[selectedPlan]?.description}
          </p>
          <div className="flex mt-2">
            <p className="text-gray-500 mt-1 text-sm">
              {plans[selectedPlan]?.delivery}
            </p>
            <p className="text-gray-500 mt-1 text-sm ml-6">
              {plans[selectedPlan]?.revisions}
            </p>
          </div>

          <div className="skills mt-4">
            <div className="flex-col flex-wrap gap-2 mt-2 h-20">
              {services.map((skill, index) => (
                <div key={index} className="flex items-center">
                  {plans[selectedPlan]?.availableSkills.includes(index) ? (
                    <>
                      <img
                        src={checkIcon}
                        alt="Available"
                        className="h-4 w-4 mr-2"
                      />
                      <span className="text-black">{skill}</span>
                    </>
                  ) : (
                    <>
                      <img
                        src={crossIcon}
                        alt="Not Available"
                        className="h-4 w-4 mr-2"
                      />
                      <span className="text-gray-500">{skill}</span>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Card;
