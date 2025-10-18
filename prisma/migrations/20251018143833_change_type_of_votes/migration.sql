/*
  Warnings:

  - You are about to drop the column `VOTES` on the `VOTES` table. All the data in the column will be lost.
  - Added the required column `TYPE` to the `VOTES` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "TypeVotes" AS ENUM ('LIKE', 'DESLIKE');

-- AlterTable
ALTER TABLE "VOTES" DROP COLUMN "VOTES",
ADD COLUMN     "TYPE" "TypeVotes" NOT NULL;
