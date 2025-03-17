"use client";

import React from "react";
import ClusterPage from "../page";
import { useIsMobile } from "../../../../../../hooks/useMobile";
import { useParams } from "next/navigation";
import { Separator } from "../../../../../../components/ui/separator";
import EditDocument from "../../../../../../components/edit-document";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "../../../../../../components/ui/skeleton";

export default function DocumentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { documentId } = useParams();
  const isMobile = useIsMobile();

  const {
    data: fetchedDocuments,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["Document", documentId],
    queryFn: async () => {
      if (documentId) {
        const response = await fetch(`/api/documents/${documentId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch document.");
        }
        return response.json();
      }
      throw new Error("Document ID is undefined.");
    },
    enabled: !!documentId,
  });

  if (error) return <p>Error loading document.</p>;

  return isMobile ? (
    <MobileLayout
      docName={fetchedDocuments?.document.name}
      isLoading={isLoading}
      docId={documentId as unknown as string}
    >
      {children}
    </MobileLayout>
  ) : (
    <ClusterPage>{children}</ClusterPage>
  );
}

const MobileLayout = ({
  children,
  docName,
  isLoading,
  docId,
}: {
  children: React.ReactNode;
  docName?: string;
  isLoading: boolean;
  docId: string;
}) => {
  return (
    <div className="flex flex-col gap-4 h-screen overflow-auto">
      <div className="flex items-center justify-between w-full md:w-auto">
        {isLoading ? (
          <Skeleton className="w-40 h-8" />
        ) : (
          <h1 className="px-4">{docName}</h1>
        )}
        <EditDocument
          documentName={docId as unknown as string}
          isDropDown={false}
        />
      </div>

      <Separator />

      <div className="flex-1 p-4 overflow-y-auto">{children}</div>
    </div>
  );
};
