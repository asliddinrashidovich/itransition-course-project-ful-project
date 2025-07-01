import { useState } from "react"
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { Modal } from "antd";
import { FaRegUser } from "react-icons/fa6";
import { IoLogOutOutline } from "react-icons/io5";
import { SiGoogleforms } from "react-icons/si";
import { FaUsers } from "react-icons/fa";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";

const API = import.meta.env.VITE_API;

function ProfileSection() {
    const {pathname} = useLocation()
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
        <div className="md:block hidden w-[20%] p-[18px]">
            <h2 className="font-[700] text-[18px] leading-[16px] mb-[17px]">My Account <span className="font-[300] ml-[10px]">|</span> {myData?.isAdmin 
                ? <span className="text-[12px] ml-[10px] font-[500] text-[green]">Admin</span> 
                : <span className="text-[12px] ml-[10px] font-[500] text-[blue]">User</span>}</h2>
            <div>
                <div onClick={() => handleTab('Account Details')} className={`flex gap-[11px] items-center border-l-[5px] pl-[20px] cursor-pointer  ${activeFilter == 'account-details' ? 'border-[#134e9b]' : 'border-[#fff]'}`}> 
                    <FaRegUser />
                    <p className={`font-[700] text-[15px] leading-[45px] ${activeFilter == 'account-details' ? 'text-[#134e9b]' : 'text-[#727272]'}`}>Account Details</p>
                </div>
                <div onClick={() => handleTab('All Templates')} className={`flex gap-[11px] items-center border-l-[5px] pl-[20px] cursor-pointer ${activeFilter == 'all-templates' ? 'border-[#134e9b]' : 'border-[#fff]'}`}> 
                    <SiGoogleforms />
                    <p className={`font-[700] text-[15px] leading-[45px] ${activeFilter == 'all-templates' ? 'text-[#134e9b]' : 'text-[#727272]'}`}>Templates</p>
                </div>
                {myData?.isAdmin && <div onClick={() => handleTab('All Users')} className={`flex gap-[11px] items-center border-l-[5px] pl-[20px] cursor-pointer ${activeFilter == 'all-users' ? 'border-[#134e9b]' : 'border-[#fff]'}`}> 
                    <FaUsers />
                    <p className={`font-[700] text-[15px] leading-[45px] ${activeFilter == 'all-users' ? 'text-[#134e9b]' : 'text-[#727272]'}`}>Users</p>
                </div>}
            </div>
            <hr className="border-[0.5px] border-[#134e9b] my-[30px]"/>
            <button  onClick={showModal} className="flex gap-[11px] text-[#e04242] items-center  pl-[20px] cursor-pointer"> 
                <IoLogOutOutline />
                <p className="font-[700] text-[15px] text-inherit leading-[45px]">Logout</p>
            </button>
            <Modal title="Logout" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
                <p className="text-[15px] font-[500]">❗Do you want to logout?</p>
            </Modal>
        </div>
        <div className="w-full md:w-[75%]">
            <Outlet/>
        </div>
    </div>
  )
}

export default ProfileSection