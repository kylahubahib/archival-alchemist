import React from "react";
import { Skeleton } from "@nextui-org/react";

export default function ManuscriptSkeleton({ skeletonCount = 4 }) {
    return (
        <>
            {Array.from({ length: skeletonCount }).map((_, index) => (
                <div key={index} className="flex w-full items-center gap-4 rounded-lg p-4 shadow-md border-1">
                    <div className="flex flex-1 w-full">
                        <Skeleton className="flex w-14 h-24 rounded-md" />
                    </div>
                    <div className="flex flex-col w-full gap-2">
                        <Skeleton className="h-5 w-full rounded-lg" />
                        <Skeleton className="h-3 w-1/3 rounded-lg" />
                        <Skeleton className="h-2 w-full rounded-lg" />
                        <Skeleton className="h-2 w-full rounded-lg" />
                        <Skeleton className="h-2 w-full rounded-lg" />
                    </div>
                </div>
            ))}
        </>
    );
};

