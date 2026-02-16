import React from "react";

export const Footer = () => {
  return (
    <div className=" min-h-[295px] w-full bg-[#F68620] flex justify-between items-center gap-[46px] p-[46px] text-[#1E1E1E]">
      <div className=" flex flex-col items-center justify-center gap-[18px] ">
        <div className=" text-center flex items-center gap-[10px]">
          <img
            src="/img/blacklogo.png"
            alt="logo"
            className=" h-[35.447208404541016px] w-[56.77776336669922px] text-[#1E1E1E]"
          />
          <p>Commercial Vision Group</p>
        </div>
        <p className=" pt-[15px] w-full text-center">
          © 2026 CVM Construction All rights reserved.
        </p>
      </div>

      <div>
        <div>
          <h3 className=" text-[18px] font-semibold mb-[10px]">Social media</h3>
          <ul className=" flex flex-col gap-[10px]">
            <li className=" cursor-pointer hover:text-[#1E1E1E] transition-colors duration-200">
              <img src="img/insta.png" alt="insta" />
            </li>
            <li className=" cursor-pointer hover:text-[#1E1E1E] transition-colors duration-200">
              <img src="img/in.png" alt="linkedin" />
            </li>
            <li className=" cursor-pointer hover:text-[#1E1E1E] transition-colors duration-200">
              <img src="img/facebook.png" alt="facebook" />
            </li>
            <li className=" cursor-pointer hover:text-[#1E1E1E] transition-colors duration-200">
                <img src="img/twitter.png" alt="youtupe" />
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};
