import { Link, useLocation, useNavigate } from "react-router-dom"
import { useEffect, useState } from "react";
import HeaderSidebar from "./header-sidebar";
import LanguageChanger from "./language-changer";
import { IoSearch } from "react-icons/io5";
import { MdClear, MdEdit } from "react-icons/md";
import AuthComponent from "./auth-component";
import { IoIosLogOut } from "react-icons/io";

function Header() {
    const token = localStorage.getItem('token')
    const navigate = useNavigate()

    const url = useLocation()
    const [scrolled, setScrolled] = useState(false);

    const skrolledCase = scrolled || ( url.pathname !== '/' && url.pathname !== '/about' && url.pathname !== '/resources'  && url.pathname !== '/favorites'  && url.pathname !== '/appointment' && url.pathname !== '/create-centers' && url.pathname !== '/create-centers' && url.pathname !== '/my-centers') 

    useEffect(() => {
        const handleScroll = () => {setScrolled(window.scrollY > 50);};
        window.addEventListener("scroll", handleScroll);
        return () => {window.removeEventListener("scroll", handleScroll)};
    }, []);

    const handleLogout = () => {
      localStorage.clear()
      window.location.reload()
    }
  return (
    <header className={`${skrolledCase ? "bg-[#e1e1e1] shadow-xl" : "bg-[#fff]"} px-5 md:px-10 py-[10px] fixed w-full z-99`}>
      <div className="flex items-center justify-between gap-[20px]">
        <Link to={'/'} className={`max-w-[60px] `}>
          <img src="https://easi.its.utoronto.ca/wp-content/uploads/2019/12/1024px-Microsoft_Forms_2019-present.svg-e1576870389646.png" alt="logo" />
        </Link>
        <form className="px-[5px] py-[5px] bg-[#f0f4f9] flex items-center rounded-[30px]">
            <button className="w-[50px] h-[50px] cursor-pointer transition-all duration-200 hover:bg-[#d5d8dc] rounded-[50%]  flex items-center justify-center">
                <IoSearch className="text-[25px] "/>
            </button>
            <input type="text" className="w-full md:w-[230px] lg:w-[450px]  outline-none h-[40px]" placeholder="Search"/>
            <button className="w-[50px] h-[50px] cursor-pointer transition-all duration-200 hover:bg-[#d5d8dc] rounded-[50%]  flex items-center justify-center">
                <MdClear className="text-[25px]"/>
            </button>
        </form>
        <div className="flex gap-[10px] items-center">
          <div className="hidden md:flex">
            <LanguageChanger/>
          </div>
          {!token && <AuthComponent/>}
          {token && <div className="group hidden md:block relative">
            <div className="flex rounded-[50px] cursor-pointer items-center gap-[10px]">
              <div className="rounded-full bg-[#999] h-[30px] w-[30px] border-[1px] border-[#888]">
                <img src="https://openclipart.org/image/2000px/247319" alt="" />
              </div>
            </div>

            <div className="group-hover:flex right-[0px] hidden w-[120px] absolute  p-[5px] bg-[#fff] rounded-[5px] flex-col">
                <button onClick={() => navigate("/profile")} className="rounded-[7px] p-[5px] cursor-pointer hover:bg-[#461773] flex items-center gap-[7px] hover:text-[#fff] transition-all duration-200 mb-[5px]">
                  <MdEdit />
                  <p>Edit</p>
                </button>
                <button onClick={handleLogout} className="rounded-[7px] p-[5px] cursor-pointer hover:bg-[#461773] flex items-center gap-[7px]">
                  <IoIosLogOut className="text-[red]"/>
                  <p className="text-[red]">Log out</p>
                </button>
            </div>
          </div>}
          <HeaderSidebar />
        </div>
      </div>
    </header>
  )
}

export default Header