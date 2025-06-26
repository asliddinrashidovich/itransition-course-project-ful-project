import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useParams } from "react-router-dom";

const API = import.meta.env.VITE_API

function AnswersPage() {
    const {id} = useParams()
    const token = localStorage.getItem('token')

    // get template answers
    const fetchAnswersTemplete = async () => {
        const res = await axios.get(`${API}/api/answers/template/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return res.data
    };
    const { data: TemplateAnswers} = useQuery({
        queryKey: ["answers-template"],
        queryFn: fetchAnswersTemplete,
    });

    console.log(TemplateAnswers)
  return (
    <div className="max-w-[800px] mx-auto mt-[70px] flex flex-col gap-[20px]">
        <div className="w-full bg-[#fff]  rounded-[10px] py-[20px] px-[20px]">
            <h2 className="text-[35px] font-[600] py-[10px]">0 responses</h2>
        </div>
        <div className="w-full bg-[#fff] border-l-[7px] border-[#0048ff] rounded-[10px] py-[30px] px-[20px]">
            <h2 className="text-[18px] font-[600] py-[10px] border-b-[1px] w-full border-[#999]">Question</h2>
            <p className="pt-[20px] text-[#999] pb-[10px] border-b-[1px] w-full border-[#999]">Form description</p>
        </div>

    </div>
  )
}

export default AnswersPage