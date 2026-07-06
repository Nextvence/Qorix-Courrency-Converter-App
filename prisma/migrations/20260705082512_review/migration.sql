-- CreateTable
CREATE TABLE "Review" (
    "id" SERIAL NOT NULL,
    "reviewModel" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Review_pkey" PRIMARY KEY ("id")
);
