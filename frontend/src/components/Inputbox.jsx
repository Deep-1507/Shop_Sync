
export const Inputbox = ({label,placeholder,onChange,type}) => {
    return (
      <div>
        <div className="font-semibold pt-4 text-sm m-2">
            {label}
        </div>
        <input type={type} placeholder={placeholder} onChange={onChange} className="cursor-pointer border-2 border-black rounded-md w-full h-10 p-4 text-lg" />
      </div>
    );
  };
  