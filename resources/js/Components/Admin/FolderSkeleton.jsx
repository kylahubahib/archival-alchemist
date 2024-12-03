import { Skeleton } from "@nextui-org/react";

const FolderSkeleton = ({ skeletonCount = 6 }) => {
    return (
        <>
            {Array.from({ length: skeletonCount }).map((_, index) => (
                <div key={index} className="flex w-full gap-3 shadow-md rounded-md items-center border py-7 px-2 h-10 hover:bg-gray-100">
                    <Skeleton className="h-8 w-1/5 rounded-md" />
                    <Skeleton className="h-5 w-full rounded-lg" />
                </div>
            ))}
        </>
    );
};

export default FolderSkeleton;
