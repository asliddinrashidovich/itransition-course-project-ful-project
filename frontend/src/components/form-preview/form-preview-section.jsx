import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom"
import toast from "react-hot-toast";
import { Modal } from "antd";
import { MdOutlineClose } from "react-icons/md";
import { ClipLoader } from "react-spinners";
import AnswerCardsSkeleton from "../skeleton/answer-cards-skeleton";

const API = import.meta.env.VITE_API

function FormPreviewSection() {
  const navigate = useNavigate()
  const {id} = useParams()
  const token = localStorage.getItem('token')
  const user = JSON.parse(localStorage.getItem('user'))
  const [answers, setAnswers] = useState({});
  const responderEmail = user?.email
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [refreshResults, setRefreshResults] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(token ? false : true);
  const [loadingSubmit, setLoadingSubmit] = useState(false)
  


  const handleCancel = () => {
      setIsModalOpen(false);
  };
  const handleOk = () => {
      navigate("/login");
  };

  // get questions
  const fetchFormTemplete = async () => {
      const res = await axios.get(`${API}/api/templates/${id}`, {
          headers: {
              Authorization: `Bearer ${token}`
          }
      });
      return res.data
  };
  const { data: FormTemplate, isLoading: loading} = useQuery({
      queryKey: ["latest-template-answer", refreshResults],
      queryFn: fetchFormTemplete,
  });


  // get template answers
  const fetchAnswersTemplete = async () => {
    try {
      const res = await axios.get(`${API}/api/answers/template/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
      })
      const allResponces = res.data
      const myAnswer = allResponces.filter(respon => respon.responderEmail == user?.email)
      return myAnswer
    } 
    catch(err) {
      toast.error(err.response?.data?.message || "Something went wrong");
    }
  };
  const { data: TemplateAnswers} = useQuery({
      queryKey: ["answers-template-for-form", refreshResults],
      queryFn: fetchAnswersTemplete,
  });

    const fetchFormTempleteQuestions = async () => {
        const res = await axios.get(`${API}/api/templates/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return res.data.questions
    };
    const { data: FormTemplateQuestions} = useQuery({
        queryKey: ["latest-templates-for-find"],
        queryFn: fetchFormTempleteQuestions,
    });

  // submit answers
  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoadingSubmit(true)

    const formattedAnswers = Object.entries(answers).map(([questionId, value]) => ({
      questionId,
      value,
    }));

    try {
      await axios.post(`${API}/api/answers`, {
        templateId: id,
        responderEmail, 
        answers: formattedAnswers,
      });

      toast.success("Form successfully submitted!");
      setIsSubmitted(true)
      setLoadingSubmit(false)
      setRefreshResults(prev => !prev)
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong");
    }
  };

  // handle Click to the auth
  function handleClickToAuth(path) {
    localStorage.removeItem("user")
    localStorage.removeItem("token")
    navigate(path)
    localStorage.setItem("isFromUserId", id)
  }

  return (
    <div className="bg-[#f0ebf8] dark:bg-gray-900 min-h-[100vh] pt-[60px]"> 
      {!isSubmitted && <form onSubmit={handleSubmit} className="max-w-[700px] mx-auto flex flex-col gap-[20px]">
        <div className="w-full bg-[#fff] border-t-[10px] border-[#7248b9] rounded-[10px] py-[20px] px-[20px]">
            {token && <div>
              <h2 className="text-[40px]">{FormTemplate?.formTitle}</h2>
              <hr className="border-[#999] my-[10px]"/>
              <p className="text-[16px] text-[#555]">{FormTemplate?.description ? FormTemplate?.description : "Form Description"}</p>
              <hr className="border-[#999] my-[10px]"/>
            </div>}
            <div className="mt-[30px]">
                {token && <h3 className="font-[700]">{responderEmail} <span  className="font-[400] cursor-pointer text-[#1ec8fb]" onClick={() => handleClickToAuth("/login")}>Switch account</span></h3>}
                {!token && <p>❗ You have not authorized yet. PLease <span onClick={() => handleClickToAuth("/login")} className="text-[#4949c2] cursor-pointer">Register</span> or <span onClick={() => handleClickToAuth("/register")} className="text-[#4949c2] cursor-pointer">Login</span></p>}
            </div>
            <Modal
              title="Login is required"
              closable={{ 'aria-label': 'Custom Close Button' }}
              open={isModalOpen}
              onOk={handleOk}
              okText={"Login"}
              footer={null}
              onCancel={handleCancel}
          >
            <p>❗ You have not authorized yet. You need to register or login to fill out the form.</p>
            <div className="flex items-center gap-[10px] mt-[20px]">
              <button onClick={() => handleClickToAuth("/login")} className="py-[5px] px-[10px] bg-[#7248b9] text-[#fff] rounded-[20px] cursor-pointer ">Login</button>
              <button onClick={() => handleClickToAuth("/register")}  className="py-[5px] px-[10px] bg-[#7248b9] text-[#fff] rounded-[20px] cursor-pointer ">Register</button>
            </div>
          </Modal>
        </div>
        <div>
          <div className="flex flex-col gap-[20px]">
            {FormTemplate?.questions.map(item => (
              <div className="w-full bg-[#fff] border-[1px] border-[#dedede] rounded-[10px] p-[20px]">
                  <h5 className="text-[20px] mb-[25px]">{item.title}  </h5>
                  {item.type == "number" && <input required type="number" className="border-b-[2px] focus:border-[#7248b9] border-[#dedede] outline-none" placeholder="Your answer" onChange={(e) => setAnswers(prev => ({...prev, [item.id]: e.target.value}))}/>}
                  {item.type == "short_text" && <input required type="text" className="border-b-[2px] focus:border-[#7248b9] border-[#dedede] outline-none" placeholder="Your answer" onChange={(e) => setAnswers(prev => ({...prev, [item.id]: e.target.value}))}/>}
                  {item.type == "paragraph" && <textarea rows={5} className="w-full p-[5px] border-[1px] rounded-[5px] focus:border-[#7248b9] border-[#dedede] outline-none" placeholder="Your answer" onChange={(e) => setAnswers(prev => ({...prev, [item.id]: e.target.value}))}></textarea>}
                  {item.type == "checkbox" && (
                    <div className="flex flex-col gap-[5px]">
                      {item.options.map(opt => (
                        <label className="cursor-pointer flex gap-[5px]" htmlFor={opt.id}>
                          <input id={opt.id} type="checkbox" checked={answers[item.id]?.includes(opt.text) || false}
                            onChange={(e) => {
                              setAnswers(prev => {
                                const currentAnswers = prev[item.id] || [];
                                if (e.target.checked) {
                                  return {
                                    ...prev,
                                    [item.id]: [...currentAnswers, opt.text],
                                  };
                                } else {
                                  return {
                                    ...prev,
                                    [item.id]: currentAnswers.filter(val => val !== opt.text),
                                  };
                                }
                              });
                            }}/>
                          <span>{opt.text}</span>
                        </label>
                      ))}
                    </div>
                  )}
              </div>
            ))}
            {!loading && Array.isArray(FormTemplate?.questions) && !FormTemplate?.questions?.length &&   (
                <div className="w-full bg-[#fff] rounded-[10px] py-[20px] px-[20px] text-center">
                    No Questions
                </div>
            )}
            {loading && ( 
                <div>
                    <AnswerCardsSkeleton/>
                </div>
            )}
          </div>
          {token && <div className="text-center mt-[30px]">
            {!loadingSubmit && <button className="text-[18px] text-[#fff] font-[600] bg-[#7248b9] py-[5px] cursor-pointer text-center w-full rounded-[7px]">Submit</button>}
             {loadingSubmit && <button type="button" className="text-[18px] text-[#fff] font-[600] bg-[#7248b9] py-[5px] cursor-pointer text-center w-full rounded-[7px]"><ClipLoader size={20} /></button>}
          </div>}
        </div>
        <div onClick={() => navigate("/")} className="flex cursor-pointer items-center justify-center my-[30px] gap-[20px]">
          <img src="https://easi.its.utoronto.ca/wp-content/uploads/2019/12/1024px-Microsoft_Forms_2019-present.svg-e1576870389646.png" alt="logo" className="w-[50px]"/>
          <h3 className="text-[20px] ">Itransition Course Project </h3>
        </div>
      </form>}
      {isSubmitted && <div className="max-w-[700px] mx-auto flex flex-col gap-[20px]">
          <div className="w-full bg-[#fff] border-t-[10px] border-[#7248b9] rounded-[10px] py-[20px] px-[20px]">
              <h2 className="text-[40px]">{FormTemplate?.formTitle}</h2>
              <p className="text-[16px] text-[#555] my-[10px]">Your response has been recorded.</p>
              <p onClick={() => window.location.reload()} className="text-[#0073ff] underline cursor-pointer mb-[10px]">Submit another response</p>
              {!showResults &&  <button onClick={() => setShowResults(true)} className="p-[5px] rounded-[5px] bg-[#8ad0f9] cursor-pointer">My results</button>}
              {showResults && <div className="p-[5px] rounded-[5px] bg-[#8ad0f9] cursor-pointer">
                  <div className="flex items-center justify-between my-[10px]">
                    <h5>My Responce</h5>
                    <button onClick={() => setShowResults(false)} className="cursor-pointer"><MdOutlineClose/></button>
                  </div>
                  {TemplateAnswers.map((item) => (
                      <div key={item.responderEmail} className="w-full bg-[#fff] rounded-[10px] py-[20px] px-[20px]">
                        <div className="flex items-center justify-between">
                            <h2 className="text-[22px] font-[600]">Responder Email: <span className="text-[18px] font-[300] ml-[10px]">{item.responderEmail}</span></h2>
                            <p className="text-[12px] mb-[10px]">{item.answers.length} responses</p>
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
          </div>
          <div onClick={() => navigate("/")} className="flex cursor-pointer items-center justify-center my-[30px] gap-[20px]">
            <img src="https://easi.its.utoronto.ca/wp-content/uploads/2019/12/1024px-Microsoft_Forms_2019-present.svg-e1576870389646.png" alt="logo" className="w-[50px]"/>
            <h3 className="text-[20px]">Itransition Course Project </h3>
          </div>
      </div>}
    </div>
  )
}

export default FormPreviewSection