import { useQuery } from "@tanstack/react-query";
import { Modal, Select, Switch, Tooltip } from "antd"
import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";
import { FaLock, FaUser, FaUserPlus } from "react-icons/fa6"
import { useParams } from "react-router-dom";
import { ClipLoader } from "react-spinners";

const API = import.meta.env.VITE_API

function ShareTemplate({setIsModalOpen, isModalOpen, setRefreshTemplate}) {
    const token = localStorage.getItem('token')
    const [accessType, setAccessType] = useState("public")
    const {id} = useParams()
    const {t} = useParams('')
    const [selectedItems, setSelectedItems] = useState([]);
    const [loadingSubmit, setLoadingSubmit] = useState(false);
    
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

    // get template details
    const fetchLatestTemplete = async () => {
        const res = await axios.get(`${API}/api/templates/${id}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        setAccessType(res?.data?.access)
        setSelectedItems(res?.data?.allowedUsers)
        return res.data
    };
    const { data: LatestTemplate} = useQuery({
        queryKey: ["latest-template"],
        queryFn: fetchLatestTemplete,
    });

    console.log(LatestTemplate)

    
    // change public or restricted
    const handleOk = async () => {
        setLoadingSubmit(true)
        try {
            await axios.patch(`${API}/api/templates/${id}/access`, { allowedUsers: selectedItems, access: accessType}, {
                headers: { Authorization: `Bearer ${token}`}
            })
            setIsModalOpen(false)
            setRefreshTemplate(prev => !prev)
            setLoadingSubmit(false)
        } catch (err) {
            toast.error(err.response?.data?.message || "Something went wrong");
        }
    };
  return (
    <div className="flex items-center gap-[20px]"> 
        <Tooltip title="share">
            <FaUserPlus onClick={showModal} className="text-[#555] dark:text-[#fff] text-[22px] cursor-pointer"/>
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
                    <p className="text-[17px] font-[600]">{t('anyoneWithTheLink')}</p>
                </div>
                <Switch checked={accessType == "public"} onChange={onChangeAccess} />
            </div>
            <hr className="border-[#999] my-[20px]"/>
            <div className="flex  flex-col justify-between gap-[5px]">
                {LatestTemplate?.allowedUsers?.map((item, i) => (
                    <div key={i} className="flex items-center gap-[10px] rounded-[5px] py-[4px] px-[10px] bg-[#e6e6e6] ">
                        <FaUser  className="text-[13px] text-[#777]"/>
                        <p className="text-[17px] font-[400]">{item}</p>
                    </div>
                ))}
            </div>
            {LatestTemplate?.allowedUsers.length > 0 && <hr className="border-[#999] my-[20px]"/>}
            <div className="flex items-center justify-between mt-[20px]">
                <div></div>
                <div className="flex items-center">
                    <button onClick={handleCancel} className="py-[5px] px-[15px] rounded-[20px] text-[#7248b9] cursor-pointer">{t('cancel')}</button>
                    {!loadingSubmit && <button onClick={handleOk} className={`py-[5px] px-[15px] rounded-[20px] bg-[#482585] cursor-pointer  text-[#fff] `}>{t('share')}</button>}
                    {loadingSubmit && <button  className="py-[5px] px-[15px] rounded-[20px] bg-[#482585] cursor-pointer  text-[#fff]  w-[65px] ">
                        <ClipLoader size={20} color="#fff" className="text-[#fff]" />
                    </button>}
                </div>
            </div>
        </Modal>
    </div>
  )
}

export default ShareTemplate