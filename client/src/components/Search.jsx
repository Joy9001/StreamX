import React from "react";

function Search() {
  return (
    <div>
      <label className="input input-bordered flex border-solid border-2 border-gray-300 items-center w-5/12 bg-white mt-10 ml-16 gap-2  duration-200 ">
        <input
          type="text"
          className="grow"
          placeholder="Search for any Skill, domain or name... "
        />
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 16 16"
          fill="currentColor"
          className="h-4 w-4 opacity-70"
        >
          <path
            fillRule="evenodd"
            d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
            clipRule="evenodd"
          />
        </svg>
      </label>
    </div>
  );
}

export default Search;
