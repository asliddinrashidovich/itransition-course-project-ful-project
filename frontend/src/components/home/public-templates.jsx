import axios from "axios"
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import { FaTableList } from "react-icons/fa6";
import { FaTableCellsLarge } from "react-icons/fa6";
import { TbLivePhotoFilled } from "react-icons/tb";
import { Tooltip } from "antd";
import NoData from "../no-data/no-data";
import TemplatesCardsSskeleton from "../skeleton/templates-cards-skeleton";
import TemplatesTableView from "./templates-table-view";
import toast from "react-hot-toast";

const API = import.meta.env.VITE_API

function PublicTemplates() {
    const [searchParams, setSearchParams] = useSearchParams()

    const cardsView = searchParams.get("template-view") || "card"
    const search = searchParams.get("search") || ""

    // get templates 
    const fetchLatestTempletes = async () => {
        const res = await axios.get(`${API}/api/templates/public`);
        const allItems = res.data    
        const allTemplates = allItems.filter(templateItem => {
            const titleMatch = templateItem.title.toLowerCase().includes(search.toLowerCase());
            const authorMatch = templateItem.author.name.toLowerCase().includes(search.toLowerCase());
            const formTitleMatch = templateItem.formTitle.toLowerCase().includes(search.toLowerCase());
            const descriptionMatch = templateItem.description.toLowerCase().includes(search.toLowerCase());
            return titleMatch || authorMatch || formTitleMatch || descriptionMatch
        });
        return allTemplates
    };
    const { data: LatestTemplates, isLoading: loading} = useQuery({
        queryKey: ["latest-templates", cardsView, search],
        queryFn: fetchLatestTempletes,
    });

    function handleClick() {
        toast.error("PLease Login,")
    }

    function handleChangeButtonType(caseView) {
        searchParams.set("template-view", caseView)
        setSearchParams(searchParams)
    }
  return (
    <section className="py-[30px] bg-[#fff] dark:bg-gray-900 px-5 md:px-10 ">
        <div className="max-w-[1000px] mx-auto">
            <div className="flex justify-between items-center py-[20px] mb-[20px]">
                <h5 className="text-[#000] text-[18px] font-[400] dark:text-[#fff]">Public forms</h5>
                <div className="flex items-center gap-[30px]">
                    {cardsView == "card" && <Tooltip title="Table view">
                        <button onClick={() => handleChangeButtonType("table")} className="cursor-pointer"><FaTableList  className="text-[20px] text-[#444] dark:text-[#fff]"/></button>
                    </Tooltip>}
                    {cardsView == "table" && <Tooltip title="Card view">
                        <button onClick={() => handleChangeButtonType("card")} className="cursor-pointer"><FaTableCellsLarge className="text-[20px] text-[#444] dark:text-[#fff]"/></button>
                    </Tooltip>}
                </div>
            </div>
            {cardsView == "card" && <div className="max-w-[1200px] mx-auto grid-cols-1 sm:grid-cols-3 md:grid-cols-5 grid gap-y-[30px] gap-x-[30px]">
                {LatestTemplates?.map(item => (
                    <div onClick={() => handleClick(item.id)} key={item.id} className="rounded-[5px] overflow-hidden w-[180px] border-[1px] border-[#999] hover:border-[#7248b9] transition-all duration-200 cursor-pointer">
                        <div className="w-full h-[150px]">
                            <img src="https://images.ctfassets.net/lzny33ho1g45/4ODoWVyzgicvbcb6J9ZZZ5/c0333ef44af8588fee18c1e6ed403fc7/Group_12549.jpg?w=1520&fm=jpg&q=31&fit=thumb&h=760" alt="add button" className="w-full h-full object-cover"/>
                        </div>
                        <div className="flex items-center justify-between px-[5px]">
                            <div className="flex items-center">
                                {item.isPublished && <Tooltip title="published">
                                    <TbLivePhotoFilled className="text-[#2dee20] shrink-0"/>
                                </Tooltip>}
                                <h4 className="px-[5px] my-[5px] font-[600] line-clamp-1 dark:text-[#fff]">{item.title}</h4>
                            </div>
                        </div>
                        <div className="mx-[10px] mb-[10px]">
                            <p className="text-[14px] dark:text-[#fff]">Creator: <span className="italic">{item.author.name}</span></p>
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

export default PublicTemplates