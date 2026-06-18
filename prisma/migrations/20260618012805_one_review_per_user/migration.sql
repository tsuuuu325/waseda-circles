/*
  Warnings:

  - A unique constraint covering the columns `[circleId,userId]` on the table `Review` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Review_circleId_userId_key" ON "Review"("circleId", "userId");
