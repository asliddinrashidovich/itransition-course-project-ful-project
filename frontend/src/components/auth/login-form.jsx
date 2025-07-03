import { Button, Form, Input } from 'antd';
import { FaFacebook, FaGoogle } from "react-icons/fa";
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { signInWithGoogle } from '../../../firebase';
import { useTranslation } from 'react-i18next';

const API = import.meta.env.VITE_API

function LoginForm() {
  const navigate = useNavigate()
  const isFromUserId = localStorage.getItem('isFromUserId')
  const {t} = useTranslation()

  // login
  const postLogin = async (values) => {
    const {email, password} = values
    await axios.post(`${API}/api/auth/login`, {password, email}).then((res) => {
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
    
    const handleLoginGoogle = async () => {
      try {
        const res = await signInWithGoogle();
        const idToken = await res.user.getIdToken(); 
        
        const response = await axios.post(`${API}/api/auth/google`, { idToken });
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

  return (
  <Form
    name="basic"
    style={{ width: '100%'}}
    onFinish={postLogin}
    autoComplete="off"
    initialValues={{
        email: "",
        password: ""
    }}
  >
    <h2 className='text-[25px] text-center leading-[16px] font-[600] mb-[19px] dark:text-[#fff]'>{t('Login')}</h2>

    <Form.Item
      name="email"
      style={{width: '100%'}} 
      rules={[{ required: true, message: 'Please enter your email!'}]}
    >
      <Input placeholder={t('enterYourEmail')} type='email'/>
    </Form.Item>

    <Form.Item
      name="password"
      rules={[{ required: true, message: 'Please enter your password!' }]}
    >
      <Input type={"password"}  placeholder={t('enterYourPassword')}/>
    </Form.Item>

    <Form.Item label={null}>
      <Button 
        onSubmit={postLogin}
        htmlType="submit"
        style={{
          width: '100%',
          backgroundColor: '#7248b9',
          color: 'white',
          border: 'none',
          padding: '16px 0',
          marginBottom: '27px'
        }}
      >
        {t('Login')}
      </Button>
    </Form.Item>

    <h2 className='text-center text-[#3D3D3D] text-[13px] font-[400] leading-[16px] dark:text-[#fff] mb-[27px]'>{t('noAccount')}<Link to={"/register"} className='text-[#6b6bff] cursor-pointer lowercase'>{t('Register')}</Link></h2>
    <h2 className='text-center text-[#3D3D3D] text-[13px] font-[400] leading-[16px] dark:text-[#fff] mb-[27px]'>{t('orLoginWith')}</h2>
    <Button onClick={handleLoginGoogle} className='mb-[20px] flex gap-[10px] items-center border-[#EAEAEA] border-[1px] rounded-[5px] w-full py-[10px] justify-center cursor-pointer'>
      <FaGoogle />
      <span>{t('continueGoogle')}</span>
    </Button>
  </Form>
  )
};
export default LoginForm;