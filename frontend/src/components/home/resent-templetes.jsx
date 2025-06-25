import axios from "axios"
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

const API = import.meta.env.VITE_API

function ResentTempletes() {
    const navigate = useNavigate()
    
    const fetchLatestTempletes = async () => {
        const res = await axios.get(`${API}/api/templates`);
        return res.data
    };
    const { data: LatestTemplates} = useQuery({
        queryKey: ["latest-templates"],
        queryFn: fetchLatestTempletes,
    });
    console.log(LatestTemplates)

    function handleClick(id) {
        navigate(`/templates/${id}`)
    }
  return (
    <section className="py-[30px] bg-[#fff] px-5 md:px-10 ">
        <div className="max-w-[1000px] mx-auto">
            <div className="flex justify-between items-center py-[20px]">
                <h5 className="text-[#000] text-[18px] font-[400]">Recent forms</h5>
            </div>
            <div className="flex gap-[20px] flex-wrap">
                {LatestTemplates?.map(item => (
                    <div onClick={() => handleClick(item.id)} key={item.id} className="rounded-[5px] overflow-hidden w-[200px] border-[1px] border-[#999] hover:border-[#7248b9] transition-all duration-200 cursor-pointer">
                        <div className="w-full h-[150px]">
                            <img src="https://lagunatravelandtourism.com/wp-content/uploads/2025/03/IMG-Worlds-of-Adventure-dubai.jpg" alt="add button" className="w-full h-full object-cover"/>
                        </div>
                        <h4 className="px-[5px] py-[10px]">{item.title}</h4>
                    </div>
                ))}
            </div>
        </div>
    </section>
  )
}

export default ResentTempletes