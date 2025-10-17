/*
  Warnings:

  - A unique constraint covering the columns `[CATEGORY]` on the table `CATEGORIES` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "CATEGORIES_CATEGORY_key" ON "CATEGORIES"("CATEGORY");
