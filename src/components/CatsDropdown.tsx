import { CatsType } from "../models/Types";
import { useEffect, useState } from "react";
import { MdOutlineKeyboardArrowDown } from "react-icons/md";
import { RiCheckboxBlankLine, RiCheckboxFill } from "react-icons/ri";
import { useRef } from "react";
export const CatsDropdown = ({
  options,
  chosen,
  setChosen,
}: {
  options: CatsType[];
  chosen: CatsType[];
  setChosen: React.Dispatch<React.SetStateAction<CatsType[]>>;
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
      <div className="mb-2">კატეგორია</div>
      <button
        ref={buttonRef}
        onClick={(e) => {
          setOpen(!open);
        }}
        className="flex bg-white rounded-lg p-3 items-center gap-1 w-full justify-between border border-gray-300 hover:border-gray-400 "
      >
        {chosen.length > 0 ? (
          <span className="w-3/4 truncate text-left">
            {chosen.map((c) => c.title).join(", ")}
          </span>
        ) : (
          <span className="text-gray-500">ყველა კატეგორია</span>
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
          <div className="flex flex-col p-4 max-h-80 overflow-auto">
            {options.map((option) => (
              <div
                key={option.category_id}
                className="flex items-center gap-2 cursor-pointer text-gray-500 hover:text-black duration-300 py-1"
                onClick={(e) => {
                  e.stopPropagation();
                  if (
                    chosen.findIndex(
                      (c) => c.category_id === option.category_id
                    ) > -1
                  ) {
                    setChosen(
                      chosen.filter((c) => c.category_id !== option.category_id)
                    );
                  } else {
                    setChosen([...chosen, option]);
                  }
                }}
              >
                {chosen.findIndex((c) => c.category_id === option.category_id) >
                -1 ? (
                  <RiCheckboxFill className="text-[rgb(253,65,0)] text-xl" />
                ) : (
                  <RiCheckboxBlankLine className="text-xl" />
                )}

                <span>{option.title}</span>
              </div>
            ))}
          </div>
          <div className="border-t border-r-gray-300 px-3 py-2 flex justify-between">
            <button
              className="p-1"
              onClick={(e) => {
                e.stopPropagation();
                setChosen([]);
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
