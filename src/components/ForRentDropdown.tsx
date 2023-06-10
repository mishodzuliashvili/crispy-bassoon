import { RentOptions } from "../models/Documents";
import { RentType } from "../models/Types";
import { useEffect, useState } from "react";
import { MdOutlineKeyboardArrowDown } from "react-icons/md";
import { RiCheckboxBlankLine, RiCheckboxFill } from "react-icons/ri";
import { useRef } from "react";
export const ForRentDropdown = ({
  rent,
  setRent,
}: {
  rent: RentType | undefined;
  setRent: React.Dispatch<React.SetStateAction<RentType | undefined>>;
}) => {
  const [open, setOpen] = useState<boolean>(false);
  const ref = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<any>(null);
  useEffect(() => {
    const close = (e: Event) => {
      e.stopPropagation();
      if (
        (ref.current && ref.current.contains(e.target as Node)) ||
        (buttonRef.current && buttonRef.current?.contains(e.target as Node))
      )
        return;
      setOpen(false);
    };
    window.addEventListener("click", close);
    return () => {
      window.removeEventListener("click", close);
    };
  }, []);
  return (
    <div className="relative overflow-visible">
      <div className="mb-2">გარიგების ტიპი</div>
      <button
        ref={buttonRef}
        onClick={(e) => {
          // e.stopPropagation();
          setOpen(!open);
        }}
        className="flex bg-white rounded-lg p-3 items-center gap-1 w-full justify-between border border-gray-300 hover:border-gray-400 "
      >
        {rent ? (
          <span>{rent.name}</span>
        ) : (
          <span className="text-gray-500">გარიგების ტიპი</span>
        )}
        <MdOutlineKeyboardArrowDown
          className={(open ? "rotate-180" : "") + " duration-300 text-gray-500"}
        />
      </button>

      {open && (
        <div
          ref={ref}
          className="absolute w-full bg-white rounded-lg border border-gray-300 left-0 top-24 z-50"
        >
          <div className="flex flex-col p-4">
            {RentOptions.map((option) => (
              <div
                key={option.id}
                className="flex items-center gap-2 cursor-pointer text-gray-500 hover:text-black duration-300 py-1"
                onClick={(e) => {
                  e.stopPropagation();
                  setRent(option);
                }}
              >
                {rent?.id === option.id ? (
                  <RiCheckboxFill className="text-[rgb(253,65,0)] text-xl" />
                ) : (
                  <RiCheckboxBlankLine className="text-xl" />
                )}

                <span>{option.name}</span>
              </div>
            ))}
          </div>
          <div className="border-t border-r-gray-300 px-3 py-2 flex justify-between">
            <button
              className="p-1"
              onClick={(e) => {
                e.stopPropagation();
                setRent(undefined);
              }}
            >
              გასუფთავება
            </button>
            <button
              className="p-1 px-2 bg-[rgb(253,65,0)] text-white rounded-lg"
              onClick={(e) => {
                e.stopPropagation();
                setOpen(false);
              }}
            >
              არჩევა
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
