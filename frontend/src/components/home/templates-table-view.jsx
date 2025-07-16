import { Checkbox, Tooltip } from 'antd';
import {  useState } from "react";
import moment from 'moment';
import TableHeaderToolbar from './table-header-toolbar';
import { useNavigate } from 'react-router-dom';
import UsersSkeleton from '../skeleton/users-skeleton';
import { useTranslation } from 'react-i18next';

function TemplatesTableView({LatestTemplates, loading}) {
    const [selectAll, setSelectAll] = useState(false)
    const {t} = useTranslation()
    const [selectedTemplates, setSelectedTemplates] = useState([])
    const navigate = useNavigate()

    // select all users
    const handleSelectAll = (e) => {
        const isChecked = e.target.checked
        setSelectAll(isChecked)
        if (isChecked) {
            const allTemplatesIds = LatestTemplates.map(user => user.id)
            setSelectedTemplates(allTemplatesIds)
        } else  setSelectedTemplates([])
    }

    // Selected templates
    const handleSelectTemplate = (templateId, isChecked) => {
        if (isChecked) setSelectedTemplates([...selectedTemplates, templateId])
        else  setSelectedTemplates(selectedTemplates.filter(id => id !== templateId)) 
    }

    function handleClick(id) {
        navigate(`/templates/${id}`)
    }

  return (
    <div className="md:px-[20px]">
        <TableHeaderToolbar   selectedTemplates={selectedTemplates}/>
        <div className='overflow-x-auto min-h-[62vh] '>
            <table className="w-full">
                <thead>
                    <tr className="border-b-[1px] border-[#c1c1c1] ">
                        <td className="w-[50px] min-w-[49px] text-center ">
                            <Checkbox  onChange={handleSelectAll} className='' checked={selectAll} value={true}></Checkbox>
                        </td>
                        <td className="text-[12px] md:text-[15px]  font-[700] min-w-[100px] py-[10px] dark:text-[#fff]  ">{t('tableTitle')}</td>
                        <td className="flex gap-[7px] items-center min-w-[100px]  py-[10px] dark:text-[#fff] ">
                            <span className="text-[12px] md:text-[15px]  font-[700]">{t('tableAuthor')}</span>
                        </td>
                        <td className="text-[12px] md:text-[15px]  font-[700] min-w-[100px] py-[10px] dark:text-[#fff] ">{t('tableAccess')}</td>
                        <td className="text-[12px] md:text-[15px]  font-[700] min-w-[100px] py-[10px] dark:text-[#fff] ">{t('tableIsPublished')}</td>
                        <td className="text-[12px] md:text-[15px]  font-[700] min-w-[150px] py-[10px] dark:text-[#fff] ">{t('tableIsUpdatedAt')}</td>
                    </tr>
                </thead>
                <tbody>
                    {LatestTemplates && LatestTemplates?.map((item) => (
                        <tr key={item.id} className="border-b-[1px] border-[#c1c1c1] ">
                            <td className="w-[50px] text-center ">
                                <Checkbox onChange={(e) => handleSelectTemplate(item.id, e.target.checked)} checked={selectedTemplates.includes(item.id)}></Checkbox>
                            </td>
                            <td onClick={() => handleClick(item.id)} className="py-[10px] ">
                                <p className={`text-[12px] md:text-[15px] font-[400] text-[#000] cursor-pointer dark:text-[#fff] `}>{item.title}</p>
                            </td>
                            <td onClick={() => handleClick(item.id)} className={`text-[12px] md:text-[15px] dark:text-[#fff]   cursor-pointer font-[400]   py-[10px] text-[#000]`}>{item?.author?.name}</td>
                            <td onClick={() => handleClick(item.id)} className={`text-[12px] md:text-[15px] dark:text-[#fff]   cursor-pointer font-[400]   py-[10px] text-[#000]`}>{item.access}</td>
                            <td onClick={() => handleClick(item.id)} className={`text-[12px] md:text-[15px] dark:text-[#fff]   cursor-pointer font-[400]   py-[10px] text-[#000]`}>{item.isPublished ? "Published" : "Not Published"}</td>
                            <td onClick={() => handleClick(item.id)} className={`text-[12px] md:text-[15px] dark:text-[#fff]   font-[400]  py-[10px] text-[#000] `}>
                                <Tooltip placement="bottom" className='cursor-pointer' title={moment(item.updatedAt).format('MMMM D, YYYY HH:mm:ss')}  >
                                    {moment(item.updatedAt).format('DD/MM/YYYY')}
                                </Tooltip>
                            </td>
                        </tr>
                    ))}
                    {!loading && Array.isArray(LatestTemplates) && !LatestTemplates.length &&  (
                        <tr>
                            <td colSpan={6} className="text-center">
                                <h2 className="mt-[20px] text-[17px] font-[600]">{t('noTemplates')}</h2>
                            </td>
                        </tr>
                    )}
                    {loading && (
                        <tr>
                            <td colSpan={6}>
                                <UsersSkeleton/>
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    </div>
  )
}

export default TemplatesTableView