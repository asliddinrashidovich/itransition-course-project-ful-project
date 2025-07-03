function NotFound({children}) {
  return (
    <div className="flex justify-center mt-[50px]">
        <div className="flex flex-col items-center">
            <h2 className="mt-[20px] text-[17px] font-[600] dark:text-[#fff]">{children}</h2>
        </div>
    </div>
  )
}

export default NotFound