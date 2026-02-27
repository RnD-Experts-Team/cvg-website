import React from "react";
import { IoMdMusicalNote } from "react-icons/io"; // Using the music note icon

interface ValueCardProps {
  image?: string;
  title: string;
  description: string;
}

const ValueCard: React.FC<ValueCardProps> = ({ image, title, description }) => {
  return (
    <div className="value-card bg-white rounded-[10px] w-[250px] min-w-[200px] max-w-[350px] h-[304px] max-h-[320px] py-7 px-4 flex flex-col items-center text-center justify-center hover:bg-gray-100 transition-colors duration-300">
      {/* Image/Icon Section */}
      {image && <img src={image} alt="Icon" className="w-12 h-12 mb-[16px] rounded-xl" />}
      {!image && (
        <IoMdMusicalNote
          size={51}
          className="text-[#1E1E1E] mx-auto mb-[16px]"
        />
      )}

      <h3 className="text-[#F68620] font-bold text-xl mb-[11px]">{title}</h3>
      <p className="text-[#1E1E1E] text-sm">{description}</p>
    </div>
  );
};

export default ValueCard;
