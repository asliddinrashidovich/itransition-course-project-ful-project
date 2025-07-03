import { useEffect, useRef, useState } from "react"
import { useParams, useSearchParams} from "react-router-dom"
import debounce from 'lodash.debounce'
import axios from 'axios'
import { useQuery } from "@tanstack/react-query";
import AllQuestions from "./questions";
import PublishForm from "./publish-form";
import AnswersPage from "./answers-page";
import ShareTemplate from "./share-template";
import Comments from "./comments";
import toast from "react-hot-toast";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { useTranslation } from "react-i18next";

const API = import.meta.env.VITE_API

function CreateNewForm() {
    const [searchParams, setSearchParams] = useSearchParams()
    const [title, setTitle] = useState("Untitled Form")
    const {t} = useTranslation()
    const [formTitle, setFormTitle] = useState("Untitled form")
    const [formDec, setFormDec] = useState("")
    const formPage = searchParams.get("form-page") || ""
    const [statusFormName, setStatusFormName] = useState('Saved')  
    const {id} = useParams()
    const token = localStorage.getItem('token')
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [refreshLiked, setRefreshLikes] = useState(false);
    const [refreshTemplate, setRefreshTemplate] = useState(false);

    const spanRefFormName = useRef(null);
    const inputRefFormName = useRef(null);
    const displayValue = title.length > 0 ? title : ""

    const spanRefFormTitle = useRef(null);
    const inputRefFormTitle = useRef(null);
    const displayValueTitle = formTitle.length > 0 ? formTitle : ""

    const spanRefFormDec = useRef(null);
    const inputRefFormDec = useRef(null);
    const displayValueDec = formDec.length > 0 ? formDec : ""


    // auto save title 
    useEffect(() => {
        if (!statusFormName) return
        setStatusFormName('Saving...')
        debouncedSave()
    }, [title, formTitle, formDec])

    const saveChanges = async () => {
        try {
            await axios.put(`${API}/api/templates/${id}`, { title, formTitle, description: formDec}, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            setStatusFormName('Saved')
        } catch (err) {
            toast.error(err.response?.data?.message || "Something went wrong");
            setStatusFormName('Error')
        }
    }
    const debouncedSave = debounce(saveChanges, 1000)

    useEffect(() => {
        if (spanRefFormName.current && inputRefFormName.current) {
            const width = spanRefFormName.current.offsetWidth;
            inputRefFormName.current.style.width = `${width + 2}px`;
        } 
        if (spanRefFormTitle.current && inputRefFormTitle.current) {
            const width = spanRefFormTitle.current.offsetWidth;
            inputRefFormTitle.current.style.width = `${width + 5}px`;
        } 
        if (spanRefFormDec.current && inputRefFormDec.current) {
            const width = spanRefFormDec.current.offsetWidth;
            inputRefFormDec.current.style.width = `${width + 3}px`;
        } 
    }, [title, formTitle, formDec]);

    function handleChangeFormName(val) {
        setTitle(val)
    }
    function handleChangeFormTitle(val) {
        setFormTitle(val)
    }
    function handleChangeFormDec(val) {
        setFormDec(val)
    }


    function handleTabPage(path)  {
        searchParams.set("form-page", path)
        setSearchParams(searchParams)
    }

    // get template details
    const fetchLatestTemplete = async () => {
        const res = await axios.get(`${API}/api/templates/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        setTitle(res?.data?.title || "Untitled Form")
        setFormTitle(res?.data?.formTitle)
        setFormDec(res?.data?.description)
        return res.data
    };
    const { data: LatestTemplate} = useQuery({
        queryKey: ["latest-template", refreshTemplate],
        queryFn: fetchLatestTemplete,
    });

    console.log(LatestTemplate)

    // get template answers
    const fetchAnswersTemplete = async () => {
        const res = await axios.get(`${API}/api/answers/template/${id}`, {
            headers: {Authorization: `Bearer ${token}`}
        });
        return res.data
    };
    const { data: TemplateAnswers} = useQuery({
        queryKey: ["answers-template-for-count"],
        queryFn: fetchAnswersTemplete,
    });

    // know template is liked
    const fetchLikedTemplate = async () => {
        const res = await axios.get(`${API}/api/templates/${id}/is-liked`, {
            headers: {Authorization: `Bearer ${token}`}
        });
        return res.data
    };
    const { data: isLiked} = useQuery({
        queryKey: ["is-liked", refreshLiked],
        queryFn: fetchLikedTemplate,
    });

    // handleLike 
    async function handleLike() {
        await axios.patch(`${API}/api/templates/${id}/like`, {}, {
            headers: { Authorization: `Bearer ${token}`}
        }).then(() => {
            setRefreshLikes(prev => !prev)
        }).catch((err) => {
            toast.error(err.response?.data?.message || "Something went wrong");
        })
    }

    // handle unLike 
    async function handleUnLike() {
        await axios.patch(`${API}/api/templates/${id}/unlike`, {}, {
            headers: { Authorization: `Bearer ${token}`}
        }).then(() => {
            setRefreshLikes(prev => !prev)
        }).catch((err) => {
            toast.error(err.response?.data?.message || "Something went wrong");
        })
    }


  return (
    <section className="pt-[80px] bg-[#f0ebf8] dark:bg-gray-500 min-h-[100vh] relative">
        <div className="fixed bottom-[30px] left-[30px] z-[101]">
            <Comments/>
        </div>
        <div className="w-full py-[10px] px-5 md:px-10 bg-[#e1e1e1] dark:bg-gray-900 flex fixed z-[200] items-center gap-[50px]">
            <div className="relative inline-block">
                <span ref={spanRefFormName} className="absolute top-0 left-0 text-[20px] font-[600] invisible whitespace-pre px-1 border-none">
                    {displayValue || ""}
                </span>
                <input ref={inputRefFormName} type="text" value={displayValue} onChange={(e) => handleChangeFormName(e.target.value)} className="outline-none text-[20px] dark:text-[#fff] font-[600] bg-transparent"/>
            </div>
            <ul className="flex items-center gap-[20px]">
                <li onClick={() => handleTabPage("questions")} className={`dark:text-[#fff] cursor-pointer border-b-[3px] ${(formPage == "questions" || formPage == "") ? "text-[#7248b9] border-[#7248b9]" : "text-[#000] border-transparent"}`}>{t('questions')}</li>
                <li onClick={() => handleTabPage("responses")} className={`dark:text-[#fff] cursor-pointer border-b-[3px] ${formPage == "responses"  ? "text-[#7248b9] border-[#7248b9]" : "text-[#000] border-transparent"}`}>{t('responces')} {TemplateAnswers?.length}</li>
            </ul>
            <div className="text-xs text-gray-500 dark:text-[#fff] italic mt-1">{statusFormName === 'Saving...' ? t('SavingChanges') : statusFormName === 'Saved' ? t('AllChangesSaved') : t('ErrorSaving')}</div>
            <div>
                {!isLiked?.isLiked && <button className="cursor-pointer" onClick={() => handleLike()}><FaRegHeart className="text-[20px] text-[#ff5959]"/></button>}
                {isLiked?.isLiked && <button className="cursor-pointer" onClick={() => handleUnLike()}><FaHeart className="text-[20px] text-[#ff5959]"/></button>}
            </div>
            <div className="flex items-center gap-[20px] ml-auto">
                <ShareTemplate setRefreshTemplate={setRefreshTemplate} isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen}/>
                <PublishForm setRefreshTemplate={setRefreshTemplate} LatestTemplate={LatestTemplate} setIsModalOpen={setIsModalOpen}/>
            </div>
        </div>
        {(formPage == "questions" || formPage == "") && <div className="max-w-[800px] mx-auto mt-[70px] flex flex-col gap-[20px]">
            <div className="w-full bg-[#fff] dark:bg-gray-700 border-t-[10px] border-[#7248b9] rounded-[10px] py-[30px] px-[20px]">
                <div className="relative inline-block">
                    <span ref={spanRefFormTitle} className="absolute top-0 left-0 text-[35px] font-[600] invisible whitespace-pre px-1 border-none">
                        {displayValueTitle || ""}
                    </span>
                    <input ref={inputRefFormTitle} type="text" value={displayValueTitle} onChange={(e) => handleChangeFormTitle(e.target.value)} className="outline-none text-[35px] dark:text-[#fff] bg-transparent font-[600] "/>
                </div>
                <div className="relative inline-block w-full">
                    <span ref={spanRefFormDec} className="absolute top-0 left-0 w-full text-[20px] font-[600] invisible whitespace-pre px-1 border-none">
                        {displayValueDec || ""}
                    </span>
                    <input ref={inputRefFormDec} type="text" value={displayValueDec} onChange={(e) => handleChangeFormDec(e.target.value)} className="outline-none text-[17px] mt-[20px] bg-transparent mb-[10px] w-[600px] text-[#999] dark:text-[#fff]" placeholder="Form description "/>
                </div>
                <hr />
            </div>
            <AllQuestions setStatusFormName={setStatusFormName}/>
        </div>}
        {formPage == "responses" && <AnswersPage/>}
    </section>
  )
}

export default CreateNewForm