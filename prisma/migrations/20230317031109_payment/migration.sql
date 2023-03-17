-- CreateTable
CREATE TABLE "Paymentmethod" (
    "id" SERIAL NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "accountNumber" INTEGER NOT NULL,
    "cardNumber" INTEGER NOT NULL,

    CONSTRAINT "Paymentmethod_pkey" PRIMARY KEY ("id")
);
