import { Skeleton } from 'antd';

const TemplatesCardsSskeleton = () => {
    const dataArray = [0,0,0,0,0,0,0,0,0,0] 
    return (
       <div className='max-w-[1200px] mx-auto grid-cols-1 sm:grid-cols-3 md:grid-cols-5 grid gap-y-[30px] gap-x-[30px]'>
            {dataArray.map((item, i) => (
                <div key={i} className='w-full'>
                    <Skeleton.Image active className='skeleton-img'/>
                    <Skeleton paragraph={{rows: 0}} className='my-[20px]'/>
                </div>
            ))}
       </div>
    )
}
export default TemplatesCardsSskeleton;