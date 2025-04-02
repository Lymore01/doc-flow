"use server"
// dashboard actions
import axiosInstance from "../../../lib/axios";
import { AxiosError } from "axios";
import { prisma } from "../../../lib/prisma";

export async function getDashboardData(userId: string) {
  if (!userId) {
    throw new Error("User ID is required to fetch dashboard data");
  }
  try {
    // clusters, links, documents count
    const response = await axiosInstance.get(`/api/dashboard?userId=${userId}`);
    return response.data;
  } catch (error) {
    console.log(error);
    if (error instanceof AxiosError) {
      throw new Error(
        error.response?.data?.error || "Failed to fetch dashboard data"
      );
    }
    throw new Error("Failed to fetch dashboard data");
  }
}

export async function moveDocumentToCluster(
  documentId: string,
  newClusterId: string
) {
  const existingRelationship = await prisma.clusterDocument.findFirst({
    where: { documentId },
  });

  if (!existingRelationship) {
    throw new Error("Document not found in any cluster.");
  }

  const updatedClusterDocument = await prisma.clusterDocument.update({
    where: { id: existingRelationship.id },
    data: { clusterId: newClusterId },
  });

  return {
    success:true,
    message: "Document Moved",
    updatedClusterDocument,
  };
}
