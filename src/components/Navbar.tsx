import { Logo } from "../assets/Logo";

export const Navbar = () => {
  return (
    <div className="bg-white py-5 mainxl:px-0 px-4">
      <nav className="max-w-[1050px] mx-auto">
        <Logo />
      </nav>
    </div>
  );
};
