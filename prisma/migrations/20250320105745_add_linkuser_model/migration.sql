-- CreateTable
CREATE TABLE "LinkUser" (
    "id" TEXT NOT NULL,
    "linkId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "LinkUser_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "LinkUser" ADD CONSTRAINT "LinkUser_linkId_fkey" FOREIGN KEY ("linkId") REFERENCES "Link"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LinkUser" ADD CONSTRAINT "LinkUser_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
