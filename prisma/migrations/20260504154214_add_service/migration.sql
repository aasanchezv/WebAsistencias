-- CreateTable
CREATE TABLE "Subservice" (
    "id" SERIAL NOT NULL,
    "name" TEXT,
    "icon" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "serviceId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Subservice_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Subservice" ADD CONSTRAINT "Subservice_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "Service"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
