import { useQuery } from "@tanstack/react-query"
import { Tooltip } from "antd"
import axios from "axios"
import toast from "react-hot-toast"
import { TbLivePhotoFilled } from "react-icons/tb"
import { useNavigate } from "react-router-dom"

const API = import.meta.env.VITE_API

function StartNewForm() {
    const navigate = useNavigate()
    const token = localStorage.getItem('token')

    async function handleCreateNew(path) {
        await axios.post(`${API}/api/templates`, { title: "Untitled Form", description: "From Description", topic: "Other", isPublic: true}, {headers: { Authorization: `Bearer ${token}`}}).then((res) => {
            console.log(res)
            navigate(`${path}/${res?.data?.id}`)
        }).catch((err) => {
            toast.error(err.response?.data?.message || "Something went wrong");
        })
    }


        // get templates 
        const fetchPupularTempletes = async () => {
            const res = await axios.get(`${API}/api/templates`, {headers: {Authorization: `Bearer ${token}`}});
            const  allData = res.data    
            if (!allData) return [];

            return [...allData].sort((a, b) => b.likes - a.likes).slice(0, 4); 
        };
        const { data: PupularTemplates} = useQuery({
            queryKey: ["pupular-templates"],
            queryFn: fetchPupularTempletes,
        });

        function handleClick(id) {
            navigate(`/templates/${id}`)
        }
  return (
    <section className="pb-[30px] bg-[#f1f3f4] px-5 md:px-10 pt-[80px]">
        <div className="max-w-[1000px] mx-auto">
            <div className="flex justify-between items-center py-[20px]">
                <h5 className="text-[#000] text-[18px] font-[400]">Start a new form</h5>
            </div>
            <div className="max-w-[1200px] mx-auto justify-between grid-cols-1 sm:grid-cols-3 md:grid-cols-5 grid gap-y-[30px] gap-x-[30px]">
                <div className="w-[180px]" onClick={() => handleCreateNew("/templates")}>
                    <div className="w-full h-[150px] bg-[#fff] rounded-[5px] border-[1px] border-[#999] hover:border-[#7248b9] transition-all duration-200 cursor-pointer flex items-center justify-center">
                        <img src="/add-symbol.svg" alt="add button" className="w-[60px]"/>
                    </div>
                    <h3 className="py-[10px] font-[600]">Blank form</h3>
                </div>
                {PupularTemplates?.map(item => (
                    <div onClick={() => handleClick(item.id)} key={item.id} className="rounded-[5px] overflow-hidden w-[180px] border-[1px] border-[#999] hover:border-[#7248b9] transition-all duration-200 cursor-pointer">
                        <div className="w-full h-[150px]">
                            <img src="https://images.ctfassets.net/lzny33ho1g45/4ODoWVyzgicvbcb6J9ZZZ5/c0333ef44af8588fee18c1e6ed403fc7/Group_12549.jpg?w=1520&fm=jpg&q=31&fit=thumb&h=760" alt="add button" className="w-full h-full object-cover"/>
                        </div>
                        <div className="flex items-center justify-between px-[5px]">
                            <div className="flex items-center">
                                {item.isPublished && <Tooltip title="published">
                                    <TbLivePhotoFilled className="text-[#2dee20] shrink-0"/>
                                </Tooltip>}
                                <h4 className="px-[5px] my-[5px] font-[600] line-clamp-1">{item.title}</h4>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    </section>
  )
}

export default StartNewForm