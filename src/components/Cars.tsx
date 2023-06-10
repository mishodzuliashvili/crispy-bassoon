import { AugmentedProductType, SearchResponseType } from "../models/Types";
import { TbPencilMinus } from "react-icons/tb";
import { BsHeart } from "react-icons/bs";
import { MdCompare } from "react-icons/md";
import motor from "../assets/motor.png";
import speed from "../assets/speed.png";
import sache from "../assets/sache.png";
import avtomatic from "../assets/avtomatic.png";
import { TbCurrencyLari } from "react-icons/tb";
import { BiDollar } from "react-icons/bi";

const gearTypeDict: { [key: number]: string } = {
  1: "მექანიკა",
  2: "ავტომატიკა",
  3: "ტრიპტონიკი",
  4: "ვარიატორი",
};

const fuelTypeDict: { [key: number]: string } = {
  2: "ბენზინი",
  3: "დიზელი",
  6: "ჰიბრიდი",
  7: "ელექტრო",
  8: "ბუნებრივი გაზი",
  9: "თხევადი გაზი",
  10: "დატენვადი ჰიბრიდი",
  12: "წყალბადი",
};
export const Cars = ({
  cars,
  loading,
  generalPrice,
}: {
  cars: SearchResponseType | undefined;
  loading: boolean;
  generalPrice: string;
}) => {
  console.log(cars);
  if (loading || !cars) return <div>loading...</div>;
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth();
  const currentDay = new Date().getDate();

  return (
    <div className="flex flex-col gap-3">
      {cars.data.map((car) => (
        <div
          key={car.car_id}
          className="bg-white p-3 grid grid-cols-[200px_1fr] gap-4 rounded-lg border border-gray-300"
        >
          <img src={car.img} alt="" className="rounded-lg" />
          <div className="flex flex-col justify-between">
            <div className="flex justify-between">
              <div className="flex gap-2">
                <span className="text-lg">
                  {car.man_name + " " + car.model_name}
                </span>
                <span className="text-gray-500">{car.prod_year + "წ"}</span>
              </div>
              <div>
                {car.customs_passed ? (
                  <span className="text-green-500">განბაჟებული</span>
                ) : (
                  <span className="text-red-500">განუბაჟებელი</span>
                )}
              </div>
            </div>
            <div className="flex justify-between">
              <div className="grid grid-cols-2 grid-rows-2 w-3/4">
                <div className="flex gap-3 py-2">
                  <img className="w-5 h-5" src={motor} alt="" />
                  <span>{gearTypeDict[car.gear_type_id]}</span>
                </div>
                <div className="flex gap-3 py-2">
                  <img className="w-5 h-5" src={speed} alt="" />
                  <span>{car.car_run_km + " კმ"}</span>
                </div>
                <div className="flex gap-3 py-2">
                  <img className="w-5 h-5" src={avtomatic} alt="" />
                  <span>{fuelTypeDict[car.fuel_type_id]}</span>
                </div>
                <div className="flex gap-3 py-2">
                  <img className="w-5 h-5" src={sache} alt="" />
                  <span>{car.right_wheel ? "მარჯვენა" : "მარცხენა"}</span>
                </div>
              </div>
              <div className="flex gap-3 items-center">
                <span className="text-xl">
                  {generalPrice === "lari" ? car.price : car.price_usd}
                </span>
                <div className="bg-gray-300 text-xl p-2 rounded-full flex items-center justify-center">
                  {generalPrice === "lari" ? <TbCurrencyLari /> : <BiDollar />}
                </div>
              </div>
              {/* <span>{car.price}</span>/ */}
              {/* <span>{car.drive_type_id}</span> */}
              {/* <span>{car.hours_used}</span> */}
              {/* <span>{car.car_run}</span> */}
              {/* <span>{car.views}</span> */}
              {/* <span>{car.order_date}</span> */}
              {/* <span>{car.customs_passed}</span> */}
              {/* <span>{car.price_usd}</span> */}
            </div>
            <div className="flex justify-between mt-auto">
              <div className="text-gray-500">
                {car.views +
                  " ნახვა . " +
                  (parseInt(car.order_date.substring(0, 4)) < currentYear
                    ? currentYear -
                      parseInt(car.order_date.substring(0, 4)) +
                      " წლის წინ"
                    : parseInt(car.order_date.substring(5, 7)) < currentMonth
                    ? currentMonth -
                      parseInt(car.order_date.substring(5, 7)) +
                      " თვის წინ"
                    : parseInt(car.order_date.substring(8, 10)) < currentDay
                    ? currentDay -
                      parseInt(car.order_date.substring(8, 10)) +
                      " დღის წინ"
                    : "")}
              </div>
              <div className="flex gap-1 text-md">
                <TbPencilMinus />
                <MdCompare />
                <BsHeart />
              </div>
            </div>
            <div></div>
            <div></div>
          </div>
        </div>
      ))}
    </div>
  );
};
