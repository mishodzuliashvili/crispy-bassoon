import { RentOptions } from "../models/Documents";
import {
  AugmentedMansModelsType,
  CatsType,
  MansType,
  RentType,
} from "../models/Types";
import { useEffect, useState } from "react";
import { MdOutlineKeyboardArrowDown } from "react-icons/md";
import { RiCheckboxBlankLine, RiCheckboxFill } from "react-icons/ri";
import { useRef } from "react";
export const MansDropdwown = ({
  mansOptions,
  chosenMans,
  setChosenMans,
  setChosenModels,
}: {
  mansOptions: MansType[];
  chosenMans: MansType[];
  setChosenMans: React.Dispatch<React.SetStateAction<MansType[]>>;
  setChosenModels: React.Dispatch<
    React.SetStateAction<AugmentedMansModelsType[]>
  >;
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
      <div className="mb-2">მწარმოებელი</div>
      <button
        ref={buttonRef}
        onClick={(e) => {
          setOpen(!open);
        }}
        className="flex bg-white rounded-lg p-3 items-center gap-1 w-full justify-between border border-gray-300 hover:border-gray-400 "
      >
        {chosenMans.length > 0 ? (
          <span className="w-3/4 truncate text-left">
            {chosenMans.map((c) => c.man_name).join(", ")}
          </span>
        ) : (
          <span className="text-gray-500">ყველა მწარმოებელი</span>
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
            {mansOptions.map((option) => (
              <div
                key={option.man_id}
                className="flex items-center gap-2 cursor-pointer text-gray-500 hover:text-black duration-300 py-1"
                onClick={(e) => {
                  e.stopPropagation();
                  if (
                    chosenMans.findIndex((c) => c.man_id === option.man_id) > -1
                  ) {
                    setChosenMans(
                      chosenMans.filter((c) => c.man_id !== option.man_id)
                    );
                    setChosenModels((chosenModels) =>
                      chosenModels.filter((c) => c.man_id !== option.man_id)
                    );
                  } else {
                    setChosenMans([...chosenMans, option]);
                    setChosenModels((chosenModels) => [
                      ...chosenModels,
                      { man_id: option.man_id, models: [] },
                    ]);
                  }
                }}
              >
                {chosenMans.findIndex((c) => c.man_id === option.man_id) >
                -1 ? (
                  <RiCheckboxFill className="text-[rgb(253,65,0)] text-xl" />
                ) : (
                  <RiCheckboxBlankLine className="text-xl" />
                )}

                <span>{option.man_name}</span>
              </div>
            ))}
          </div>
          <div className="border-t border-r-gray-300 px-3 py-2 flex justify-between">
            <button
              className="p-1"
              onClick={(e) => {
                e.stopPropagation();
                // setChosenModels([]);
                setChosenMans([]);
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
