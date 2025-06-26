import { Outlet } from "react-router-dom"
import { Toaster } from "react-hot-toast"

function FormLayout() {
  return (
    <>
      <Toaster
        position="top-right"
        reverseOrder={false}
      />
      <div>
        <Outlet/>  
      </div>
    </>
  )
}

export default FormLayout