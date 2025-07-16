import { FaRegTrashAlt } from "react-icons/fa";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { IoAddSharp } from "react-icons/io5";
import toast from "react-hot-toast";
import debounce from "lodash.debounce";
import QuestionCardSkeleton from "../skeleton/question-card-skeleton";
import { IoMdClose } from "react-icons/io";
import { ClipLoader } from "react-spinners";
import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd";
import { useTranslation } from "react-i18next";

const API = import.meta.env.VITE_API

function AllQuestions({setStatusFormName}) {
    const [refreshQuestions, setRefreshQuestions] = useState(false)
    const {id} = useParams()
    const token = localStorage.getItem('token')
    const [focusQuestion, setFocusQuestion] = useState("");
    const [loadingAdd, setLoadingAdd] = useState(false)
    const [QuestionLIst, setQuestionsList] = useState([])
    const {t} = useTranslation('')

    // get template details
    const fetchLatestTemplete = async () => {
        const res = await axios.get(`${API}/api/templates/${id}`, { headers: {  Authorization: `Bearer ${token}`}});
        const questions = res?.data?.questions
        setQuestionsList(questions)
        return res.data
    };
    const { data: LatestTemplate, isLoading: loading} = useQuery({
        queryKey: ["latest-templatee1", refreshQuestions],
        queryFn: fetchLatestTemplete,
    });

    // handle Add option
    const addOption = async (quesId) => {
        const nextNumber = (QuestionLIst?.find(q => q.id === quesId)?.options?.length || 0) + 1;
        try {
            await axios.patch(`${API}/api/templates/questions/${quesId}/options`, {newOption: `Option ${nextNumber}`}, {headers: { Authorization: `Bearer ${token}`}});
            setStatusFormName("Saved");
            setRefreshQuestions(prev => !prev);
        } catch (err) {
            toast.error(err.response?.data?.message || "Add option save failed");
            setStatusFormName("Error");
        }
    };

    // delete options
    const handleDeleteOption = async (questionId, optionId) => {
        try {
            await axios.patch(`${API}/api/templates/questions/${questionId}/options/delete`, {optionId}, {headers: { Authorization: `Bearer ${token}` }});
            setStatusFormName("Saved");
            setRefreshQuestions(prev => !prev);
        } catch (err) {
            toast.error(err.response?.data?.message || "Delete option failed");
            setStatusFormName("Error");
        }
    };

    // edit question options title
    const [optionValues, setOptionValues] = useState({}); 
    const optionInputRefs = useRef({});
    const optionSpanRefs = useRef({});
        
    const saveOptionTitle = debounce(async (questionId, optionId, newText) => {
        if (!newText?.trim()) return;
        try {
            await axios.patch(`${API}/api/templates/questions/${questionId}/options/update`, {optionId, newText,}, { headers: { Authorization: `Bearer ${token}` } });
            setStatusFormName("Saved");
        } catch (err) {
            toast.error(err.response?.data?.message || "Option title update failed");
            setStatusFormName("Error");
        }
    }, 1000);

    useEffect(() => {
        if (QuestionLIst) {
            const optionMap = {};
            QuestionLIst.forEach((q) => {
                if (q.type == "checkbox") {
                    optionMap[q.id] = {};
                    q.options.forEach((opt, idx) => {
                        optionMap[q.id][idx] = typeof opt == "object" ? opt.text : opt;
                    });
                }
            });
            setOptionValues(optionMap);
        }
    }, [LatestTemplate]);

    // question type changer
    const handleChangeQuestionType = async (val, questionId) => {
        console.log(val, questionId)
        await axios.patch(`${API}/api/templates/questions/${questionId}/type`, {type: val}, {headers: { Authorization: `Bearer ${token}`}
        }).then((res) => {
            console.log(res)
            setRefreshQuestions(prev => prev ? false : true)
        }).catch((err) => {
            toast.error(err.response?.data?.message || "Something went wrong");
        })
    };

    // add qaestion
    async function handleAddQuestion() {
        setLoadingAdd(true)
        await axios.post(`${API}/api/templates/${id}/questions`, {}, {headers: { Authorization: `Bearer ${token}`}
        }).then(() => {
            setLoadingAdd(false)
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

    // handlechange title
    const [questionTitles, setQuestionTitles] = useState({});

    const saveQuestionTitle = debounce(async (questionId, title) => {
        try {
            await axios.put(`${API}/api/templates/questions/${questionId}/title`, { title }, {headers: { Authorization: `Bearer ${token}`}
            });
            setStatusFormName("Saved");
        } catch (err) {
            toast.error(err.response?.data?.message || "Title save failed");
            setStatusFormName("Error");
        }
    }, 1000);

    useEffect(() => {
        if (QuestionLIst) {
            const titles = {};
                QuestionLIst.forEach((q) => {
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
        QuestionLIst?.forEach((q) => {
            const input = titleInputRefs.current[q.id];
            const span = titleSpanRefs.current[q.id];
            if (input && span) {
                span.textContent = questionTitles[q.id] || "Untitled Question";
                input.style.width = span.offsetWidth + 5 + "px";
            }
        });
    }, [questionTitles, LatestTemplate]);

    // drag and drop questions
    const handleDragEnd = (result) => {
        if (!result.destination) return;
        const items = Array.from(QuestionLIst);
        const [reorderedItem] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, reorderedItem);
        setQuestionsList(items);
    };

  return (
    <div className="relative"> 
        <div className="flex flex-col gap-[20px] mb-[30px]">
            {QuestionLIst.length > 0 && <DragDropContext onDragEnd={handleDragEnd}>
                <Droppable droppableId="QuestionLIst">
                     {(provided) => (
                        <div {...provided.droppableProps} ref={provided.innerRef}>
                            {QuestionLIst?.map((item, index) => (
                                <Draggable
                                    key={item.id}
                                    draggableId={item.id}
                                    index={index}
                                >
                                    {(provided) => (
                                        <div ref={provided.innerRef}
                                        {...provided.draggableProps}
                                        {...provided.dragHandleProps} onClick={() => setFocusQuestion(item.id)} className={`w-full bg-[#fff] dark:bg-gray-700 border-l-[7px]  ${focusQuestion == item.id ? "border-[#7248b9] py-[30px] px-[20px]" : "border-transparent p-[20px]"} rounded-[10px]  mb-[20px]`}>
                                            <div className="flex items-center justify-between">
                                                <div className="relative inline-block">
                                                    <span
                                                        ref={(el) => (titleSpanRefs.current[item.id] = el)}
                                                        className="absolute top-0 left-0 text-[18px] font-[600] invisible whitespace-pre"
                                                    >{questionTitles[item.id] || ""}</span>
                                                    <input
                                                        ref={(el) => (titleInputRefs.current[item.id] = el)}
                                                        type="text"
                                                        value={questionTitles[item.id] || ""}
                                                        onChange={(e) => handleTitleChange(e.target.value, item.id)}
                                                        className={`outline-none text-[18px] font-[600] ${focusQuestion == item.id ? "border-[#999]" : "border-transparent"} bg-transparent dark:text-[#fff] border-b-[1px] border-[#999] w-full`}
                                                    />
                                                </div>
                                                <div className={`${focusQuestion == item.id ? "flex" : "hidden"} items-center gap-[20px]`}>
                                                    <button onClick={() => handleDeleteQuestion(item.id)}><FaRegTrashAlt  className="text-[#999] text-[20px] cursor-pointer"/></button>
                                                    <select value={item.type} onChange={(e) => handleChangeQuestionType(e.target.value, item.id)} name="type_question" id="type_question" className="border-[1px] border-[#999] text-[#999] rounded-[4px] cursor-pointer px-[10px] py-[5px]">
                                                        <option value="short_text">{t('shortText')}</option>
                                                        <option value="paragraph">{t('paragraph')}</option>
                                                        <option value="number">{t('number')}</option>
                                                        <option value="checkbox">{t('checkboxes')}</option>
                                                    </select>
                                                </div>
                                            </div>
                                            {item.type == 'short_text' && <p className={`${focusQuestion == item.id ? "pt-[20px] border-[#999]" : "pt-[10px] border-transparent"} text-[#999] dark:text-[#fff] pb-[10px] border-b-[1px]  w-[50%]`}>{t('shortAnswer')}</p>}
                                            {item.type == "paragraph" && <p className={`${focusQuestion == item.id ? "pt-[20px] border-[#999]" : "pt-[10px] border-transparent"} text-[#999] dark:text-[#fff] pb-[10px] border-b-[1px]   w-[65%]`}>{t('longAnswer')}</p>}
                                            {item.type == "number" && <p className={`${focusQuestion == item.id ? "pt-[20px] border-[#999]" : "pt-[10px] border-transparent"} text-[#999] dark:text-[#fff] pb-[10px] border-b-[1px]   w-[25%]`}>{t('number')}</p>}
                                            {item.type == "checkbox" && <div className={`${focusQuestion == item.id ? "pt-[20px] border-[#999]" : "pt-[10px] border-transparent"} text-[#999] dark:text-[#fff] pb-[10px] border-b-[1px] flex flex-col gap-[15px] w-full`}>
                                                {item.options.map((opt, index) => (
                                                    <div key={index} className="flex items-center justify-between w-full    ">
                                                        <div className="flex items-center gap-[10px]">
                                                            <div className="shrink-0 w-[15px] h-[15px] border-[1px] border-[#888] rounded-[3px]"></div>
                                                            <div className="relative inline-block w-full">
                                                                <span
                                                                    ref={(el) => {
                                                                    if (!optionSpanRefs.current[item.id]) optionSpanRefs.current[item.id] = {};
                                                                    optionSpanRefs.current[item.id][index] = el;
                                                                    }}
                                                                    className="absolute w-full top-0 left-0 text-[16px] invisible whitespace-pre font-medium "
                                                                >
                                                                    {optionValues[item.id]?.[index] ?? opt.text}
                                                                </span>

                                                                <input
                                                                    type="text"
                                                                    value={optionValues[item.id]?.[index] ?? opt.text}
                                                                    ref={(el) => {
                                                                    if (!optionInputRefs.current[item.id]) optionInputRefs.current[item.id] = {};
                                                                    optionInputRefs.current[item.id][index] = el;
                                                                    }}
                                                                    onChange={(e) => {
                                                                    const val = e.target.value;

                                                                    setOptionValues((prev) => ({...prev,[item.id]: {...prev[item.id], [index]: val}}));
                                                                    setStatusFormName("Saving...");
                                                                    saveOptionTitle(item.id, opt.id, val);
                                                                    }}
                                                                    className="outline-none text-[16px] w-[400px] font-medium border-b border-[#aaa] bg-transparent"
                                                                />
                                                            </div>
                                                        </div>
                                                        <button onClick={() => handleDeleteOption(item.id, opt.id)} className="cursor-pointer">
                                                            <IoMdClose  className="text-[20px]"/>
                                                        </button>
                                                    </div>
                                                ))}
                                                <div onClick={() =>  addOption(item.id)} className="flex items-center gap-[10px]">
                                                    <div className="w-[15px] h-[15px] border-[1px] border-[#888] rounded-[3px]"></div>
                                                    <p  className="border-b-[1px] border-[#999] ">{t('addOption')}</p>
                                                </div>
                                            </div>}
                                        </div>
                                    )}
                                </Draggable>
                            ))}
                            {provided.placeholder}
                        </div>
                    )}
                </Droppable>
            </DragDropContext>}

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
            {!loadingAdd && <button onClick={handleAddQuestion} className="w-[100%] mb-[20px] h-[50px] flex items-center justify-center rounded-[10px] cursor-pointer bg-[#fff] dark:bg-gray-700 hover:bg-[#f6daff] transition-all duration-200">
                <IoAddSharp className="text-[25px] dark:text-[#fff]"/>
            </button>}
            {loadingAdd && <button  className="w-[100%] mb-[20px] h-[50px] flex items-center justify-center rounded-[10px] cursor-pointer bg-[#fff] hover:bg-[#f6daff] transition-all duration-200">
                <ClipLoader size={20} />
            </button>}
        </div>
    </div>
  )
}

export default AllQuestions