import { PriceFromType, PriceToType } from "../models/Types";
import { TbCurrencyLari } from "react-icons/tb";
import { BiDollar } from "react-icons/bi";
export const PriceChose = ({
  priceFrom,
  setPriceFrom,
  priceTo,
  setPriceTo,
  generalPrice,
  setGeneralPrice,
}: {
  priceFrom: PriceFromType | undefined;
  setPriceFrom: (priceFrom: PriceFromType) => void;
  priceTo: PriceToType | undefined;
  setPriceTo: (priceTo: PriceToType) => void;
  generalPrice: string;
  setGeneralPrice: (generalPrice: string) => void;
}) => {
  return (
    <div>
      <div className="mb-4 flex justify-between">
        <span>ფასი</span>
        <div className="flex text-xl border border-gray-300 relative">
          <div
            className={
              "absolute bg-orange-500 w-1/2 h-full z-0 " +
              (generalPrice === "dollar" ? "right-0" : "")
            }
          ></div>
          <div className={"p-1 z-20"} onClick={() => setGeneralPrice("lari")}>
            <TbCurrencyLari />
          </div>
          <div className={"p-1 z-20"} onClick={() => setGeneralPrice("dollar")}>
            <BiDollar />
          </div>
        </div>
      </div>
      <div className="flex gap-2 items-center">
        <input
          type="number"
          className="border border-gray-300 rounded-md w-1/2 p-3"
          placeholder="დან"
          value={priceFrom}
          onChange={(e: any) => setPriceFrom(e.target.value)}
        />
        <span>-</span>
        <input
          type="number"
          className="border border-gray-300 rounded-md w-1/2 p-3"
          placeholder="მდე"
          value={priceTo}
          onChange={(e: any) => setPriceTo(e.target.value)}
        />
      </div>
    </div>
  );
};
