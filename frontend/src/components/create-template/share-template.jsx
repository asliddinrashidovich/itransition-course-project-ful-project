import { useQuery } from "@tanstack/react-query";
import { Modal, Select, Switch, Tooltip } from "antd"
import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";
import { FaLock, FaUserPlus } from "react-icons/fa6"
import { IoLinkOutline } from "react-icons/io5"
import { useParams } from "react-router-dom";

const API = import.meta.env.VITE_API

function ShareTemplate({setIsModalOpen, isModalOpen}) {
    const token = localStorage.getItem('token')
    const [accessType, setAccessType] = useState("public")
    const {id} = useParams()
    const [selectedItems, setSelectedItems] = useState([]);
    
    const showModal = () => {
        setIsModalOpen(true);
    };
    
    const onChangeAccess = checked => {
        console.log(`switch to ${checked}`);
        if(checked) setAccessType("public")
        else setAccessType("restricted")
    };

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
    const handleCancel = () => {
        setIsModalOpen(false);
    };
    const filteredOptions = AllUsers?.filter(o => !selectedItems.includes(o.name));

    
    // change public or restricted
    const handleOk = async () => {
        try {
            await axios.patch(`${API}/api/templates/${id}/access`, { allowedUsers: selectedItems, access: accessType}, {
                headers: { Authorization: `Bearer ${token}`}
            })
            setIsModalOpen(false)
        } catch (err) {
            toast.error(err.response?.data?.message || "Something went wrong");
        }
    };
  return (
    <div className="flex items-center gap-[20px]"> 
        <Tooltip title="copy link">
            <IoLinkOutline className="text-[#555] text-[22px] cursor-pointer"/>
        </Tooltip>
        <Tooltip title="share">
            <FaUserPlus onClick={showModal} className="text-[#555] text-[22px] cursor-pointer"/>
        </Tooltip>
        <Modal
            title="Share Template"
            closable={{ 'aria-label': 'Custom Close Button' }}
            open={isModalOpen}
            onOk={handleOk}
            okText={"share"}
            footer={null}
            onCancel={handleCancel}
        >
            <Select
                mode="multiple"
                placeholder="Select users"
                value={selectedItems}
                onChange={setSelectedItems}
                style={{ width: '100%' }}
                options={filteredOptions?.map((item) => ({
                    value: item.email,
                    label: item.name,
                }))}
            />
            <hr className="border-[#999] my-[20px]"/>
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-[10px]">
                    <FaLock  className="text-[15px] text-[#777]"/>
                    <p className="text-[17px] font-[600]">Anyone with the link</p>
                </div>
                <Switch defaultChecked onChange={onChangeAccess} />
            </div>
            <hr className="border-[#999] my-[20px]"/>
            <p className="mt-[20px]">Only users you select can fill out this form.</p>
            <div className="flex items-center justify-between mt-[20px]">
                <div></div>
                <div className="flex items-center">
                    <button onClick={handleCancel} className="py-[5px] px-[15px] rounded-[20px] text-[#7248b9] cursor-pointer">Cancel</button>
                    <button disabled={selectedItems?.length == 0} onClick={handleOk} className={` py-[5px] px-[15px] rounded-[20px] ${selectedItems?.length == 0 ? "bg-[#a076e7] cursor-not-allowed" : "bg-[#482585] cursor-pointer"}  text-[#fff] `}>Share</button>
                </div>
            </div>
        </Modal>
    </div>
  )
}

export default ShareTemplate