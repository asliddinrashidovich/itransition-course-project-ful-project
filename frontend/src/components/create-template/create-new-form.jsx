import { useEffect, useRef, useState } from "react"
import { useParams, useSearchParams} from "react-router-dom"
import debounce from 'lodash.debounce'
import axios from 'axios'
import { useQuery } from "@tanstack/react-query";
import AllQuestions from "./questions";
import PublishForm from "./publish-form";
import AnswersPage from "./answers-page";
import ShareTemplate from "./share-template";

const API = import.meta.env.VITE_API

function CreateNewForm() {
    const [searchParams, setSearchParams] = useSearchParams()
    const [title, setTitle] = useState("Untitled Form")
    const [formTitle, setFormTitle] = useState("Untitled form")
    const [formDec, setFormDec] = useState("")
    const formPage = searchParams.get("form-page") || ""
    const [statusFormName, setStatusFormName] = useState('Saved')  
    const {id} = useParams()
    const token = localStorage.getItem('token')
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [refreshTemplate, setRefreshTemplate] = useState(false);

    const spanRefFormName = useRef(null);
    const inputRefFormName = useRef(null);
    const displayValue = title.length > 0 ? title : "Untitled Form"

    const spanRefFormTitle = useRef(null);
    const inputRefFormTitle = useRef(null);
    const displayValueTitle = formTitle.length > 0 ? formTitle : "Untitled Form"

    const spanRefFormDec = useRef(null);
    const inputRefFormDec = useRef(null);
    const displayValueDec = formDec.length > 0 ? formDec : "Form description"


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
            console.log(err)
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
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return res.data
    };
    const { data: TemplateAnswers} = useQuery({
        queryKey: ["answers-template-for-count"],
        queryFn: fetchAnswersTemplete,
    });



  return (
    <section className=" pt-[80px] bg-[#f0ebf8] min-h-[100vh]">
        <div className="w-full py-[10px] px-5 md:px-10 bg-[#e1e1e1] flex fixed z-100 items-center gap-[50px]">
            <div className="relative inline-block">
                <span ref={spanRefFormName} className="absolute top-0 left-0 text-[20px] font-[600] invisible whitespace-pre px-1 border-none">
                    {displayValue || ""}
                </span>
                <input ref={inputRefFormName} type="text" value={displayValue} onChange={(e) => handleChangeFormName(e.target.value)} className="outline-none text-[20px] font-[600] "/>
            </div>
            <ul className="flex items-center gap-[20px]">
                <li onClick={() => handleTabPage("questions")} className={`cursor-pointer border-b-[3px] ${(formPage == "questions" || formPage == "") ? "text-[#7248b9] border-[#7248b9]" : "text-[#000] border-transparent"}`}>Questions</li>
                <li onClick={() => handleTabPage("responses")} className={`cursor-pointer border-b-[3px] ${formPage == "responses"  ? "text-[#7248b9] border-[#7248b9]" : "text-[#000] border-transparent"}`}>Responses {TemplateAnswers?.length}</li>
                <li onClick={() => handleTabPage("settings")} className={`cursor-pointer border-b-[3px] ${formPage == "settings"  ? "text-[#7248b9] border-[#7248b9]" : "text-[#000] border-transparent"}`}>Settings</li>
            </ul>
            <div className="text-xs text-gray-500 italic mt-1">{statusFormName === 'Saving...' ? 'Saving changes…' : statusFormName === 'Saved' ? 'All changes saved' : 'Error while saving'}</div>
            <div className="flex items-center gap-[20px] ml-auto">
                <ShareTemplate setRefreshTemplate={setRefreshTemplate} isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen}/>
                <PublishForm setRefreshTemplate={setRefreshTemplate} LatestTemplate={LatestTemplate} setIsModalOpen={setIsModalOpen}/>
            </div>
        </div>
        {(formPage == "questions" || formPage == "") && <div className="max-w-[800px] mx-auto mt-[70px] flex flex-col gap-[20px]">
            <div className="w-full bg-[#fff] border-t-[10px] border-[#7248b9] rounded-[10px] py-[30px] px-[20px]">
                <div className="relative inline-block">
                    <span ref={spanRefFormTitle} className="absolute top-0 left-0 text-[35px] font-[600] invisible whitespace-pre px-1 border-none">
                        {displayValueTitle || ""}
                    </span>
                    <input ref={inputRefFormTitle} type="text" value={displayValueTitle} onChange={(e) => handleChangeFormTitle(e.target.value)} className="outline-none text-[35px] font-[600] "/>
                </div>
                <div className="relative inline-block w-full">
                    <span ref={spanRefFormDec} className="absolute top-0 left-0 text-[20px] font-[600] invisible whitespace-pre px-1 border-none">
                        {displayValueDec || ""}
                    </span>
                    <input ref={inputRefFormDec} type="text" value={displayValueDec} onChange={(e) => handleChangeFormDec(e.target.value)} className="outline-none text-[17px] mt-[20px]  mb-[10px]  text-[#999]" placeholder="Form description"/>
                </div>
                <hr />
            </div>
            <AllQuestions setStatusFormName={setStatusFormName}/>
        </div>}
        {formPage == "responses" && <AnswersPage/>}
        {formPage == "settings" && <div className="max-w-[800px] mx-auto mt-[70px] flex flex-col gap-[20px]">
            <div className="w-full bg-[#fff]  rounded-[10px] py-[20px] px-[20px]">
                <h2 className="text-[35px] font-[600] py-[10px]">settings</h2>
            </div>
        </div>}
    </section>
  )
}

export default CreateNewForm