import { useEffect, useRef, useState } from "react";
import { MdOutlineKeyboardArrowDown } from "react-icons/md";
export const Dropdown = ({
  options,
  chosen,
  setChosen,
}: {
  options: any[];
  chosen: any;
  setChosen: React.Dispatch<React.SetStateAction<any>>;
}) => {
  const [open, setOpen] = useState<boolean>(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const close = (e: Event) => {
      e.stopPropagation();
      if (ref.current && ref.current.contains(e.target as Node)) return;
      setOpen(false);
    };
    window.addEventListener("click", close);
    return () => {
      window.removeEventListener("click", close);
    };
  }, []);
  return (
    <div className="relative">
      <button
        onClick={(e) => {
          e.stopPropagation();
          setOpen(!open);
        }}
        className="flex bg-white rounded-lg p-3 items-center gap-1 w-full justify-between border border-gray-300 hover:border-gray-400 "
      >
        {chosen ? (
          <span className="">{chosen}</span>
        ) : (
          <span className="">პერიოდი</span>
        )}
        <MdOutlineKeyboardArrowDown
          className={(open ? "rotate-180" : "") + " duration-300 text-gray-500"}
        />
      </button>

      {open && (
        <div className="absolute bg-white min-w-full border border-gray-300 rounded-lg top-14 py-1 px-1">
          {options.map((option) => (
            <div
              className="p-2 text-gray-500 cursor-pointer hover:text-black"
              onClick={() => setChosen(option.name)}
            >
              {option.name}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
