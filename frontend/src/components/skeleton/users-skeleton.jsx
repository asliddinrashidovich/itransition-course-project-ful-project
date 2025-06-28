import { Skeleton } from "antd"

function UsersSkeleton() {
    return (
        <div className='flex flex-col gap-[20px]'>
            <div className='w-full bg-[#fff] rounded-[10px] py-[20px] px-[20px]'>
                <Skeleton paragraph={{rows: 15}} active/>
            </div>
        </div>
    )
}

export default UsersSkeleton