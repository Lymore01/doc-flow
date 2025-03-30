-- CreateTable
CREATE TABLE "Clicks" (
    "id" TEXT NOT NULL,
    "ip" TEXT,
    "country" TEXT,
    "userAgent" TEXT,
    "linkId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Clicks_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Clicks" ADD CONSTRAINT "Clicks_linkId_fkey" FOREIGN KEY ("linkId") REFERENCES "Link"("id") ON DELETE CASCADE ON UPDATE CASCADE;
