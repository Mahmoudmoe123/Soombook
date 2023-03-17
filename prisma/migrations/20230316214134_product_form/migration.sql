-- CreateTable
CREATE TABLE "orderedProduct" (
    "id" SERIAL NOT NULL,
    "productUrl" TEXT NOT NULL,
    "originCountry" TEXT NOT NULL,
    "destinationCountry" TEXT NOT NULL,

    CONSTRAINT "orderedProduct_pkey" PRIMARY KEY ("id")
);
