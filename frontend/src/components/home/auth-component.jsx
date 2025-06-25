import { Link } from "react-router-dom"

function AuthComponent() {
  return (
    <>
        <div className="hidden md:flex gap-[7px] items-center">
              <Link to={'/login'} className="border-[1px] border-[#461773] text-[#461773] rounded-[30px] cursor-pointer px-[20px] py-[5px]">
                Login
              </Link>
              <Link to={'/register'} className=" bg-[#461773] text-[#fff] rounded-[30px] cursor-pointer px-[20px] py-[5px]">
                Register
              </Link>
        </div>
    </>
  )
}

export default AuthComponent