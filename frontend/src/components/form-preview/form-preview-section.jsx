import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom"
import toast from "react-hot-toast";
import { Modal } from "antd";

const API = import.meta.env.VITE_API

function FormPreviewSection() {
  const navigate = useNavigate()
  const {id} = useParams()
  const token = localStorage.getItem('token')
  const user = JSON.parse(localStorage.getItem('user'))
  const [answers, setAnswers] = useState({});
  const responderEmail = user?.email
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(token ? false : true);


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

  // handle Click to the auth
  function handleClickToAuth(path) {
    navigate(path)
    localStorage.setItem("isFromUserId", id)
  }

  console.log(FormTemplate)
  return (
    <div className="bg-[#f0ebf8] min-h-[100vh] pt-[60px]"> 
      {!isSubmitted && <form onSubmit={handleSubmit} className="max-w-[700px] mx-auto flex flex-col gap-[20px]">
        <div className="w-full bg-[#fff] border-t-[10px] border-[#7248b9] rounded-[10px] py-[20px] px-[20px]">
            {token && <div>
              <h2 className="text-[40px]">{FormTemplate?.formTitle}</h2>
              <hr className="border-[#999] my-[10px]"/>
              <p className="text-[16px] text-[#555]">{FormTemplate?.description ? FormTemplate?.description : "Form Description"}</p>
              <hr className="border-[#999] my-[10px]"/>
            </div>}
            <div className="mt-[30px]">
                {token && <h3 className="font-[700]">{responderEmail}</h3>}
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
                  <input required type="text" className="border-b-[2px] focus:border-[#7248b9] border-[#dedede] outline-none" placeholder="Your answer" onChange={(e) => setAnswers(prev => ({...prev, [item.id]: e.target.value}))}/>
              </div>
            ))}
          </div>
          {token && <div className="text-center mt-[30px]">
            <button className="text-[18px] text-[#fff] font-[600] bg-[#7248b9] py-[5px] cursor-pointer text-center w-full rounded-[7px]">Submit</button>
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