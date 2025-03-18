-- DropForeignKey
ALTER TABLE "Document" DROP CONSTRAINT "Document_clusterId_fkey";

-- CreateTable
CREATE TABLE "ClusterDocument" (
    "id" TEXT NOT NULL,
    "clusterId" TEXT NOT NULL,
    "documentId" TEXT NOT NULL,

    CONSTRAINT "ClusterDocument_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ClusterDocument" ADD CONSTRAINT "ClusterDocument_clusterId_fkey" FOREIGN KEY ("clusterId") REFERENCES "Cluster"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClusterDocument" ADD CONSTRAINT "ClusterDocument_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "Document"("id") ON DELETE CASCADE ON UPDATE CASCADE;
