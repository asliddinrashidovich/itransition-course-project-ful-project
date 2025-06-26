import { FaRegTrashAlt } from "react-icons/fa";
import { Checkbox, Switch } from 'antd';
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { IoAddSharp } from "react-icons/io5";
import toast from "react-hot-toast";
import debounce from "lodash.debounce";

const API = import.meta.env.VITE_API

function AllQuestions({setStatusFormName}) {
    const [refreshQuestions, setRefreshQuestions] = useState(false)
    const {id} = useParams()
    const token = localStorage.getItem('token')
    const onChange = (checked) => {
        console.log(`switch to ${checked}`);
    };

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

    // get template details
    const fetchLatestTemplete = async () => {
        const res = await axios.get(`${API}/api/templates/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return res.data
    };
    const { data: LatestTemplate} = useQuery({
        queryKey: ["latest-templatee1", refreshQuestions],
        queryFn: fetchLatestTemplete,
    });

    async function handleAddQuestion() {
         await axios.post(`${API}/api/templates/${id}/questions`, {}, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }).then((res) => {
            console.log(res)
            setRefreshQuestions(prev => prev ? false : true)
        }).catch((err) => {
            toast.error(err.response?.data?.message || "Something went wrong");
        })
    }

    const onChangeCheckbox = e => {
        console.log(`checked = ${e.target.checked}`);
    };
    

    console.log(LatestTemplate)

    // handlechange title
    const [questionTitles, setQuestionTitles] = useState({});

    console.log(questionTitles)
    
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
        <div className="absolute right-[-100px]">
            <button onClick={handleAddQuestion} className="w-[50px] h-[50px] flex items-center justify-center rounded-[10px] cursor-pointer bg-[#fff] ">
                <IoAddSharp className="text-[25px]"/>
            </button>
        </div>
        <div className="flex flex-col gap-[20px] mb-[70px]">
            {LatestTemplate?.questions?.map(item => (
                <div key={item.id} className="w-full bg-[#fff] border-l-[7px] border-[#0048ff] rounded-[10px] py-[30px] px-[20px]">
                    <div className="flex items-center justify-between">
                        {/* <h2 className="text-[18px] font-[600] py-[10px] border-b-[1px] w-full border-[#999] max-w-[60%]">Question</h2> */}
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
                                className="outline-none text-[18px] font-[600] border-b-[1px] border-[#999] w-full"
                            />
                        </div>
                        <select value={item.type} onChange={(e) => handleChangeQuestionType(e.target.value, item.id)} name="type_question" id="type_question" className="border-[1px] border-[#999] text-[#999] rounded-[4px] cursor-pointer px-[10px] py-[5px]">
                            <option value="short_text">Short Text</option>
                            <option value="paragraph">Paragraph</option>
                            <option value="number">Number</option>
                            <option value="checkbox">Checkbox</option>
                        </select>
                    </div>
                    {item.type == 'short_text' && <p className="pt-[20px] text-[#999] pb-[10px] border-b-[1px] border-[#999] w-[50%]">Short answer text</p>}
                    {item.type == "paragraph" && <p className="pt-[20px] text-[#999] pb-[10px] border-b-[1px] border-[#999] w-[65%]">Long answer text</p>}
                    {item.type == "number" && <p className="pt-[20px] text-[#999] pb-[10px] border-b-[1px] border-[#999] w-[25%]">Number answer</p>}
                    {item.type == "checkbox" && <div className="pt-[20px] text-[#999] pb-[10px] border-b-[1px] border-[#999] w-[30%]">
                        <Checkbox onChange={onChangeCheckbox}>Option 1</Checkbox>
                    </div>}
                    <hr className="border-[1px] mt-[40px] border-[#999]"/>
                    <div className="flex items-center pt-[20px] justify-between">
                        <div></div>
                        <div className="flex gap-[20px] items-center">
                            <button><FaRegTrashAlt  className="text-[#999] text-[20px] cursor-pointer"/></button>
                            <div className="flex gap-[10px] items-center">
                                <p>Required</p>
                                <Switch defaultChecked onChange={onChange} />
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    </div>
  )
}

export default AllQuestions