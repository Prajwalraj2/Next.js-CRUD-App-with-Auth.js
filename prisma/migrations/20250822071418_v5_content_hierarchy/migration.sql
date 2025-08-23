-- CreateEnum
CREATE TYPE "public"."ModuleType" AS ENUM ('TABLE', 'BLOCKS', 'MIXED');

-- CreateEnum
CREATE TYPE "public"."ItemType" AS ENUM ('TABLE', 'BLOCKS', 'LINKS');

-- CreateTable
CREATE TABLE "public"."Domain" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "position" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Domain_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."SubCategory" (
    "id" TEXT NOT NULL,
    "domainId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "position" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SubCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ResourceModule" (
    "id" TEXT NOT NULL,
    "subCategoryId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "moduleType" "public"."ModuleType" NOT NULL DEFAULT 'MIXED',
    "position" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ResourceModule_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ResourceItem" (
    "id" TEXT NOT NULL,
    "resourceModuleId" TEXT NOT NULL,
    "itemType" "public"."ItemType" NOT NULL,
    "title" TEXT,
    "position" INTEGER NOT NULL DEFAULT 0,
    "payload" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ResourceItem_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Domain_slug_key" ON "public"."Domain"("slug");

-- CreateIndex
CREATE INDEX "Domain_position_idx" ON "public"."Domain"("position");

-- CreateIndex
CREATE INDEX "SubCategory_position_idx" ON "public"."SubCategory"("position");

-- CreateIndex
CREATE INDEX "SubCategory_domainId_idx" ON "public"."SubCategory"("domainId");

-- CreateIndex
CREATE UNIQUE INDEX "SubCategory_domainId_slug_key" ON "public"."SubCategory"("domainId", "slug");

-- CreateIndex
CREATE INDEX "ResourceModule_position_idx" ON "public"."ResourceModule"("position");

-- CreateIndex
CREATE INDEX "ResourceModule_subCategoryId_idx" ON "public"."ResourceModule"("subCategoryId");

-- CreateIndex
CREATE UNIQUE INDEX "ResourceModule_subCategoryId_slug_key" ON "public"."ResourceModule"("subCategoryId", "slug");

-- CreateIndex
CREATE INDEX "ResourceItem_resourceModuleId_position_idx" ON "public"."ResourceItem"("resourceModuleId", "position");

-- AddForeignKey
ALTER TABLE "public"."SubCategory" ADD CONSTRAINT "SubCategory_domainId_fkey" FOREIGN KEY ("domainId") REFERENCES "public"."Domain"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ResourceModule" ADD CONSTRAINT "ResourceModule_subCategoryId_fkey" FOREIGN KEY ("subCategoryId") REFERENCES "public"."SubCategory"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ResourceItem" ADD CONSTRAINT "ResourceItem_resourceModuleId_fkey" FOREIGN KEY ("resourceModuleId") REFERENCES "public"."ResourceModule"("id") ON DELETE CASCADE ON UPDATE CASCADE;
