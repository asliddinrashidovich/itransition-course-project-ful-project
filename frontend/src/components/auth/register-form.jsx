import { Button, Form, Input } from 'antd';
import axios, { AxiosError } from 'axios';
import toast from 'react-hot-toast';
import { FaFacebook, FaGoogle } from "react-icons/fa";
import { Link, useNavigate } from 'react-router-dom';
import { signInWithGoogle } from '../../../firebase';
import { useTranslation } from 'react-i18next';

const API = import.meta.env.VITE_API

function RegisterForm() {
    const navigate = useNavigate()
    const {t} = useTranslation()
    const isFromUserId = localStorage.getItem('isFromUserId')
      
    const postRegister = async (values) => {  
      const {name, email, password} = values
      
      await axios.post(`${API}/api/auth/register`, {name, password, email}).then((res) => {
          localStorage.setItem('token', res.data.token)
          localStorage.setItem('user', JSON.stringify(res.data.user))
          if(isFromUserId) {
            navigate(`/form/${isFromUserId}`)
            localStorage.removeItem('isFromUserId')
          } else {
            navigate("/")
            window.location.reload()
          }
        }).catch((err) => {
          toast.error(err.response?.data?.message || "Something went wrong");
        })
      };
      
    const handleSignupGoogle = async () => {
      try {
        const res = await signInWithGoogle();
        const idToken = await res.user.getIdToken();
        
        const response = await axios.post(`${API}/api/auth/signup/google`, { idToken },
          { headers: { 'Content-Type': 'application/json' } }
        );
        
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        if(isFromUserId) {
          navigate(`/form/${isFromUserId}`)
          localStorage.removeItem('isFromUserId')
        } else {
          navigate("/")
          window.location.reload()
        }
      } catch (err) {
        toast.error(err.response?.data?.message || "Something went wrong");
      }
    };
      
  return  (
    <Form
      name="basic"
      style={{ width: '100%'}}
      initialValues={{
        name: "",
        email: "",
        password: "",
      }}
      onFinish={postRegister}
      autoComplete="off"
    >
      <h2 className='text-[25px] text-center leading-[16px] font-[600] mb-[19px] dark:text-[#fff]'>{t('Register')}</h2>

      <Form.Item
        name="name"
        style={{width: '100%'}} 
        rules={[{ required: true, message: 'Please enter your name!'}]}
      >
        <Input placeholder={t('enterYourName')} />
      </Form.Item>


      <Form.Item
        name="email"
        rules={[{ required: true, message: 'Please enter your email!' }]}
      >
        <Input placeholder={t('enterYourEmail')} type='email'/>
      </Form.Item>

      <Form.Item
        name="password"
        rules={[{ required: true, message: 'Please enter your password!' }]}
      >
        <Input type={"password"} placeholder={t('enterYourPassword')}/>
      </Form.Item>

      <Form.Item label={null}>
        <Button 
          htmlType="submit"
          style={{
            width: '100%',
            backgroundColor: '#7248b9',
            color: 'white',
            border: 'none',
            padding: '16px 0',
            marginBottom: "27px"
          }}
        >
          {t('Register')}
        </Button>
      </Form.Item>
      <h2 className='text-center text-[#3D3D3D] dark:text-[#fff] text-[13px] font-[400] leading-[16px] mb-[27px]'>{t('AlreadyAccount')}, <Link to={"/login"} className='text-[#6b6bff] cursor-pointer lowercase'>{t('Login')}</Link></h2>
      <h2 className='text-center text-[#3D3D3D] dark:text-[#fff] text-[13px] font-[400] leading-[16px] mb-[27px]'>{t('orRegisterWith')}</h2>
      <Button onClick={handleSignupGoogle} className='mb-[20px] flex gap-[10px] items-center border-[#EAEAEA] border-[1px] rounded-[5px] w-full py-[10px] justify-center cursor-pointer'>
        <FaGoogle />
        <span>{t('continueGoogle')}</span>
      </Button>
    </Form>
)};
export default RegisterForm;