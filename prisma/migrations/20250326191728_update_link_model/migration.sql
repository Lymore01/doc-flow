/*
  Warnings:

  - A unique constraint covering the columns `[trackingId]` on the table `Link` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Link" ADD COLUMN     "trackingId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Link_trackingId_key" ON "Link"("trackingId");
