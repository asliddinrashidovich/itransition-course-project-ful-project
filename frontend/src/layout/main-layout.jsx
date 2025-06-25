import { Outlet } from "react-router-dom"
import { Header } from "../components"
import { Toaster } from "react-hot-toast"

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
    </>
  )
}

export default MainLayout