import React, { useState } from "react";
import locationIcon from "../assets/location.svg";
import languageIcon from "../assets/language.svg";
import starIcon from "../assets/star.svg";
import checkIcon from "../assets/tick.svg";
import crossIcon from "../assets/cross.svg";

function Card() {
  const [selectedPlan, setSelectedPlan] = useState("Basic");

  const description =
    "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Odio, ipsam, fugit amet harum delectus, impedit dolores temporibus voluptates totam ducimus distinctio saepe unde numquam quisquam Ex repellendus veniam molestias nisi.";
  const words = description.split(" ");
  const shortDescription = words.slice(0, 25).join(" ");

  const skills = [
    "React",
    "JavaScript",
    "Tailwind CSS",
    "Node.js",
    "MongoDB",
    "dscc",
    "bhang",
  ];

  const services = [
    "React",
    "JavaScript",
    "Tailwind CSS",
    "Node.js",
    "MongoDB",
  ];

  const plans = {
    Basic: {
      price: "₹3,506",
      description:
        "Cuts & joins, logo placement, and basic editing for up to 10 minutes.",
      delivery: "2-day delivery",
      revisions: "Unlimited revisions",
      availableSkills: [0, 1],
    },
    Standard: {
      price: "₹5,000",
      description:
        "Includes everything in Basic plus color grading and motion graphics.",
      delivery: "2-day delivery",
      revisions: "Unlimited revisions",
      availableSkills: [0, 1, 2, 3],
    },
    Premium: {
      price: "₹8,000",
      description:
        "Includes everything in Standard plus advanced editing and sound design.",
      delivery: "1-day delivery",
      revisions: "Unlimited revisions",
      availableSkills: [0, 1, 2, 3, 4],
    },
  };

  return (
    <div className="Cards cursor-pointer flex items-center">
      {/* Card for Profile */}
      <div className="card rounded-none shadow-xl w-8/12 mt-10 ml-14 flex-col h-[50vh] bg-white border-solid border-gray-300 border-2">
        <div className="flex">
          <div className="ProfilePic ml-5 mt-5 h-60 w-60 overflow-hidden flex-shrink-0">
            <video
              src="https://www.w3schools.com/html/mov_bbb.mp4" // Replace with your video URL
              controls
              className="object-cover w-full h-full"
            />
          </div>
          <div className="card-body">
            <h2 className="card-title font-bold text-3xl text-black ml-4">
              Devansh Vashist
            </h2>
            <div className="flex ml-4 items-center mt-2">
              <img src={locationIcon} alt="Location" className="h-5 w-5 mr-2" />
              <div className="address">
                <p className="font-bold">Punjab</p>
              </div>
              <div className="ml-6 flex">
                <img src={starIcon} alt="Rating" className="h-5 w-5 mr-2" />
                <p>4.5</p>
              </div>
              <div className="ml-8 flex items-center">
                <img
                  src={languageIcon}
                  alt="Languages"
                  className="h-5 w-5 mr-2"
                />
                <p className="font-bold">Hindi, English</p>
              </div>
            </div>
            <div className="description mt-6 text-gray-800">
              <p>
                {shortDescription}...{" "}
                <span className="text-blue-700">Read More</span>
              </p>
            </div>
          </div>
        </div>

        {/* Skills Section */}
        <div className="skills mb-4 mt-8 ml-4 flex">
          <div className="flex flex-wrap gap-2">
            {skills.map((skill, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-gray-200 text-black rounded-lg h-8 w-auto"
              >
                {skill}
              </span>
            ))}
          </div>
          <div className="buttons ml-auto flex gap-4 mr-4">
            <button className="border-gray-400 border-2 border-solid w-40 h-16 hover:bg-blue-600 hover:text-white bg-white text-gray-600 font-bold rounded-lg text-lg">
              View Profile
            </button>
            <button className="border-gray-400 border-2 border-solid w-40 h-16 hover:bg-blue-600 hover:text-white bg-white text-gray-600 font-bold rounded-lg text-lg">
              Book Now
            </button>
          </div>
        </div>
      </div>

      {/* Plan Card */}
      <div className="plan bg-white h-[50vh] shadow-xl mr-20 mt-10 max-w-80 border-solid border-gray-300 border-2">
        {/* Pricing Tabs (Grid Layout) */}
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

        {/* Pricing Plan Details */}
        <div className="pricing-details mt-8 mb-8 ml-6">
          <p className="text-black text-3xl font-bold mt-4">
            {plans[selectedPlan].price}
          </p>
          <p className="text-black mt-6 mr-4 break-words">
            {plans[selectedPlan].description}
          </p>
          <div className="flex mt-2">
            <p className="text-gray-500 mt-1 text-sm">
              {plans[selectedPlan].delivery}
            </p>
            <p className="text-gray-500 mt-1 text-sm ml-6">
              {plans[selectedPlan].revisions}
            </p>
          </div>

          {/* Skills Section for Each Plan */}
          <div className="skills mt-4">
            <div className="flex-col flex-wrap gap-2 mt-2 h-20 overflow-y-auto">
              {services.map((skill, index) => (
                <div key={index} className="flex items-center">
                  {plans[selectedPlan].availableSkills.includes(index) ? (
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
                        alt="Available"
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
