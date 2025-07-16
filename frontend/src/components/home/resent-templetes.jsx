import axios from "axios"
import { useQuery } from "@tanstack/react-query";
import { useNavigate, useSearchParams } from "react-router-dom";
import { FaTableList } from "react-icons/fa6";
import { FaTableCellsLarge } from "react-icons/fa6";
import { TbLivePhotoFilled } from "react-icons/tb";
import { Tooltip } from "antd";
import NoData from "../no-data/no-data";
import TemplatesCardsSskeleton from "../skeleton/templates-cards-skeleton";
import { useState } from "react";
import { FormControl, MenuItem, Select } from "@mui/material"
import TemplatesTableView from "./templates-table-view";
import { useTranslation } from "react-i18next";

const API = import.meta.env.VITE_API

function ResentTempletes() {
    const [searchParams, setSearchParams] = useSearchParams()
    const navigate = useNavigate()
    const [authorValue, setAuthorValue] = useState('anyone');
    const {t} = useTranslation()
    const myData = JSON.parse(localStorage.getItem('user'))

    const cardsView = searchParams.get("template-view") || "card"
    const search = searchParams.get("search") || ""
    const token = localStorage.getItem('token')

    // // get my data
    // const fetchMyData = async () => {
    //     const res = await axios.get(`${API}/api/users/me`, {
    //         headers: {Authorization: `Bearer ${token}`}
    //     });
    //     return res.data
    // };
    // const { data: myData} = useQuery({
    //     queryKey: ["my-data-3"],
    //     queryFn: fetchMyData,
    // });

      // sort by sort
    const sortByCreators = searchParams.get('sort-creatort') || 'anyone'
    
    const updateSortBy = (sort) => {
        setAuthorValue(sort);
        searchParams.set('sort-creatort', sort)
        setSearchParams(searchParams)
    }

    console.log(myData)
    
    // get templates 
    const fetchLatestTempletes = async () => {
        const res = await axios.get(`${API}/api/templates`, {headers: {Authorization: `Bearer ${token}`}});
        const allItems = res?.data 
    
        const allTemplates = allItems.filter(templateItem => {
            const titleMatch = templateItem.title.toLowerCase().includes(search.toLowerCase());
            const authorMatch = templateItem.author.name.toLowerCase().includes(search.toLowerCase());
            const formTitleMatch = templateItem.formTitle.toLowerCase().includes(search.toLowerCase());
            const descriptionMatch = templateItem.description.toLowerCase().includes(search.toLowerCase());
            return titleMatch || authorMatch || formTitleMatch || descriptionMatch
        });

        if(sortByCreators == "anyone") {
            return allTemplates
        } else if(sortByCreators == "not-me") {
            const filtered = allTemplates.filter(temp => temp.author.id != myData?.id)
            return filtered
        } else {
            const filtered = allTemplates.filter(temp => temp.author.id == myData?.id)
            return filtered
        }
    };
    const { data: LatestTemplates, isLoading: loading} = useQuery({
        queryKey: ["latest-templates1", sortByCreators, cardsView, search],
        queryFn: fetchLatestTempletes,
        enabled: !!myData
    });
    console.log(LatestTemplates, loading)

    function handleClick(id) {
        navigate(`/templates/${id}`)
    }

    function handleChangeButtonType(caseView) {
        searchParams.set("template-view", caseView)
        setSearchParams(searchParams)
    }
  return (
    <section className="py-[30px] bg-[#fff] dark:bg-gray-800  px-[10px] sm:px-5 md:px-10 ">
        <div className="max-w-[1000px] mx-auto">
            <div className="flex justify-between items-center py-[20px] mb-[20px]">
                <h5 className="text-[#000] text-[15px] sm:text-[18px] font-[500] dark:text-[#fff] ">{t("resentForms")}</h5>
                <div className="flex items-center gap-[30px]">
                    {token &&  <div className="flex gap-[5px] items-center">
                        <h2 className="hidden md:flex dark:text-[#fff] text-nowrap">{t('sortBy')}:</h2>
                        <FormControl sx={{ marginLeft: 1, minWidth: 120}} className="w-[30px] sm:w-full">
                            <Select
                                value={authorValue}
                                onChange={(e) => updateSortBy(e.target.value)}
                                displayEmpty
                                className="dark:text-[#fff]"
                                inputProps={{ 'aria-label': 'Without label' }}
                            >
                                <MenuItem value={'anyone'}>{t('ownedByAnyone')}</MenuItem>
                                <MenuItem value={"me"}>{t('ownedByMe')}</MenuItem>
                                <MenuItem value={"not-me"}>{t('notOwnedByMe')}</MenuItem>
                            </Select>
                        </FormControl>
                    </div>}
                    {cardsView == "card" && <Tooltip title={t('tableView')}>
                        <button onClick={() => handleChangeButtonType("table")} className="cursor-pointer"><FaTableList  className="text-[20px] text-[#444] dark:text-[#fff] "/></button>
                    </Tooltip>}
                    {cardsView == "table" && <Tooltip title={t('cardView')}>
                        <button onClick={() => handleChangeButtonType("card")} className="cursor-pointer"><FaTableCellsLarge className="text-[20px] text-[#444] dark:text-[#fff] "/></button>
                    </Tooltip>}
                </div>
            </div>
            {cardsView == "card" && <div className="max-w-[1200px] mx-auto grid-cols-2 md:grid-cols-4 lg:grid-cols-5 grid gap-y-[30px] gap-x-[30px]">
                {LatestTemplates?.map(item => (
                    <div onClick={() => handleClick(item.id)} key={item.id} className="rounded-[5px] overflow-hidden border-[1px] border-[#999] hover:border-[#7248b9] transition-all duration-200 cursor-pointer">
                        <div className="w-full h-[75px] sm:h-[150px]">
                            <img src="https://images.ctfassets.net/lzny33ho1g45/4ODoWVyzgicvbcb6J9ZZZ5/c0333ef44af8588fee18c1e6ed403fc7/Group_12549.jpg?w=1520&fm=jpg&q=31&fit=thumb&h=760" alt="add button" className="w-full h-full object-cover"/>
                        </div>
                        <div className="flex items-center justify-between px-[5px]">
                            <div className="flex items-center">
                                {item.isPublished && <Tooltip title="published">
                                    <TbLivePhotoFilled className="text-[#2dee20] shrink-0"/>
                                </Tooltip>}
                                <h4 className="px-[5px] my-[5px] font-[600] text-[12px] md:text-[15px] line-clamp-1 dark:text-[#fff] ">{item.title}</h4>
                            </div>
                        </div>
                        <div className="mx-[10px] mb-[10px]">
                            <p className="text-[10px] md:text-[14px] dark:text-[#fff] ">Creator: <span className="italic">{item?.author?.name}</span></p>
                        </div>
                    </div>
                ))}
                {!loading && Array.isArray(LatestTemplates) && !LatestTemplates.length && (
                    <div className="col-span-1 md:col-span-3 lg:col-span-5 ">
                        <NoData>No templates</NoData>
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