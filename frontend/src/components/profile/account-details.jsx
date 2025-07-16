import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useTranslation } from "react-i18next";
import SalesforceIntegration from "./salesforceIntegration";

const API = import.meta.env.VITE_API

function AccountDetails() {
    const token = localStorage.getItem('token')
    const {t} = useTranslation()
    
    // get my data
    const fetchMyData = async () => {
        const res = await axios.get(`${API}/api/users/me`, {
            headers: {Authorization: `Bearer ${token}`}
        });
        return res.data
    };
    const { data: myData} = useQuery({
        queryKey: ["my-data"],
        queryFn: fetchMyData,
    });

    console.log(myData)
  return (
    <div className="px-5 md:px-10 py-[20px]">
      <div className="">
        <h2 className="text-[30px] font-[600] mb-[20px] dark:text-[#fff]">{t('myAccount')}</h2>
        <hr />
        <h4 className="text-[20px] font-[500] mt-[10px] dark:text-[#fff]">{t('email')}: <span className="font-[300] ml-[20px]">{myData?.email}</span></h4>
        <h4 className="text-[20px] font-[500] dark:text-[#fff]">{t('userRole')}: <span className="font-[300] ml-[20px]">{myData?.isAdmin ? "admin" : "user"}</span></h4>
      </div>
      <SalesforceIntegration/>
    </div>
  )
}

export default AccountDetails