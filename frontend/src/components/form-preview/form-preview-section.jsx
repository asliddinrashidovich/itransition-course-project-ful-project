import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom"
import toast from "react-hot-toast";

const API = import.meta.env.VITE_API

function FormPreviewSection() {
  const navigate = useNavigate()
  const {id} = useParams()
  const token = localStorage.getItem('token')
  const [answers, setAnswers] = useState({});
  const [responderEmail, setResponderEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);


  // get questions
  const fetchFormTemplete = async () => {
      const res = await axios.get(`${API}/api/templates/${id}`, {
          headers: {
              Authorization: `Bearer ${token}`
          }
      });
      return res.data
  };
  const { data: FormTemplate} = useQuery({
      queryKey: ["latest-template-answer"],
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
  const { data: TemplateAnswers} = useQuery({
      queryKey: ["answers-template-for-form"],
      queryFn: fetchAnswersTemplete,
  });

  console.log(TemplateAnswers)


  // submit answers
  const handleSubmit = async (e) => {
    e.preventDefault()
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
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong");
    }
  };

  console.log(FormTemplate)
  return (
    <div className="bg-[#f0ebf8] min-h-[100vh] pt-[60px]"> 
      {!isSubmitted && <form onSubmit={handleSubmit} className="max-w-[700px] mx-auto flex flex-col gap-[20px]">
        <div className="w-full bg-[#fff] border-t-[10px] border-[#7248b9] rounded-[10px] py-[20px] px-[20px]">
            <h2 className="text-[40px]">{FormTemplate?.formTitle}</h2>
            <hr className="border-[#999] my-[10px]"/>
            <p className="text-[16px] text-[#555]">{FormTemplate?.description ? FormTemplate?.description : "Form Description"}</p>
            <hr className="border-[#999] my-[10px]"/>
            <div className="mt-[30px]">
                <input  required value={responderEmail} type="email" className="border-b-[2px] focus:border-[#7248b9] border-[#dedede] outline-none w-full" placeholder="Responder Email" onChange={(e) => setResponderEmail(e.target.value)}/>
            </div>
        </div>
        <div>
          <div className="flex flex-col gap-[20px]">
            {FormTemplate?.questions.map(item => (
              <div className="w-full bg-[#fff] border-[1px] border-[#dedede] rounded-[10px] p-[20px]">
                  <h5 className="text-[20px] mb-[25px]">{item.title} <span className="text-[#fe2b2b]">*</span></h5>
                  <input type="text" className="border-b-[2px] focus:border-[#7248b9] border-[#dedede] outline-none" placeholder="Your answer" onChange={(e) => setAnswers(prev => ({...prev, [item.id]: e.target.value}))}/>
              </div>
            ))}
          </div>
          <div className="text-center">
            <button className="text-[18px] text-[#fff] font-[600] bg-[#7248b9] py-[5px] cursor-pointer text-center w-full rounded-[7px]">Submit</button>
          </div>
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
              <span onClick={() => window.location.reload()} className="text-[#0073ff] underline cursor-pointer">Submit another response</span>
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