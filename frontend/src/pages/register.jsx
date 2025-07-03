import { RegisterForm } from "../components"

function RegisterPage() {
  return (
    <div className='w-full min-h-[100vh] h-full py-[100px] flex justify-center pt-[100px] dark:bg-gray-600 items-center px-[20px]'>
      <div className='bg-[#fff] dark:bg-gray-700 w-[400px] px-[28px] py-[48px] rounded-[12px] shadow-2xl '>
        <RegisterForm/>
      </div>
    </div>
  )
}

export default RegisterPage