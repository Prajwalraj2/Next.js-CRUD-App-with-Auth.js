/*
  Warnings:

  - You are about to drop the column `position` on the `Domain` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `Domain` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `ResourceModule` table. All the data in the column will be lost.
  - You are about to drop the column `moduleType` on the `ResourceModule` table. All the data in the column will be lost.
  - You are about to drop the column `position` on the `ResourceModule` table. All the data in the column will be lost.
  - You are about to drop the column `position` on the `SubCategory` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `SubCategory` table. All the data in the column will be lost.
  - You are about to drop the `ResourceItem` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `name` to the `Domain` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `SubCategory` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "public"."ResourceModuleKind" AS ENUM ('MIXED', 'TABLE', 'CONTENT');

-- CreateEnum
CREATE TYPE "public"."ResourceBlockType" AS ENUM ('TEXT', 'CARD', 'COLLAPSIBLE', 'VIDEO', 'IMAGE', 'LINKLIST');

-- CreateEnum
CREATE TYPE "public"."TableColumnType" AS ENUM ('TEXT', 'BADGE', 'LINK', 'DESC');

-- DropForeignKey
ALTER TABLE "public"."ResourceItem" DROP CONSTRAINT "ResourceItem_resourceModuleId_fkey";

-- DropIndex
DROP INDEX "public"."Domain_position_idx";

-- DropIndex
DROP INDEX "public"."ResourceModule_position_idx";

-- DropIndex
DROP INDEX "public"."ResourceModule_subCategoryId_idx";

-- DropIndex
DROP INDEX "public"."SubCategory_domainId_idx";

-- DropIndex
DROP INDEX "public"."SubCategory_position_idx";

-- AlterTable
ALTER TABLE "public"."Domain" DROP COLUMN "position",
DROP COLUMN "title",
ADD COLUMN     "isPublic" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "name" TEXT NOT NULL,
ADD COLUMN     "order" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "public"."ResourceModule" DROP COLUMN "description",
DROP COLUMN "moduleType",
DROP COLUMN "position",
ADD COLUMN     "isPublic" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "kind" "public"."ResourceModuleKind" NOT NULL DEFAULT 'MIXED',
ADD COLUMN     "order" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "summary" TEXT;

-- AlterTable
ALTER TABLE "public"."SubCategory" DROP COLUMN "position",
DROP COLUMN "title",
ADD COLUMN     "isPublic" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "name" TEXT NOT NULL,
ADD COLUMN     "order" INTEGER NOT NULL DEFAULT 0;

-- DropTable
DROP TABLE "public"."ResourceItem";

-- DropEnum
DROP TYPE "public"."ItemType";

-- DropEnum
DROP TYPE "public"."ModuleType";

-- CreateTable
CREATE TABLE "public"."ResourceBlock" (
    "id" TEXT NOT NULL,
    "moduleId" TEXT NOT NULL,
    "type" "public"."ResourceBlockType" NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "data" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ResourceBlock_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ResourceTable" (
    "id" TEXT NOT NULL,
    "moduleId" TEXT NOT NULL,
    "columns" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ResourceTable_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ResourceTableRow" (
    "id" TEXT NOT NULL,
    "tableId" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "data" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ResourceTableRow_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ResourceBlock_moduleId_order_idx" ON "public"."ResourceBlock"("moduleId", "order");

-- CreateIndex
CREATE UNIQUE INDEX "ResourceTable_moduleId_key" ON "public"."ResourceTable"("moduleId");

-- CreateIndex
CREATE INDEX "ResourceTableRow_tableId_order_idx" ON "public"."ResourceTableRow"("tableId", "order");

-- CreateIndex
CREATE INDEX "ResourceModule_subCategoryId_order_idx" ON "public"."ResourceModule"("subCategoryId", "order");

-- CreateIndex
CREATE INDEX "SubCategory_domainId_order_idx" ON "public"."SubCategory"("domainId", "order");

-- AddForeignKey
ALTER TABLE "public"."ResourceBlock" ADD CONSTRAINT "ResourceBlock_moduleId_fkey" FOREIGN KEY ("moduleId") REFERENCES "public"."ResourceModule"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ResourceTable" ADD CONSTRAINT "ResourceTable_moduleId_fkey" FOREIGN KEY ("moduleId") REFERENCES "public"."ResourceModule"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ResourceTableRow" ADD CONSTRAINT "ResourceTableRow_tableId_fkey" FOREIGN KEY ("tableId") REFERENCES "public"."ResourceTable"("id") ON DELETE CASCADE ON UPDATE CASCADE;
