import { LoginForm } from "../components"

function LoginPage() {
  return (
    <div className='w-full min-h-[100vh] h-full flex justify-center items-center dark:bg-gray-600 pt-[100px] px-[20px]'>
      <div className='bg-[#fff] w-[400px] dark:bg-gray-700 px-[28px] py-[10px] rounded-[12px] shadow-2xl'>
        <LoginForm/>
      </div>
    </div>
  )
}

export default LoginPage