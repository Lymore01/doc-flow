/*
  Warnings:

  - You are about to drop the column `profileDescription` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Link" ADD COLUMN     "profileDescription" TEXT;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "profileDescription";
