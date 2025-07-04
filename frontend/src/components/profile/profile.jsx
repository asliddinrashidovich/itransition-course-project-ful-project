import { useState } from "react"
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { Modal } from "antd";
import { FaRegUser } from "react-icons/fa6";
import { IoLogOutOutline } from "react-icons/io5";
import { SiGoogleforms } from "react-icons/si";
import { FaUsers } from "react-icons/fa";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";

const API = import.meta.env.VITE_API;

function ProfileSection() {
    const {pathname} = useLocation()
    const {t} = useTranslation()
    const activeFilter = pathname.split('/')[2] ? pathname.split('/')[2] : 'account-details'
    console.log(activeFilter)
    const navigate = useNavigate()
    const [isModalOpen, setIsModalOpen] = useState(false);
    const token = localStorage.getItem('token')

    const showModal = () => {
        setIsModalOpen(true)
    };
    const handleOk = () => {
        setIsModalOpen(false)
        localStorage.removeItem('user')
        localStorage.removeItem('token')
        navigate('/')
        window.location.reload();
    };
    const handleCancel = () => {
        setIsModalOpen(false);
    };
    function handleTab(path) {
        navigate(`${path == 'Account Details' ? '' : path.split('').map(item => item.replace(' ', '-')).join('').toLowerCase()}`)
    }

    // get my data
    const fetchMyData = async () => {
        const res = await axios.get(`${API}/api/users/me`, {
            headers: {Authorization: `Bearer ${token}`}
        });
        return res.data
    };
    const { data: myData} = useQuery({
        queryKey: ["my-data-2"],
        queryFn: fetchMyData,
    });
  return (
    <div className="max-w-[1400px] mx-auto flex pt-[100px] pb-[40px] gap-[30px] px-[20px]">
        <div className="md:block w-[10%]  md:w-[25%] p-[18px]">
            <h2 className="font-[700] text-[18px] leading-[16px] mb-[17px] hidden sm:flex text-nowrap dark:text-[#fff]">{t('myAccount')} <span className="font-[300] ml-[10px]">|</span> {myData?.isAdmin 
                ? <span className="text-[12px] ml-[10px] font-[500] text-[green]">{t('admin')}</span> 
                : <span className="text-[12px] ml-[10px] font-[500] text-[blue]">{t('user')}</span>}</h2>
            <div>
                <div onClick={() => handleTab('Account Details')} className={`flex gap-[11px] items-center border-l-[5px] h-[40px] pl-[10px] md:pl-[20px] cursor-pointer  mb-[15px] ${activeFilter == 'account-details' ? 'border-[#134e9b]' : 'border-transparent'}`}> 
                    <FaRegUser className="dark:text-[#fff] shrink-0 flex items-center min-w-[18px] min-h-[18px]  md:mb-0 mb-[10px]"/>
                    <p className={`font-[700] text-nowrap text-[15px] hidden sm:flex leading-[45px] ${activeFilter == 'account-details' ? 'text-[#134e9b]' : 'text-[#727272] dark:text-[#fff]'}`}>{t('accountDetails')}</p>
                </div>
                <div onClick={() => handleTab('All Templates')} className={`flex mb-[15px] gap-[11px] items-center border-l-[5px] pl-[10px] md:pl-[20px] cursor-pointer  ${activeFilter == 'all-templates' ? 'border-[#134e9b]' : 'border-transparent'}`}> 
                    <SiGoogleforms className="shrink-0 dark:text-[#fff] min-w-[18px] min-h-[18px]  md:mb-0 mb-[10px]"/>
                    <p className={`font-[700] text-[15px] hidden sm:flex leading-[45px] ${activeFilter == 'all-templates' ? 'text-[#134e9b]' : 'text-[#727272] dark:text-[#fff]'}`}>{t('templates')}</p>
                </div>
                {myData?.isAdmin && <div onClick={() => handleTab('All Users')} className={`flex gap-[11px] mb-[15px] items-center border-l-[5px] pl-[10px] md:pl-[20px] cursor-pointer ${activeFilter == 'all-users' ? 'border-[#134e9b]' : 'border-transparent'}`}> 
                    <FaUsers className="shrink-0 dark:text-[#fff] min-w-[18px] min-h-[18px]  md:mb-0 mb-[10px]"/>
                    <p className={`font-[700] text-[15px] hidden sm:flex leading-[45px] ${activeFilter == 'all-users' ? 'text-[#134e9b]' : 'text-[#727272] dark:text-[#fff]'}`}>{t('users')}</p>
                </div>}
            </div>
            <hr className="hidden sm:flex border-[0.5px] border-[#134e9b] my-[30px]"/>
            <button  onClick={showModal} className="flex gap-[11px] text-[#e04242] items-center pl-[15px] md:pl-[20px] cursor-pointer"> 
                <IoLogOutOutline />
                <p className="hidden sm:flex font-[700] text-[15px] text-inherit text-nowrap leading-[45px]">{t('logOut')}</p>
            </button>
            <Modal title="Logout" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
                <p className="text-[15px] font-[500]">❗Do you want to logout?</p>
            </Modal>
        </div>
        <div className="w-[90%] md:w-[75%]">
            <Outlet/>
        </div>
    </div>
  )
}

export default ProfileSection