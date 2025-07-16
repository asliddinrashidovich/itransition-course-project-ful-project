import { useQuery } from "@tanstack/react-query";
import { Modal } from "antd";
import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";
import { useParams } from "react-router-dom";

const API = import.meta.env.VITE_API

function PowerAutomate() {
    const {id} = useParams()
    const token = localStorage.getItem('token')
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [summary, setSummary] = useState("")
    const [priority, setPriority] = useState("high")

    const showModal = () => {
      setIsModalOpen(true);
    };
    const handleCancel = () => {
      setIsModalOpen(false);
    };

    const fetchTemplateDetails = async () => {
        const res = await axios.get(`${API}/api/templates/${id}`, {headers: {Authorization: `Bearer ${token}`}});
        return res.data
    };
    const { data: templateDetails} = useQuery({
        queryKey: ["template-details"],
        queryFn: fetchTemplateDetails,
    });

    const handleOk = async (e) => {
      e.preventDefault()
      await axios.post(`${API}/api/templates/support-ticket`, {summary, priority, template: templateDetails?.formTitle, link: window.location.href}, {headers: { Authorization: `Bearer ${token}`}}).then(() => {
        toast.success('success added')
        setIsModalOpen(false);
      }).catch((err) => {
        toast.error(err.response?.data?.message || "Something went wrong");
      })
    };
  return (
    <>
      <button onClick={showModal} className="underline">Help?</button>
      <Modal
        title="Help"
        closable={{ 'aria-label': 'Custom Close Button' }}
        open={isModalOpen}
        onOk={handleOk}
        okText={"Submit"}
        onCancel={handleCancel}
      >
        <hr />
        <form>
          <label htmlFor="summary">
            <span className="text-[16px] text-[#888] font-[600]">Summary</span>
            <textarea required value={summary} onChange={(e) => setSummary(e.target.value)} name="summary" id="summary" className="w-full border-[1px] mt-[10px] p-[6px]"></textarea>
          </label>
          <label htmlFor="priority">
            <span className="text-[16px] text-[#888] font-[600]">Priority</span>
            <select value={priority} onChange={(e) => setPriority(e.target.value)} className="ml-[40px] border-[2px] rounded-[5px] cursor-pointer" name="priority" id="priority">
              <option value="value">high</option>
              <option value="value">Average</option>
              <option value="value">Low</option>
            </select>
          </label>
        </form>
      </Modal>
    </>
  )
}

export default PowerAutomate