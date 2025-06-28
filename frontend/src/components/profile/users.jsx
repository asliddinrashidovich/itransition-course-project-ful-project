import { Checkbox, Tooltip } from 'antd';
import axios from "axios";
import {  useState } from "react";
import moment from 'moment';
import { useQuery } from "@tanstack/react-query";
import HeaderToolbar from './toolbar';
import { useNavigate } from 'react-router-dom';
import ModalCompopnent from './modal';

const API = import.meta.env.VITE_API;

function UsersManagment() {
    const [selectAll, setSelectAll] = useState(false)
    const [selectedUsers, setSelectedUsers] = useState([])
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [methodMyself, setMethodMyself] = useState('block')

    const token = localStorage.getItem('token')
    const navigate = useNavigate()
    
    // Modal to block or delete myself
    const showModal = (method) => {
        setIsModalOpen(true);
        setMethodMyself(method)
    };

    // select all users
    const handleSelectAll = (e) => {
        const isChecked = e.target.checked
        setSelectAll(isChecked)
        if (isChecked) {
            const allUserIds = AllUsers.map(user => user.id)
            setSelectedUsers(allUserIds)
        } else  setSelectedUsers([])
    }

    // Selected users
    const handleSelectUser = (userId, isChecked) => {
        if (isChecked) setSelectedUsers([...selectedUsers, userId])
        else  setSelectedUsers(selectedUsers.filter(id => id !== userId)) 
    }

    //===================== get All users =========================
    async function getAllUsers() {
        try {
            const res = await axios.get(`${API}/api/users/all`, {
                headers: {Authorization: `Bearer ${token}`}
            });
            return res.data
        } 
        catch(err) {console.log(err)}
    }
    const { data: AllUsers } = useQuery({
      queryKey: ["users-all"],
      queryFn: getAllUsers,
    });

    function handleLogout() {
        localStorage.clear()
        navigate('/')
    }
    
  return (
    <div className="px-[20px]">
        <HeaderToolbar showModal={showModal} selectedUsers={selectedUsers}/>
        <div className='overflow-x-auto min-h-[62vh]'>
            <table className="w-full">
                <thead>
                    <tr className="border-b-[1px] border-[#c1c1c1] ">
                        <td className="w-[50px] min-w-[49px] text-center ">
                            <Checkbox  onChange={handleSelectAll} checked={selectAll} value={true}></Checkbox>
                        </td>
                        <td className="text-[15px]  font-[700] min-w-[130px] py-[10px]">Name</td>
                        <td className="flex gap-[7px] items-center min-w-[250px]  py-[10px]">
                            <span className="text-[15px]  font-[700]">Email</span>
                        </td>
                        <td className="text-[15px]  font-[700] min-w-[100px] py-[10px]">Status</td>
                        <td className="text-[15px]  font-[700] min-w-[100px] py-[10px]">Role</td>
                        <td className="text-[15px]  font-[700] min-w-[150px] py-[10px]">Created at</td>
                    </tr>
                </thead>
                <tbody>
                    {AllUsers && AllUsers?.map((item) => (
                        <tr key={item.id} className="border-b-[1px] border-[#c1c1c1] ">
                            <td className="w-[50px] text-center ">
                                <Checkbox onChange={(e) => handleSelectUser(item.id, e.target.checked)} checked={selectedUsers.includes(item.id)}></Checkbox>
                            </td>
                            <td className="py-[10px] ">
                                <p className={`text-[15px] font-[400]  ${item.status == 'active' ? 'text-[#000]' : 'text-[#999] line-through'}`}>{item.name}</p>
                            </td>
                            <td className={`text-[15px]  font-[400]   py-[10px] ${item.status == 'active' ? 'text-[#000]' : 'text-[#999]'}`}>{item.email}</td>
                            <td className={`text-[15px]  font-[400]   py-[10px] ${item.status == 'active' ? 'text-[#000]' : 'text-[#999]'}`}>active</td>
                            <td className={`text-[15px]  font-[400]   py-[10px] ${item.status == 'active' ? 'text-[#000]' : 'text-[#999]'}`}>{item.isAdmin ? "admin" : "user"}</td>
                            <td className={`text-[15px]  font-[400]  py-[10px] ${item.status == 'active' ? 'text-[#000]' : 'text-[#999]'} `}>
                                <Tooltip placement="bottom" className='cursor-pointer' title={moment(item.createdAt).format('MMMM D, YYYY HH:mm:ss')}  >
                                    {moment(item.createdAt).format('DD/MM/YYYY')}
                                </Tooltip>
                            </td>
                        </tr>
                    ))}
                    {!AllUsers?.length && (
                        <tr>
                            <td colSpan={4} className="text-center">
                                <img src="/no_data.svg" alt="not found" className="mx-auto max-w-[310px] mt-[20px]"/>
                                <h2 className="mt-[20px] text-[17px] font-[600]">No AllUsers</h2>
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
        <ModalCompopnent isModalOpen={isModalOpen} handleLogout={handleLogout} selectedUsers={selectedUsers} setIsModalOpen={setIsModalOpen} methodMyself={methodMyself}/>
    </div>
  )
}

export default UsersManagment