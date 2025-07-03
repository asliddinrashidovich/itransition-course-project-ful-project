import { FaLock, FaLockOpen } from "react-icons/fa"
import { FaRegTrashCan } from "react-icons/fa6"
import { useMutation, useQueryClient } from "@tanstack/react-query";
import PropTypes from "prop-types";
import axios from "axios";
import { MdOutlineAdminPanelSettings, MdRemoveModerator } from "react-icons/md";
import { useTranslation } from "react-i18next";

HeaderToolbar.propTypes  = {
  selectedUsers: PropTypes.array.isRequired,
  showModal: PropTypes.func.isRequired,
}

const API = import.meta.env.VITE_API;

function HeaderToolbar({selectedUsers, showModal}) {

    const token = localStorage.getItem('token')
    const {t} = useTranslation()
    const user = JSON.parse(localStorage.getItem('user'))
    const queryClient = useQueryClient();

    // ==================== BLOCK USERS =====================
   const blockUsers = useMutation({
        mutationFn: async () => {
            if(selectedUsers.includes(user.id)) showModal('block')
            else {await axios.patch(`${API}/api/users/status`, { userIds: selectedUsers, status: 'block'}, {
                headers: {Authorization: `Bearer ${token}`}
            })}
        },
        onSuccess: () => {queryClient.invalidateQueries(["users"])}
    });

    // ==================== UNBLOCK USERS =====================
   const unBlockUsers = useMutation({
        mutationFn: async () => {
            await axios.patch(`${API}/api/users/status`, {userIds: selectedUsers, status: 'unblock'}, {
                headers: {Authorization: `Bearer ${token}`}
            });
        },
        onSuccess: () => {queryClient.invalidateQueries(["users"])}
    });

    // ==================== DELETE USERS =====================
    const deleteUsers = useMutation({
        mutationFn: async () => {
            if(selectedUsers.includes(user.id)) showModal('delete')
            else {
            await axios.delete(`${API}/api/users`, {
                data: { userIds: selectedUsers },
                headers: { Authorization: `Bearer ${token}` },
            })}
        },
        onSuccess: () => {queryClient.invalidateQueries(["users"])}
    });

    // ==================== ADD TO ADMINS =====================
    const addToAdmins = useMutation({
        mutationFn: async () => {
            if (selectedUsers.includes(user.id)) {showModal('admin')} 
            else {await axios.patch(`${API}/api/users/role`, {userIds: selectedUsers, role: 'admin',}, {
                headers: {Authorization: `Bearer ${token}`},
            })}
        },
        onSuccess: () => {queryClient.invalidateQueries(["users"])},
    });

    // ==================== REMOVE FROM ADMINS =====================
    const removeFromAdmins = useMutation({
        mutationFn: async () => {
            if (selectedUsers.includes(user.id)) {showModal('user')} 
            else {await axios.patch(`${API}/api/users/role`, {userIds: selectedUsers, role: 'user',}, {
                headers: {Authorization: `Bearer ${token}`},
            })}
        },
        onSuccess: () => {queryClient.invalidateQueries(["users"])},
    });

  return (
    <div className="flex flex-col md:flex-row gap-[20px] justify-between items-center mb-[30px] p-[15px]">
        <div className="flex gap-[7px] ">
            <button onClick={() => blockUsers.mutate()} className="active:opacity-[80%] active:bg-[#ffffffd0] flex items-center gap-[10px] border-[2px] border-[#461773]    dark:border-[#fff] cursor-pointer rounded-[6px] py-[5px] px-[10px]"> 
                <FaLock className="text-[#461773] dark:text-[#fff]"/>
                <span className="text-[#461773] dark:text-[#fff] text-[15px] font-[600]">{t('block')}</span>
            </button>
            <button onClick={() => unBlockUsers.mutate()} className="active:opacity-[80%] active:bg-[#ffffffd0] flex items-center gap-[10px] border-[2px] border-[#461773] dark:border-[#fff]  cursor-pointer rounded-[6px] px-[10px]"> 
                <FaLockOpen className="text-[#461773] dark:text-[#fff]"/>
                <span className="text-[#461773] dark:text-[#fff] text-[15px] font-[600]">{t('unBlock')}</span>
            </button>
            <button onClick={() => deleteUsers.mutate()} className="active:opacity-[80%] active:bg-[#ffffffd0] flex items-center gap-[10px] border-[2px] border-[#ba5364] cursor-pointer rounded-[6px] px-[10px]"> 
                <FaRegTrashCan className="text-[#ba5364]"/>
                <span className="text-[#ba5364] text-[15px] font-[600]">{t('delete')}</span>
            </button>
            <button onClick={() => addToAdmins.mutate()} className="active:opacity-[80%] active:bg-[#ffffffd0] flex items-center gap-[10px] border-[2px] border-[#461773] dark:border-[#fff]  cursor-pointer rounded-[6px] px-[10px]"> 
                <MdOutlineAdminPanelSettings className="text-[#461773] dark:text-[#fff]"/>
                <span className="text-[#461773] dark:text-[#fff] text-[15px] font-[600]">{t('addToAdmins')}</span>
            </button>
            <button onClick={() => removeFromAdmins.mutate()} className="active:opacity-[80%] active:bg-[#ffffffd0] flex items-center gap-[10px] border-[2px] border-[#461773] dark:border-[#fff]  cursor-pointer rounded-[6px] px-[10px]"> 
                <MdRemoveModerator className="text-[#461773] dark:text-[#fff]"/>
                <span className="text-[#461773] dark:text-[#fff] text-[15px] font-[600]">{t('removeFromAdmins')}</span>
            </button>
        </div>
    </div>
  )
}

export default HeaderToolbar