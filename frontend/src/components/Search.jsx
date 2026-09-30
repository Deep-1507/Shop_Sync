import { Icon } from "@iconify/react";

export const Search = ({ label, placeholder, onChange }) => {
  return (
    <div className="relative flex justify-end items-center">
      <input
        type="text"
        placeholder={placeholder}
        onChange={onChange}
        className="w-1/3 px-4 mr-14 py-2 pr-12 rounded-md bg-white text-[#0071CE] focus:outline-none border border-gray-400 shadow-md hover:bg-blue-100 transition ease-in-out duration-200"
      />
      <span className="absolute right-2.5 flex items-center justify-center w-8 h-8 bg-walmartBlue rounded-full cursor-pointer hover:bg-blue-700 transition ease-in-out duration-200">
        <Icon icon="mdi:plus" color="white" width="24" />
      </span>
    </div>
  );
};
