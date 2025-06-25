import { LoginForm } from "../components"

function LoginPage() {
  return (
    <div className='w-full h-[100vh] flex justify-center items-center pt-[100px] px-[20px]'>
      <div className='bg-[#fff] px-[28px] py-[10px] rounded-[12px] shadow-2xl'>
        <LoginForm/>
      </div>
    </div>
  )
}

export default LoginPage