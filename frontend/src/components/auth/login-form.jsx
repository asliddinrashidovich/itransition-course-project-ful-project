import { Button, Form, Input } from 'antd';
import { FaFacebook, FaGoogle } from "react-icons/fa";
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';

const API = import.meta.env.VITE_API

function LoginForm() {
  const navigate = useNavigate()
  const postLogin = async (values) => {
    const {email, password} = values
    await axios.post(`${API}/api/auth/login`, {password, email}).then((res) => {
        localStorage.setItem('token', res.data.token)
        localStorage.setItem('user', JSON.stringify(res.data.user))
        navigate("/")
        window.location.reload()
      }).catch((err) => {
        toast.error(err.response?.data?.message || "Something went wrong");
      })
  };

  const handleLoginGoogle = async () => {
  }
  
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
    <h2 className='text-[25px] text-center leading-[16px] font-[600] mb-[19px]'>Login</h2>

    <Form.Item
      name="email"
      style={{width: '100%'}} 
      rules={[{ required: true, message: 'Please enter your email!'}]}
    >
      <Input placeholder='Enter your email' type='email'/>
    </Form.Item>

    <Form.Item
      name="password"
      rules={[{ required: true, message: 'Please enter your password!' }]}
    >
      <Input type={"password"}  placeholder='Enter your password'/>
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
        Login
      </Button>
    </Form.Item>

    <h2 className='text-center text-[#3D3D3D] text-[13px] font-[400] leading-[16px] mb-[27px]'>Don't have an account, <Link to={"/register"} className='text-[#6b6bff] cursor-pointer'>register</Link></h2>
    <h2 className='text-center text-[#3D3D3D] text-[13px] font-[400] leading-[16px] mb-[27px]'>Or login with</h2>
    <Button onClick={handleLoginGoogle} className='mb-[20px] flex gap-[10px] items-center border-[#EAEAEA] border-[1px] rounded-[5px] w-full py-[10px] justify-center cursor-pointer'>
      <FaGoogle />
      <span>Login with Google</span>
    </Button>
    <Button className='mb-[20px] flex gap-[10px] items-center border-[#EAEAEA] border-[1px] rounded-[5px] w-full py-[10px] justify-center cursor-pointer'>
      <FaFacebook />
      <span>Login with Facebook</span>
    </Button>
  </Form>
  )
};
export default LoginForm;