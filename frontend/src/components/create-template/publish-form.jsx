import { Modal, Switch } from "antd"
import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";
import { useParams } from "react-router-dom";
import { LuSlidersHorizontal } from "react-icons/lu";
import { MdOutlineEditNote } from "react-icons/md";

const API = import.meta.env.VITE_API

function PublishForm({LatestTemplate}) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isModalOpenOptions, setIsModalOpenOptions] = useState(false);
    const {id} = useParams()
    const token = localStorage.getItem('token')

    // publish 
    const showModal = () => {
        setIsModalOpen(true);
    };
    const handleOk = async () => {
        setIsModalOpen(false)
        await axios.patch(`${API}/api/templates/${id}/publish`, {}, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }).then((res) => {
            toast.success(res.response?.data?.message || "Successfully Published");
        }).catch((err) => {
            toast.error(err.response?.data?.message || "Something went wrong");
        })
    };
    const handleCancel = () => {
        setIsModalOpen(false);
    };
    
    // Published details
    const showModalOptions = () => {
        setIsModalOpenOptions(true);
    };
    const handleOkOptions = async () => {
        setIsModalOpenOptions(false);
    };
    const handleCancelOptions = () => {
        setIsModalOpenOptions(false);
    };

    const onChangeAccess = checked => {
        console.log(`switch to ${checked}`);
    };
    
    function handleCopy(link) {
        navigator.clipboard.writeText(link).then(() => {
            toast.success('Link copied');
        })
        .catch(() => {
            toast.error('Error while copy');
        });
    }
    console.log(LatestTemplate)


  return (
    <div className="ml-auto">
        {!LatestTemplate?.isPublished && <button onClick={showModal} className="bg-[#7248b9] text-[#fff] px-[15px] cursor-pointer py-[5px] rounded-[6px]">
            Publish
        </button>}
        {LatestTemplate?.isPublished && <button onClick={showModalOptions} className="border-[#7248b9] border-[1px] text-[#7248b9] bg-[#fff] px-[15px] cursor-pointer py-[5px] rounded-[6px] flex items-center gap-[6px]">
            Published
            <LuSlidersHorizontal />
        </button>}
        <Modal
            title="Publish form"
            closable={{ 'aria-label': 'Custom Close Button' }}
            open={isModalOpen}
            onOk={handleOk}
            okText={"Publish"}
            onCancel={handleCancel}
        >
            <hr className="border-[#999] my-[20px]"/>
            <p>Do you want to publish this form?</p>
        </Modal>
        <Modal
            title="Published options"
            closable={{ 'aria-label': 'Custom Close Button' }}
            open={isModalOpenOptions}
            onOk={handleOkOptions}
            okText={"Save"}
            onCancel={handleCancelOptions}
        >
            <hr className="border-[#999] my-[20px]"/>
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-[10px]">
                    <MdOutlineEditNote  className="text-[30px] text-[#777]"/>
                    <p className="text-[17px] font-[600]">Accepting responses</p>
                </div>
                <Switch defaultChecked onChange={onChangeAccess} />
            </div>
            <hr className="border-[#999] my-[20px]"/>
            <div className="flex items-center justify-between">
                <a href={`${window.location.origin}/form/${id}`} target="_blank" className="text-[12px] text-[blue] cursor-pointer underline">{`${window.location.origin}/form/${id}`}</a>
                <button onClick={() => handleCopy(`${window.location.origin}/form/${id}`)} className="py-[3px]  px-[10px] border-[1px] border-[#888] rounded-[7px] cursor-pointer text-[blue]">Copy link</button>
            </div>
            <hr className="border-[#999] my-[20px]"/>
        </Modal>
    </div>
  )
}

export default PublishForm