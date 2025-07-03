import { Checkbox, Tooltip } from 'antd';
import axios from "axios";
import {  useState } from "react";
import moment from 'moment';
import { useQuery } from "@tanstack/react-query";
import HeaderToolbar from './toolbar';
import { useNavigate, useSearchParams } from 'react-router-dom';
import ModalCompopnent from './modal';
import UsersSkeleton from '../skeleton/users-skeleton';
import { useTranslation } from 'react-i18next';

const API = import.meta.env.VITE_API;

function UsersManagment() {
    const [selectAll, setSelectAll] = useState(false)
    const [selectedUsers, setSelectedUsers] = useState([])
    const [searchParams] = useSearchParams()
    const [isModalOpen, setIsModalOpen] = useState(false);
    const {t} = useTranslation()
    const [methodMyself, setMethodMyself] = useState('block')

    const token = localStorage.getItem('token')
    const navigate = useNavigate()
    
    const search = searchParams.get("search") || ""
    
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
            const allUsers = res.data    
            const filterd = allUsers.filter(userItem => {
                const nameMatch = userItem.name.toLowerCase().includes(search.toLowerCase());
                const emailMatch = userItem.email.toLowerCase().includes(search.toLowerCase());
                return nameMatch || emailMatch
            });
            return filterd
        } 
        catch(err) {console.log(err)}
    }
    const { data: AllUsers, isLoading: loading } = useQuery({
      queryKey: ["users", search],
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
                        <td className="text-[15px]  font-[700] min-w-[130px] py-[10px] dark:text-[#fff] ">{t('name')}</td>
                        <td className="flex gap-[7px] items-center min-w-[250px]  py-[10px]">
                            <span className="text-[15px]  font-[700] dark:text-[#fff]">{t('email')}</span>
                        </td>
                        <td className="text-[15px]  font-[700] min-w-[100px] py-[10px] dark:text-[#fff]">{t('status')}</td>
                        <td className="text-[15px]  font-[700] min-w-[100px] py-[10px] dark:text-[#fff]">{t('role')}</td>
                        <td className="text-[15px]  font-[700] min-w-[150px] py-[10px] dark:text-[#fff]">{t('createdAt')}</td>
                    </tr>
                </thead>
                <tbody>
                    {AllUsers && AllUsers?.map((item) => (
                        <tr key={item.id} className="border-b-[1px] border-[#c1c1c1] ">
                            <td className="w-[50px] text-center ">
                                <Checkbox onChange={(e) => handleSelectUser(item.id, e.target.checked)} checked={selectedUsers.includes(item.id)}></Checkbox>
                            </td>
                            <td className="py-[10px] ">
                                <p className={`text-[15px] font-[400]  ${!item.isBlocked ? 'text-[#000] dark:text-[#fff]' : 'text-[#999] line-through'}`}>{item.name}</p>
                            </td>
                            <td className={`text-[15px]  font-[400]   py-[10px] ${!item.isBlocked ? 'text-[#000] dark:text-[#fff]' : 'text-[#999]'}`}>{item.email}</td>
                            <td className={`text-[15px]  font-[400]   py-[10px] ${!item.isBlocked ? 'text-[#000] dark:text-[#fff]' : 'text-[#999]'}`}>active</td>
                            <td className={`text-[15px]  font-[400]   py-[10px] ${!item.isBlocked ? 'text-[#000] dark:text-[#fff]' : 'text-[#999]'}`}>{item.isAdmin ? "admin" : "user"}</td>
                            <td className={`text-[15px]  font-[400]  py-[10px] ${!item.isBlocked ? 'text-[#000] dark:text-[#fff]' : 'text-[#999]'} `}>
                                <Tooltip placement="bottom" className='cursor-pointer' title={moment(item.createdAt).format('MMMM D, YYYY HH:mm:ss')}  >
                                    {moment(item.createdAt).format('DD/MM/YYYY')}
                                </Tooltip>
                            </td>
                        </tr>
                    ))}
                    {!loading && Array.isArray(AllUsers) && !AllUsers.length &&  (
                        <tr>
                            <td colSpan={6} className="text-center">
                                <h2 className="mt-[20px] text-[17px] font-[600] dark:text-[#fff]">No users</h2>
                            </td>
                        </tr>
                    )}
                    {loading && (
                        <tr>
                            <td colSpan={6}>
                                <UsersSkeleton/>
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