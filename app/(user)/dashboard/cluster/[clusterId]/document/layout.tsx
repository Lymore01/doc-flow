"use client";

import React from "react";
import ClusterPage from "../page";
import { useIsMobile } from "../../../../../../hooks/useMobile";
import { useParams } from "next/navigation";
import { Separator } from "../../../../../../components/ui/separator";
import EditDocument from "../../../../../../components/edit-document";

export default function DocumentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const isMobile = useIsMobile();
  const { documentId } = useParams();
  return isMobile ? (
    <MobileLayout docId={Number(documentId)}>{children}</MobileLayout>
  ) : (
    <ClusterPage>{children}</ClusterPage>
  );
}

const MobileLayout = ({
  children,
  docId,
}: {
  children: React.ReactNode;
  docId?: number;
}) => {
  return (
    <div className="flex flex-col gap-4 h-screen overflow-auto">
      <div className="flex items-center justify-between w-full md:w-auto">
        <h1 className="px-4">Document {docId}</h1>
        <EditDocument documentName={docId as unknown as string} isDropDown={false} />
      </div>

      <Separator />

      <div className="flex-1 p-4 overflow-y-auto">{children}</div>
    </div>
  );
};
