/*
  Warnings:

  - You are about to drop the `USER` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "public"."USER";

-- CreateTable
CREATE TABLE "USERS" (
    "ID_USER" TEXT NOT NULL,
    "USERNAME" TEXT NOT NULL,
    "NAME" TEXT NOT NULL,
    "EMAIL" TEXT NOT NULL,
    "PASSWORD" TEXT NOT NULL,
    "ROLE" "UserRole" NOT NULL DEFAULT 'USER',
    "DT_CR" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "DT_UP" TIMESTAMP(3) NOT NULL,
    "DEL_AT" TIMESTAMP(3),

    CONSTRAINT "USERS_pkey" PRIMARY KEY ("ID_USER")
);

-- CreateIndex
CREATE UNIQUE INDEX "USERS_USERNAME_key" ON "USERS"("USERNAME");

-- CreateIndex
CREATE UNIQUE INDEX "USERS_EMAIL_key" ON "USERS"("EMAIL");
