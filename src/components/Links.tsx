import { MdOutlineKeyboardArrowRight } from "react-icons/md";
export const Links = () => {
  return (
    <div className="text-[#6F7383] flex items-center gap-2 mt-[32px]">
      <div>მთავარი</div>
      <MdOutlineKeyboardArrowRight />
      <div>ძიება</div>
      <MdOutlineKeyboardArrowRight />
      <div className="text-[#FD4100]">იყიდება</div>
    </div>
  );
};
