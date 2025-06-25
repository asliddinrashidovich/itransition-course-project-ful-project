import { RegisterForm } from "../components"

function RegisterPage() {
  return (
    <div className='w-full py-[100px] flex justify-center pt-[100px] items-center px-[20px]'>
      <div className='bg-[#fff] px-[28px] py-[48px] rounded-[12px] shadow-2xl '>
        <RegisterForm/>
      </div>
    </div>
  )
}

export default RegisterPage