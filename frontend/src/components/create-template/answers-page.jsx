import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useState } from "react";
import { FaTableCellsLarge, FaTableList } from "react-icons/fa6";
import { useParams } from "react-router-dom";
import AnswersTableView from "./answers-table-view";
import AnswerCardsSkeleton from "../skeleton/answer-cards-skeleton";
import { useTranslation } from "react-i18next";

const API = import.meta.env.VITE_API

function AnswersPage() {
    const {id} = useParams()
    const {t} = useTranslation()
    const token = localStorage.getItem('token')
    const [cardsView, setCardsView] = useState(false)


    // get questions
    const fetchFormTemplete = async () => {
        const res = await axios.get(`${API}/api/templates/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return res.data.questions
    };
    const { data: FormTemplateQuestions, isLoading: loading1} = useQuery({
        queryKey: ["latest-templates-for-find"],
        queryFn: fetchFormTemplete,
    });

    // get template answers
    const fetchAnswersTemplete = async () => {
        const res = await axios.get(`${API}/api/answers/template/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return res.data
    };
    const { data: TemplateAnswers, isLoading: loading2} = useQuery({
        queryKey: ["answers-template"],
        queryFn: fetchAnswersTemplete,
    });

    console.log(TemplateAnswers)

    // handle change answer type
    function handleChangeButtonType(caseView) {
        setCardsView(caseView)
    }
  return (
    <div className="max-w-[800px] mx-auto mt-[70px] flex flex-col gap-[20px] pb-[100px]">
        <div className="w-full bg-[#fff] border-t-[10px] border-[#7248b9] flex items-center justify-between  rounded-[10px] py-[20px] px-[20px]">
            <h2 className="text-[35px] font-[600] py-[10px]">{TemplateAnswers?.length} {t('responces')}</h2>
            <div>
                {!cardsView && <button onClick={() => handleChangeButtonType(true)} className="cursor-pointer"><FaTableList  className="text-[20px]"/></button>}
                {cardsView && <button onClick={() => handleChangeButtonType(false)} className="cursor-pointer"><FaTableCellsLarge className="text-[20px]"/></button>}
            </div>
        </div>
        {!cardsView && <div className="flex flex-col gap-[20px]">    
            {TemplateAnswers?.map(item => (
                <div key={item.responderEmail} className="w-full bg-[#fff] rounded-[10px] py-[20px] px-[20px]">
                    <div className="flex items-center justify-between">
                        <h2 className="text-[22px] font-[600]">Responder Email: <span className="text-[18px] font-[300] ml-[10px]">{item.responderEmail}</span></h2>
                        <p className="text-[12px] mb-[10px]">{item.answers.length} {t('responces')}</p>
                    </div>
                    <hr className="mb-[20px] border-[#999]"/>
                    {item.answers.map(itemAnswer => (
                        <div key={itemAnswer.questionId}>
                            <h3 className="text-[18px] font-[700] py-[10px]   w-full border-[#999]">{FormTemplateQuestions?.filter(questionTitle => questionTitle.id == itemAnswer.questionId)[0]?.title} ?</h3>
                            <div className="bg-[#e6f2ff] cursor-pointer hover:bg-[#4c6279] hover:text-[#fff] transition-all duration-200 rounded-[10px] p-[10px] mb-[6px] w-full ">
                                {Array.isArray(itemAnswer.value)
                                    ? itemAnswer.value.map((opt, idx) => (
                                        <div key={idx}>{opt}</div>  
                                    ))
                                    : itemAnswer.value
                                }
                            </div>
                        </div>
                    ))}
                </div>
            ))}
        </div>}
        {!loading1 && Array.isArray(TemplateAnswers) && !TemplateAnswers?.length &&   (
            <div className="w-full bg-[#fff] rounded-[10px] py-[20px] px-[20px] text-center">
                {t('noResponces')}
            </div>
        )}
        {loading1 && loading2 && ( 
            <div>
                <AnswerCardsSkeleton/>
            </div>
        )}
        {cardsView &&  <AnswersTableView TemplateAnswers={TemplateAnswers} FormTemplateQuestions={FormTemplateQuestions}/>}
    </div>
  )
}

export default AnswersPage