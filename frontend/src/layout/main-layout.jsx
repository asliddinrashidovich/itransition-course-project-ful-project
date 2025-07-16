import { Outlet } from "react-router-dom"
import { Header } from "../components"
import { Toaster } from "react-hot-toast"
import PowerAutomate from "../components/create-template/power-automate"

function MainLayout() {
  return (
    <>
      <Toaster
        position="top-right"
        reverseOrder={false}
      />
      <Header/>
      <div>
        <Outlet/>  
      </div>
      <div className="fixed bottom-[30px] right-[30px] w-[60px] h-[60px] rounded-[50%] flex items-center justify-center bg-[#818c90] shadow-xl cursor-pointer">
        <PowerAutomate/>
      </div>
    </>
  )
}

export default MainLayout