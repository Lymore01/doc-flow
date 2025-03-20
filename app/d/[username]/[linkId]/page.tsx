/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import Image from "next/image";

import { useParams, useRouter } from "next/navigation";
import { Skeleton } from "../../../../components/ui/skeleton";
import { ExternalLink } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Document } from "../../../../components/types/types";
import { getFileIcon } from "../../../../lib/utils";

export default function UserPage() {
  const { linkId } = useParams();
  // const router = useRouter();

  const {
    data: userDetails,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["userPageDetails", linkId],
    queryFn: async () => {
      if (linkId) {
        const response = await fetch(`/api/userpage?linkId=${linkId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch user page details.");
        }
        return response.json();
      }
      throw new Error("Link ID is undefined.");
    },
    enabled: !!linkId,
  });

  return (
    <div className="w-full h-screen max-h-screen overflow-auto flex flex-col items-center justify-start p-6 md:p-12 bg-secondary">
      {/* profile section */}
      <div className="flex flex-col gap-4 items-center justify-center">
        {userDetails?.userPageDetails[0]?.user && userDetails?.userPageDetails[0]?.user.image ? (
          <Image
            src={userDetails?.userPageDetails[0]?.user.image}
            alt="profile pic"
            height={100}
            width={100}
            className="size-36 rounded-full border-0 p-[2px] bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"
            style={{
              backgroundClip: "padding-box",
            }}
          />
        ) : (
          <Skeleton className="size-36 rounded-full" /> //todo: replace this with placeholder image
        )}
        {userDetails?.userPageDetails[0]?.user ? (
          <h1 className="text-2xl font-bold dark:text-white text-gray-800 ">
            {userDetails?.userPageDetails[0]?.user.name
              ? decodeURIComponent(
                  typeof userDetails?.userPageDetails[0]?.user.name === "string" ? userDetails?.userPageDetails[0]?.user.name : userDetails?.userPageDetails[0]?.user.name
                )
              : "Unknown User"}
          </h1>
        ) : (
          <Skeleton className="h-8 w-32" />
        )}
        {userDetails?.userPageDetails[0]?.user ? (
          <>
            <p className="text-sm text-gray-600">
              {userDetails?.userPageDetails[0]?.user.email}
            </p>
            <p className="text-center text-sm text-gray-600 font-light">
              Welcome to my profile! Here you’ll find my shared documents and
              projects. Feel free to explore and connect.🌟
            </p>
          </>
        ) : (
          <div className="flex flex-col gap-4">
            <Skeleton className="h-8 w-40" />
            <Skeleton className="h-8 w-46" />
          </div>
        )}
      </div>
      {/* documents section */}

      <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
        {isLoading &&
          Array.from([1, 2, 3, 4]).map((_, index) => (
            <div
              className="h-[200px] border p-2 flex flex-col gap-2 rounded-md items-center justify-center relative"
              key={index}
            >
              <Skeleton className="w-[100px] h-[100px] rounded-full" />

              <Skeleton className="h-6 w-32" />

              <div className="absolute top-0 right-0 p-2 size-auto">
                <Skeleton className="w-5 h-5 rounded-md" />
              </div>
            </div>
          ))}
        {error && <div>Error Loading Documents!</div>}
        {userDetails?.userPageDetails[0]?.link.cluster.documents?.length === 0 && (
          <div className="p-4 flex items-center justify-center w-full">
            <span className="text-sm text-center text-muted-foreground">
              Oops, nothing here!
            </span>
          </div>
        )}
        {userDetails?.userPageDetails[0]?.link.cluster.documents?.map((doc: Document) => (
          <div
            className="h-[200px] border p-2 flex flex-col gap-2 rounded-md items-center justify-center relative"
            key={doc.document.id}
          >
            <Image
              src={`/images/${getFileIcon({
                name: `logo.${doc.document.type}`,
              })}`}
              alt={doc.document.name}
              width={100}
              height={100}
              className="size-20"
            />
            <h1 className="text-sm">{doc.document.name}</h1>
            {/* view document */}
            <div
              className="absolute top-0 right-0 p-2 size-auto"
              onClick={() => {
                // router.push(
                //   `/dashboard/cluster/${clusterid}/document/${doc.document.id}`
                // );
                //Todo: replace this with public route
              }}
            >
              <ExternalLink size={18} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

//
// import { cn } from "../../../../lib/utils";

// export default function UserPageLayout({ children, classname }: Readonly<{
//     children: React.ReactNode;
//     classname: string
//   }>) {
//   return (
//     <div
//       className={cn(
//         "flex w-full h-screen max-h-screen",
//         classname
//       )}
//     >
//       {children}
//     </div>
//   );
// }
