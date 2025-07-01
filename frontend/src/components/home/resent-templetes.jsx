import axios from "axios"
import { useQuery } from "@tanstack/react-query";
import { useNavigate, useSearchParams } from "react-router-dom";
import { FaTableList } from "react-icons/fa6";
import { FaTableCellsLarge } from "react-icons/fa6";
import { HiDotsVertical } from "react-icons/hi";
import { TbLivePhotoFilled } from "react-icons/tb";
import { Tooltip } from "antd";
import NoData from "../no-data/no-data";
import TemplatesCardsSskeleton from "../skeleton/templates-cards-skeleton";
import { useState } from "react";
import { FormControl, MenuItem, Select } from "@mui/material"
import TemplatesTableView from "./templates-table-view";

const API = import.meta.env.VITE_API

function ResentTempletes() {
    const [searchParams, setSearchParams] = useSearchParams()
    const navigate = useNavigate()
    const [authorValue, setAuthorValue] = useState('anyone');
    const cardsView = searchParams.get("template-view") || "card"
    const token = localStorage.getItem('token')

    // get my data
    const fetchMyData = async () => {
        const res = await axios.get(`${API}/api/users/me`, {
            headers: {Authorization: `Bearer ${token}`}
        });
        return res.data
    };
    const { data: myData} = useQuery({
        queryKey: ["my-data-3"],
        queryFn: fetchMyData,
    });

      // sort by sort
    const sortByCreators  = searchParams.get('sort-creatort') || 'anyone'
    
    const updateSortBy = (sort) => {
        setAuthorValue(sort);
        searchParams.set('sort-creatort', sort)
        setSearchParams(searchParams)
    }

    console.log(myData)
    
    // get templates 
    const fetchLatestTempletes = async () => {
        const res = await axios.get(`${API}/api/templates`);
        const allTemplates = res.data
        if(sortByCreators == "anyone" && myData?.isAdmin) return allTemplates
        else if(sortByCreators == "not-me" && myData?.isAdmin) {
            const filtered = allTemplates.filter(temp => temp.author.id != myData.id)
            return filtered
        } else {
            const filtered = allTemplates.filter(temp => temp.author.id == myData.id)
            return filtered
        }
    };
    const { data: LatestTemplates, isLoading: loading} = useQuery({
        queryKey: ["latest-templates", sortByCreators, cardsView],
        queryFn: fetchLatestTempletes,
    });
    console.log(LatestTemplates)

    function handleClick(id) {
        navigate(`/templates/${id}`)
    }

    function handleChangeButtonType(caseView) {
        searchParams.set("template-view", caseView)
        setSearchParams(searchParams)
    }
  return (
    <section className="py-[30px] bg-[#fff] px-5 md:px-10 ">
        <div className="max-w-[1000px] mx-auto">
            <div className="flex justify-between items-center py-[20px] mb-[20px]">
                <h5 className="text-[#000] text-[18px] font-[400]">Recent forms</h5>
                <div className="flex items-center gap-[30px]">
                    {myData?.isAdmin &&  <div className="lg:flex gap-[5px] hidden items-center">
                        <h2>Sort by:</h2>
                        <FormControl sx={{ marginLeft: 1, minWidth: 120,  }}>
                            <Select
                                value={authorValue}
                                onChange={(e) => updateSortBy(e.target.value)}
                                displayEmpty
                                inputProps={{ 'aria-label': 'Without label' }}
                            >
                                <MenuItem value={'anyone'}>Owned by anyone</MenuItem>
                                <MenuItem value={"me"}>Owned by me</MenuItem>
                                <MenuItem value={"not-me"}>Not owned by me</MenuItem>
                            </Select>
                        </FormControl>
                    </div>}
                    {cardsView == "card" && <Tooltip title="Table view">
                        <button onClick={() => handleChangeButtonType("table")} className="cursor-pointer"><FaTableList  className="text-[20px] text-[#444]"/></button>
                    </Tooltip>}
                    {cardsView == "table" && <Tooltip title="Card view">
                        <button onClick={() => handleChangeButtonType("card")} className="cursor-pointer"><FaTableCellsLarge className="text-[20px] text-[#444]"/></button>
                    </Tooltip>}
                </div>
            </div>
            {cardsView == "card" && <div className="max-w-[1200px] mx-auto grid-cols-1 sm:grid-cols-3 md:grid-cols-5 grid gap-y-[30px] gap-x-[30px]">
                {LatestTemplates?.map(item => (
                    <div onClick={() => handleClick(item.id)} key={item.id} className="rounded-[5px] overflow-hidden w-[180px] border-[1px] border-[#999] hover:border-[#7248b9] transition-all duration-200 cursor-pointer">
                        <div className="w-full h-[150px]">
                            <img src="https://lagunatravelandtourism.com/wp-content/uploads/2025/03/IMG-Worlds-of-Adventure-dubai.jpg" alt="add button" className="w-full h-full object-cover"/>
                        </div>
                        <div className="flex items-center justify-between px-[5px]">
                            <div className="flex items-center">
                                {item.isPublished && <Tooltip title="published">
                                    <TbLivePhotoFilled className="text-[#2dee20] shrink-0"/>
                                </Tooltip>}
                                <h4 className="px-[5px] my-[5px] font-[600] line-clamp-1">{item.title}</h4>
                            </div>
                            <button className="cursor-pointer"><HiDotsVertical /></button>
                        </div>
                        <div className="mx-[10px] mb-[10px]">
                            <p className="text-[14px]">Creator: <span className="italic">{item.author.name}</span></p>
                        </div>
                    </div>
                ))}
                {!loading && Array.isArray(LatestTemplates) && !LatestTemplates.length && (
                    <div className="col-span-1 md:col-span-3 lg:col-span-5 ">
                        <NoData>You have not templates</NoData>
                    </div>
                )}
                {loading && ( 
                    <div className="col-span-1 md:col-span-3 lg:col-span-5 ">
                        <TemplatesCardsSskeleton/>
                    </div>
                )}
            </div>}
            {cardsView == "table" && <TemplatesTableView loading={loading} LatestTemplates={LatestTemplates}/>}
        </div>
    </section>
  )
}

export default ResentTempletes