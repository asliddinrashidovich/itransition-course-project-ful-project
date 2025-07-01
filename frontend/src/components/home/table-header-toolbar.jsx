import { useQueryClient, useMutation } from "@tanstack/react-query";
import axios from "axios";
import toast from "react-hot-toast";
import { FaRegTrashCan } from "react-icons/fa6"


const API = import.meta.env.VITE_API;

function TableHeaderToolbar({selectedTemplates}) {
  const token = localStorage.getItem('token')
  const queryClient = useQueryClient();
  
    // DELETE TEMPLATES
    const deleteTemplates = useMutation({
        mutationFn: async () => {
          await axios.delete(`${API}/api/templates/bulk`, {
            data: { templateIds: selectedTemplates },
            headers: { Authorization: `Bearer ${token}` },
          });
        },
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["latest-templates"], refetchType: 'all' });
        },
        onError: (err) => {
          toast.error(err.response?.data?.message || "Something went wrong");
        }
    });

    console.log(selectedTemplates)
  return (
    <div>
      <div className="flex gap-[7px] ">
        <button onClick={() => deleteTemplates.mutate()} className="active:opacity-[80%] active:bg-[#ffffffd0] flex items-center gap-[10px] border-[2px] border-[#ba5364] cursor-pointer rounded-[6px] px-[10px] py-[5px]"> 
            <FaRegTrashCan className="text-[#ba5364]"/>
            <span className="text-[#ba5364] text-[15px] font-[600]">Delete</span>
        </button>
      </div>
    </div>
  )
}

export default TableHeaderToolbar