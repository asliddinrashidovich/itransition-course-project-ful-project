import axios from "axios"
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import { useState } from "react";
import { FormControl, MenuItem, Select } from "@mui/material"
import TemplatesTableView from "../home/templates-table-view";

const API = import.meta.env.VITE_API

function AllTemplates() {
    const [authorValue, setAuthorValue] = useState('anyone');
    const token = localStorage.getItem('token')
    const [searchParams, setSearchParams] = useSearchParams()

    // get my data
    const fetchMyData = async () => {
        const res = await axios.get(`${API}/api/users/me`, {
            headers: {Authorization: `Bearer ${token}`}
        });
        return res.data
    };
    const { data: myData} = useQuery({
        queryKey: ["my-data-3"],
        queryFn: fetchMyData,
    });

      // sort by sort
    const sortByCreators  = searchParams.get('sort-creatort') || 'anyone'
    const search  = searchParams.get('search') || ''
    
    const updateSortBy = (sort) => {
        setAuthorValue(sort);
        searchParams.set('sort-creatort', sort)
        setSearchParams(searchParams)
    }
    
    // get templates 
    const fetchLatestTempletes = async () => {
        const res = await axios.get(`${API}/api/templates`, {headers: {Authorization: `Bearer ${token}`}});
        const allItems = res.data    
        const allTemplates = allItems.filter(templateItem => {
            const titleMatch = templateItem.title.toLowerCase().includes(search.toLowerCase());
            const authorMatch = templateItem.author.name.toLowerCase().includes(search.toLowerCase());
            const formTitleMatch = templateItem.formTitle.toLowerCase().includes(search.toLowerCase());
            const descriptionMatch = templateItem.description.toLowerCase().includes(search.toLowerCase());
            return titleMatch || authorMatch || formTitleMatch || descriptionMatch
        });
        if(sortByCreators == "anyone" && myData?.isAdmin) return allTemplates
        else if(sortByCreators == "not-me" && myData?.isAdmin) {
            const filtered = allTemplates.filter(temp => temp.author.id != myData.id)
            return filtered
        } else {
            const filtered = allTemplates.filter(temp => temp.author.id == myData.id)
            return filtered
        }
    };
    const { data: LatestTemplates, isLoading: loading} = useQuery({
        queryKey: ["latest-templates", sortByCreators, search],
        queryFn: fetchLatestTempletes,
    });

  return (
    <section className="py-[30px] bg-transparent px-5 md:px-10 ">
        <div className="max-w-[1000px] mx-auto">
            <div className="flex justify-between items-center py-[20px] mb-[20px]">
                <h5 className="text-[#000] text-[20px] font-[600] dark:text-[#fff]">All Templates</h5>
                <div className="flex items-center gap-[30px]">
                    {myData?.isAdmin &&  <div className="lg:flex gap-[5px] hidden items-center">
                        <h2 className="dark:text-[#fff]">Sort by:</h2>
                        <FormControl sx={{ marginLeft: 1, minWidth: 120,  }}>
                            <Select
                                value={authorValue}
                                onChange={(e) => updateSortBy(e.target.value)}
                                displayEmpty
                                className="dark:text-[#fff]"
                                inputProps={{ 'aria-label': 'Without label' }}
                            >
                                <MenuItem value={'anyone'}>Owned by anyone</MenuItem>
                                <MenuItem value={"me"}>Owned by me</MenuItem>
                                <MenuItem value={"not-me"}>Not owned by me</MenuItem>
                            </Select>
                        </FormControl>
                    </div>}
                </div>
            </div>
            <TemplatesTableView loading={loading} LatestTemplates={LatestTemplates}/>
        </div>
    </section>
  )
}

export default AllTemplates