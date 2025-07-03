import { useEffect } from "react";
import * as AOS from "aos";
import "aos/dist/aos.css";
import { MdOutlineKeyboardArrowDown } from "react-icons/md";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

function NonAuthHero() {
  const {t} = useTranslation()
  useEffect(() => {
    AOS.init({
      duration: 1000,  
      once: true,  
    });
  }, []);
  

  return (
    <section className="nonauth_about overflow-hidden relative justify-between flex items-center h-[70vh]">
        <div className="px-[10px] md:px-[50px] relative flex flex-col justify-start items-center w-full z-10">
            <h2 data-aos="fade-right" className="text-[#fff] text-[30px] sm:text-[50px] md:text-[75px] max-w-[1200px] mx-auto font-[700] text-center leading-[110%] mt-[100px] mb-[50px]">{t('heroText')}</h2>
            <div className="flex items-center gap-[15px]">
              <Link to={'/login'} data-aos="fade-left" className="py-[10px] md:py-[15px] px-[25px] md:px-[40px] rounded-[30px] bg-transparent border-[2px] text-[#fff] botder-[#fff] text-[20px] mb-[50px] cursor-pointer">{t('Login')}</Link>
              <Link to={'/register'} data-aos="fade-left" className="py-[10px] md:py-[15px] px-[25px] md:px-[40px] rounded-[30px] bg-[#451774] text-[#fff] text-[20px] mb-[50px] cursor-pointer">{t('Register')}</Link>
            </div>
        </div>
    </section>
  )
}

export default NonAuthHero