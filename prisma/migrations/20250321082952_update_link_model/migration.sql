/*
  Warnings:

  - Made the column `profileDescription` on table `Link` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
UPDATE "Link" SET "profileDescription" = '👋 Welcome to my profile! Open to connections, collaboration, and new ideas. Let''s make great things happen together. 🌟' WHERE "profileDescription" IS NULL;
ALTER TABLE "Link" ALTER COLUMN "profileDescription" SET NOT NULL,
ALTER COLUMN "profileDescription" SET DEFAULT '👋 Welcome to my profile! Open to connections, collaboration, and new ideas. Let''s make great things happen together. 🌟';
