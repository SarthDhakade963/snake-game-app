/*
  Warnings:

  - You are about to drop the column `createdAt` on the `Score` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Score" DROP COLUMN "createdAt";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
