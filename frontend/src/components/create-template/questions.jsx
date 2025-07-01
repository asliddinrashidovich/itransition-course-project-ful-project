import { FaRegTrashAlt } from "react-icons/fa";
import { Checkbox, Switch } from 'antd';
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { IoAddSharp } from "react-icons/io5";
import toast from "react-hot-toast";
import debounce from "lodash.debounce";
import QuestionCardSkeleton from "../skeleton/question-card-skeleton";
import { IoMdClose } from "react-icons/io";


const API = import.meta.env.VITE_API

function AllQuestions({setStatusFormName}) {
    const [refreshQuestions, setRefreshQuestions] = useState(false)
    const {id} = useParams()
    const token = localStorage.getItem('token')
    const [focusQuestion, setFocusQuestion] = useState("");


    // get template details
    const fetchLatestTemplete = async () => {
        const res = await axios.get(`${API}/api/templates/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return res.data
    };
    const { data: LatestTemplate, isLoading: loading} = useQuery({
        queryKey: ["latest-templatee1", refreshQuestions],
        queryFn: fetchLatestTemplete,
    });
    // handle Add option
    const addOption = async (quesId) => {
        const nextNumber = (LatestTemplate?.questions?.find(q => q.id === quesId)?.options?.length || 0) + 1;
        try {
            await axios.patch(`${API}/api/templates/questions/${quesId}/options`, {
                newOption: `Option ${nextNumber}`
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setStatusFormName("Saved");
            setRefreshQuestions(prev => !prev); // 🔁 UI yangilash uchun
        } catch (err) {
            toast.error(err.response?.data?.message || "Add option save failed");
            setStatusFormName("Error");
        }
    };

    // delete options
    const handleDeleteOption = async (questionId, optionText) => {
        try {
            await axios.patch(`${API}/api/templates/questions/${questionId}/options/delete`, {
                option: optionText
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setStatusFormName("Saved");
            setRefreshQuestions(prev => !prev);
        } catch (err) {
            toast.error(err.response?.data?.message || "Delete option failed");
            setStatusFormName("Error");
        }
    };


    // edit question options title
    const [optionValues, setOptionValues] = useState({});   // { [questionId]: { [index]: "text" } }
    const optionInputRefs = useRef({});
    const optionSpanRefs = useRef({});

    
    const saveOptionTitle = debounce(async (questionId, oldOption, newOption) => {
        try {
            await axios.patch(`${API}/api/templates/questions/${questionId}/options/update`, {
                oldOption,
                newOption,
            }, { headers: { Authorization: `Bearer ${token}` }});
            setStatusFormName("Saved");
        } catch (err) {
            toast.error(err.response?.data?.message || "Option title update failed");
            setStatusFormName("Error");
        }
    }, 1000);


    useEffect(() => {
        if (LatestTemplate?.questions) {
            const optionMap = {};
            LatestTemplate.questions.forEach((q) => {
            if (q.type === "checkbox") {
                optionMap[q.id] = {};
                q.options.forEach((opt, idx) => {
                optionMap[q.id][idx] = opt;
                });
            }
            });
            setOptionValues(optionMap);
        }
    }, [LatestTemplate]);


    // question type changer
    const handleChangeQuestionType = async (val, questionId) => {
        console.log(val, questionId)
        await axios.patch(`${API}/api/templates/questions/${questionId}/type`, {type: val}, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }).then((res) => {
            console.log(res)
            setRefreshQuestions(prev => prev ? false : true)
        }).catch((err) => {
            toast.error(err.response?.data?.message || "Something went wrong");
        })
    };


    // add qaestion
    async function handleAddQuestion() {
         await axios.post(`${API}/api/templates/${id}/questions`, {}, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }).then(() => {
            setRefreshQuestions(prev => prev ? false : true)
        }).catch((err) => {
            toast.error(err.response?.data?.message || "Something went wrong");
        })
    }

    // delete qaestion
    async function handleDeleteQuestion(questionId) {
         await axios.delete(`${API}/api/templates/questions/${questionId}`, {
            headers: { Authorization: `Bearer ${token}` }
        }).then(() => {
            setRefreshQuestions(prev => prev ? false : true)
        }).catch((err) => {
            toast.error(err.response?.data?.message || "Something went wrong");
        })
    }


    console.log(LatestTemplate)

    // handlechange title
    const [questionTitles, setQuestionTitles] = useState({});

    const saveQuestionTitle = debounce(async (questionId, title) => {
        try {
            await axios.put(`${API}/api/templates/questions/${questionId}/title`, { title }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setStatusFormName("Saved");
        } catch (err) {
            toast.error(err.response?.data?.message || "Title save failed");
            setStatusFormName("Error");
        }
    }, 1000);


    useEffect(() => {
        if (LatestTemplate?.questions) {
            const titles = {};
                LatestTemplate.questions.forEach((q) => {
                titles[q.id] = typeof q.title === 'string' && q.title.trim() !== '' ? q.title : 'Untitled Question';
            });
            setQuestionTitles(titles);
        }
    }, [LatestTemplate]);

    const handleTitleChange = (val, idTitle) => {
        setQuestionTitles((prev) => ({ ...prev, [idTitle]: val }));
        setStatusFormName("Saving...");  
        saveQuestionTitle(idTitle, val);  
    };


    const titleInputRefs = useRef({});
    const titleSpanRefs = useRef({});

    useEffect(() => {
        LatestTemplate?.questions?.forEach((q) => {
            const input = titleInputRefs.current[q.id];
            const span = titleSpanRefs.current[q.id];
            if (input && span) {
                span.textContent = questionTitles[q.id] || "Untitled Question";
                input.style.width = span.offsetWidth + 5 + "px";
            }
        });
    }, [questionTitles, LatestTemplate]);

    

  return (
    <div className="relative"> 
        <div className="flex flex-col gap-[20px] mb-[30px]">
            {LatestTemplate?.questions?.map(item => (
                <div key={item.id} onClick={() => setFocusQuestion(item.id)} className={`w-full bg-[#fff] border-l-[7px]  ${focusQuestion == item.id ? "border-[#7248b9] py-[30px] px-[20px]" : "border-[#fff] p-[20px]"} rounded-[10px] `}>
                    <div className="flex items-center justify-between">
                        <div className="relative inline-block">
                            <span
                                ref={(el) => (titleSpanRefs.current[item.id] = el)}
                                className="absolute top-0 left-0 text-[18px] font-[600] invisible whitespace-pre"
                            >{questionTitles[item.id] || ""}</span>
                            <input
                                ref={(el) => (titleInputRefs.current[item.id] = el)}
                                type="text"
                                value={questionTitles[item.id] || "Untitled Question"}
                                onChange={(e) => handleTitleChange(e.target.value, item.id)}
                                className={`outline-none text-[18px] font-[600] ${focusQuestion == item.id ? "border-[#999]" : "border-transparent"} border-b-[1px] border-[#999] w-full`}
                            />
                        </div>
                        <div className={`${focusQuestion == item.id ? "flex" : "hidden"} items-center gap-[20px]`}>
                            <button onClick={() => handleDeleteQuestion(item.id)}><FaRegTrashAlt  className="text-[#999] text-[20px] cursor-pointer"/></button>
                            <select value={item.type} onChange={(e) => handleChangeQuestionType(e.target.value, item.id)} name="type_question" id="type_question" className="border-[1px] border-[#999] text-[#999] rounded-[4px] cursor-pointer px-[10px] py-[5px]">
                                <option value="short_text">Short Text</option>
                                <option value="paragraph">Paragraph</option>
                                <option value="number">Number</option>
                                <option value="checkbox">Checkboxes</option>
                            </select>
                        </div>
                    </div>
                    {item.type == 'short_text' && <p className={`${focusQuestion == item.id ? "pt-[20px] border-[#999]" : "pt-[10px] border-transparent"} text-[#999] pb-[10px] border-b-[1px]  w-[50%]`}>Short answer text</p>}
                    {item.type == "paragraph" && <p className={`${focusQuestion == item.id ? "pt-[20px] border-[#999]" : "pt-[10px] border-transparent"} text-[#999] pb-[10px] border-b-[1px]   w-[65%]`}>Long answer text</p>}
                    {item.type == "number" && <p className={`${focusQuestion == item.id ? "pt-[20px] border-[#999]" : "pt-[10px] border-transparent"} text-[#999] pb-[10px] border-b-[1px]   w-[25%]`}>Number answer</p>}
                    {item.type == "checkbox" && <div className={`${focusQuestion == item.id ? "pt-[20px] border-[#999]" : "pt-[10px] border-transparent"} text-[#999] pb-[10px] border-b-[1px] flex flex-col gap-[15px] w-full`}>
                        {item.options.map((opt, index) => (
                            <div key={index} className="flex items-center justify-between w-full    ">
                                <div className="flex items-center gap-[10px]">
                                    <div className="w-[15px] h-[15px] border-[1px] border-[#888] rounded-[3px]"></div>
                                    {/* <p className="text-[#000]">{opt} </p> */}
                                    <div className="relative inline-block">
                                        <span
                                        ref={(el) => {if (!optionSpanRefs.current[item.id]) optionSpanRefs.current[item.id] = {};
                                            optionSpanRefs.current[item.id][index] = el;
                                        }}
                                        className="absolute top-0 left-0 text-[16px] invisible whitespace-pre font-medium"
                                        >
                                        {optionValues[item.id]?.[index] || opt}
                                        </span>
                                        <input
                                        type="text"
                                        value={optionValues[item.id]?.[index] || opt}
                                        ref={(el) => {
                                            if (!optionInputRefs.current[item.id]) optionInputRefs.current[item.id] = {};
                                            optionInputRefs.current[item.id][index] = el;
                                        }}
                                        onChange={(e) => {
                                            const val = e.target.value;
                                            const oldVal = optionValues[item.id]?.[index] || opt;

                                            setOptionValues(prev => ({
                                                ...prev,
                                                [item.id]: {
                                                    ...prev[item.id],
                                                    [index]: val
                                                }
                                            }));

                                            setStatusFormName("Saving...");
                                            saveOptionTitle(item.id, oldVal, val);
                                        }}

                                        className="outline-none text-[16px] font-medium border-b border-[#aaa]"
                                        style={{
                                            width: optionSpanRefs.current?.[item.id]?.[index]?.offsetWidth + 5 || 'auto'
                                        }}
                                        />
                                    </div>
                                </div>
                                <button onClick={() => handleDeleteOption(item.id, opt)} className="cursor-pointer">
                                    <IoMdClose  className="text-[20px]"/>
                                </button>
                            </div>
                        ))}
                        <div onClick={() =>  addOption(item.id)} className="flex items-center gap-[10px]">
                            <div className="w-[15px] h-[15px] border-[1px] border-[#888] rounded-[3px]"></div>
                            <p  className="border-b-[1px] border-[#999] ">Add option</p>
                        </div>
                    </div>}
                </div>
            ))}
            {!loading && Array.isArray(LatestTemplate?.questions) && !LatestTemplate?.questions?.length && (
                <div className="col-span-1 md:col-span-3 lg:col-span-5 ">
                    No questions
                </div>
            )}
            {loading && ( 
                <div className="col-span-1 md:col-span-3 lg:col-span-5 ">
                    <QuestionCardSkeleton/>
                </div>
            )}
        </div>
        <div className="w-full">
            <button onClick={handleAddQuestion} className="w-[100%] mb-[20px] h-[50px] flex items-center justify-center rounded-[10px] cursor-pointer bg-[#fff] hover:bg-[#f6daff] transition-all duration-200">
                <IoAddSharp className="text-[25px]"/>
            </button>
        </div>
    </div>
  )
}

export default AllQuestions