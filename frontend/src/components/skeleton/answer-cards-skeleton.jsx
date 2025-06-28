import { Skeleton } from "antd"

function AnswerCardsSkeleton() {
    const dataArray = [0,0,0,0,0] 
    return (
        <div className='flex flex-col gap-[20px]'>
            {dataArray.map((item, i) => (
                <div key={i} className='w-full bg-[#fff] rounded-[10px] py-[20px] px-[20px]'>
                    <Skeleton paragraph={{rows: 3}} active/>
                </div>
            ))}
        </div>
    )
}

export default AnswerCardsSkeleton