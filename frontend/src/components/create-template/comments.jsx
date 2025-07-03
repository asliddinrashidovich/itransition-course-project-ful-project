import { useQuery } from "@tanstack/react-query"
import { Skeleton } from "antd"
import axios from "axios"
import { useState } from "react"
import toast from "react-hot-toast"
import { useTranslation } from "react-i18next"
import { FaComments } from "react-icons/fa"
import { MdDeleteForever, MdOutlineClose } from "react-icons/md"
import { useParams } from "react-router-dom"
import { ClipLoader } from "react-spinners"

const API = import.meta.env.VITE_API

function Comments() {
    const [openComments, setOpenComments] = useState(false)
    const [loadingAdd, setLoadingAdd] = useState(false)
    const {t} = useTranslation()
    const [commentText, setCommentText] = useState("")
    const [refreshComments, setrefreshComments] = useState(false)
    const token = localStorage.getItem('token')
    const user = JSON.parse(localStorage.getItem('user'))
    const {id} = useParams()
    
    // get template details
    const fetchTemplateComments = async () => {
        const res = await axios.get(`${API}/api/templates/${id}/comments`, {headers: { Authorization: `Bearer ${token}`}});
        return res.data
    };
    const { data: comments, isLoading: loading} = useQuery({
        queryKey: ["all-comments", refreshComments],
        queryFn: fetchTemplateComments,
    });


    // add comment
    async function handleAddComment(e) {
        e.preventDefault()
        setLoadingAdd(true)

        await axios.post(`${API}/api/templates/${id}/comments`, { text: commentText }, {
            headers: { Authorization: `Bearer ${token}`}
        }).then(() => {
            setLoadingAdd(false)
            setCommentText("")
            setrefreshComments(prev => !prev)
        }).catch((err) => {
            toast.error(err.response?.data?.message || "Something went wrong");
        })
    }

    // add comment
    async function handleDelete(commentId) {
        await axios.delete(`${API}/api/templates/comments/${commentId}`, {headers: { Authorization: `Bearer ${token}`}}).then(() => {
            setrefreshComments(prev => !prev)
        }).catch((err) => {
            toast.error(err.response?.data?.message || "Something went wrong");
        })
    }
  return (
    <div className="">
        {!openComments && <button onClick={() => setOpenComments(true)} className="border-[1px] hover:bg-[#7248b9] transition-all duration-200  rounded-[5px] p-[10px] border-[#888] bg-[#fff] cursor-pointer"><FaComments className="text-[30px]"/></button>}
        {openComments && (
            <div className="bg-[#fff] dark:bg-gray-400 p-[10px] relative h-[400px] w-[250px] sm:w-[300px] shadow-2xl rounded-[10px] z-[400] ">
                <div className="flex items-center justify-between">
                    <h5>{t('comments')}</h5>
                    <button className="cursor-pointer" onClick={() => setOpenComments(false)}><MdOutlineClose/></button>
                </div>
                <hr className="my-[10px] border-[#888]"/>
                <div className="p-[10px] flex flex-col gap-[5px]  absolute top-[60px] bottom-[60px] right-[10px] left-[10px] overflow-auto">
                    {comments?.map(item => (
                        <div className="flex items-center justify-between">
                            <div className={`p-[5px] gap-[10px] items-start rounded-[10px] flex justify-start`}>
                                <div className="shrink-0 w-[25px] h-[25px] bg-[blue] rounded-[100%] overflow-hidden">
                                    <img src="https://cdn.pixabay.com/photo/2023/02/18/11/00/icon-7797704_640.png" alt="author img" />
                                </div>
                                <div>
                                    <h4 className="text-[14px] font-[400] italic">{item.author.name} <span>{user.name == item.author.name && "(you)" }</span></h4>
                                    <p className="text-[14px] font-[600]">{item.text}</p>
                                </div>
                            </div>
                            {user.name == item.author.name && <button className="cursor-pointer" onClick={() => handleDelete(item.id)}><MdDeleteForever className="text-[#ff6363]"/></button>}
                        </div>
                    ))}
                    {!loading && Array.isArray(comments) && !comments.length && (
                        <div className="col-span-1 md:col-span-3 lg:col-span-5 ">
                            {t('noComments')}
                        </div>
                    )}
                    {loading && ( 
                        <div className="col-span-1 md:col-span-3 lg:col-span-5 ">
                            <Skeleton paragraph={{rows: 5}}/>
                        </div>
                    )}
                </div>
                <form onSubmit={handleAddComment} className="absolute bottom-[10px] left-[10px] right-[10px] rounded-[40px] p-[10px] bg-[#ededed] border-[1px] border-[#999] flex items-center justify-between">
                    <input value={commentText} onChange={(e) => setCommentText(e.target.value)} type="text" className="outline-none w-[100px] sm:w-full bg-transparent" placeholder="Comment"/>
                    {!loadingAdd && <button type="submit" disabled={commentText.length == 0} className={`text-[12px]  w-[100px]  py-[5px]  rounded-[30px] ${commentText.length > 0 ? "cursor-pointer bg-[#7248b9] text-[#fff]" : "cursor-not-allowed bg-[#fff] text-[#000] border-[1px] border-[#999]"}`}>{t('comment')}</button>}

                    {loadingAdd && <button type="button" className="text-[12px] sm:w-[100px]   cursor-pointer py-[5px] bg-[#7248b9] text-[#fff] rounded-[30px]"><ClipLoader size={15} /></button>}
                </form>
            </div>
        )}
    </div>
  )
}

export default Comments