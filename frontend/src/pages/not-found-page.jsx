import { Link } from "react-router-dom"

function NotFoundPage() {
   return (
    <div className="text-center animate-fadeIn h-[100vh] flex items-center justify-center flex-col">
        <img src="https://yemca-services.net/404.png" alt="404 Illustration" className="mx-auto w-80 animate-[float_3s_infinite] shadow-xl rounded-lg" /> 
        <h1 className="text-7xl font-extrabold text-blue-700 mt-6">Looks Like You are Lost!</h1>
        <p className="text-xl text-gray-700 mt-2">We cannot seem to find the page you are looking for.</p>
        <Link to={'/'} className="mt-6 inline-block bg-blue-600 text-white px-8 py-3 rounded-full text-lg font-semibold shadow-lg transform transition hover:scale-105 hover:bg-blue-700">Return home</Link>
    </div>
  )
}

export default NotFoundPage