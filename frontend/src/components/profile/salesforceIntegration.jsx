import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { ClipLoader } from "react-spinners";

const API = import.meta.env.VITE_API;

function SalesforceIntegration() {
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [company, setCompany] = useState('')
  const [loadingAdd, setLoadingAdd] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoadingAdd(true)
    try {
      await axios.post(`${API}/api/salesforce/sync`, {firstName, lastName, email, company});
      toast.success("Successfully sent to salesforce");
      setLoadingAdd(false)
      setFirstName('')
      setLastName('')
      setEmail('')
      setCompany('')
    } catch (err) {
      toast.error(err.response?.data?.error || "Error");
    }
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <hr className="mt-[50px]"/>
      <h2 className="text-[25px] font-[600]">Create an acoount in Salesforce</h2>
      <input className="w-full border-[1px] rounded-[6px] p-[5px]" required name="firstName" placeholder="First Name" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
      <input className="w-full border-[1px] rounded-[6px] p-[5px]" required name="lastName" placeholder="Last Name" value={lastName} onChange={(e) => setLastName(e.target.value)} />
      <input className="w-full border-[1px] rounded-[6px] p-[5px]" required name="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <input className="w-full border-[1px] rounded-[6px] p-[5px]" required name="company" placeholder="Company" value={company} onChange={(e) => setCompany(e.target.value)} />
      {!loadingAdd && <button className="w-full bg-[blue] text-[#fff] rounded-[6px] p-[7px]" type="submit">Submit</button>}
      {loadingAdd && <button type="button" className="w-full bg-[blue] text-[#fff] rounded-[6px] p-[7px]"><ClipLoader size={20} /></button>}
    </form>
  )
}

export default SalesforceIntegration;
