import axios from "axios"
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { FaTableList } from "react-icons/fa6";
import { FaTableCellsLarge } from "react-icons/fa6";
import { HiDotsVertical } from "react-icons/hi";
import { TbLivePhotoFilled } from "react-icons/tb";
import { Tooltip } from "antd";
import NoData from "../no-data/no-data";
import TemplatesCardsSskeleton from "../skeleton/templates-cards-skeleton";
import { useState } from "react";

const API = import.meta.env.VITE_API

function ResentTempletes() {
    const navigate = useNavigate()
    const [cardsView, setCardsView] = useState(false)
    
    const fetchLatestTempletes = async () => {
        const res = await axios.get(`${API}/api/templates`);
        return res.data
    };
    const { data: LatestTemplates, isLoading: loading} = useQuery({
        queryKey: ["latest-templates"],
        queryFn: fetchLatestTempletes,
    });
    console.log(LatestTemplates)

    function handleClick(id) {
        navigate(`/templates/${id}`)
    }

    function handleChangeButtonType(caseView) {
        setCardsView(caseView)
    }
  return (
    <section className="py-[30px] bg-[#fff] px-5 md:px-10 ">
        <div className="max-w-[1000px] mx-auto">
            <div className="flex justify-between items-center py-[20px]">
                <h5 className="text-[#000] text-[18px] font-[400]">Recent forms</h5>
                <div>
                    {!cardsView && <button onClick={() => handleChangeButtonType(true)} className="cursor-pointer"><FaTableList  className="text-[20px]"/></button>}
                    {cardsView && <button onClick={() => handleChangeButtonType(false)} className="cursor-pointer"><FaTableCellsLarge className="text-[20px]"/></button>}
                </div>
            </div>
            <div className="max-w-[1200px] mx-auto grid-cols-1 sm:grid-cols-3 md:grid-cols-5 grid gap-y-[30px] gap-x-[30px]">
                {LatestTemplates?.map(item => (
                    <div onClick={() => handleClick(item.id)} key={item.id} className="rounded-[5px] overflow-hidden w-[180px] border-[1px] border-[#999] hover:border-[#7248b9] transition-all duration-200 cursor-pointer">
                        <div className="w-full h-[150px]">
                            <img src="https://lagunatravelandtourism.com/wp-content/uploads/2025/03/IMG-Worlds-of-Adventure-dubai.jpg" alt="add button" className="w-full h-full object-cover"/>
                        </div>
                        <div className="flex items-center justify-between px-[5px]">
                            <div className="flex items-center">
                                {item.isPublished && <Tooltip title="published">
                                    <TbLivePhotoFilled className="text-[#2dee20]"/>
                                </Tooltip>}
                                <h4 className="px-[5px] py-[10px]">{item.title}</h4>
                            </div>
                            <button className="cursor-pointer"><HiDotsVertical /></button>
                        </div>
                    </div>
                ))}
                {!loading && Array.isArray(LatestTemplates) && !LatestTemplates.length && (
                    <div className="col-span-1 md:col-span-3 lg:col-span-5 ">
                        <NoData>No data</NoData>
                    </div>
                )}
                {loading && ( 
                    <div className="col-span-1 md:col-span-3 lg:col-span-5 ">
                        <TemplatesCardsSskeleton/>
                    </div>
                )}
            </div>
        </div>
    </section>
  )
}

export default ResentTempletes