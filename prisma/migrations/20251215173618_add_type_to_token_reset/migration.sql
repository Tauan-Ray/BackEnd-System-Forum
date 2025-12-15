/*
  Warnings:

  - Added the required column `TYPE` to the `TokenReset` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "TypeToken" AS ENUM ('RESET_PASSWORD', 'CHANGE_EMAIL');

-- AlterTable
ALTER TABLE "TokenReset" ADD COLUMN     "TYPE" "TypeToken" NOT NULL;
