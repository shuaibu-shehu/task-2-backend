/*
  Warnings:

  - You are about to drop the `_OrganisationToUser` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_OrganisationToUser" DROP CONSTRAINT "_OrganisationToUser_A_fkey";

-- DropForeignKey
ALTER TABLE "_OrganisationToUser" DROP CONSTRAINT "_OrganisationToUser_B_fkey";

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "phone" DROP NOT NULL;

-- DropTable
DROP TABLE "_OrganisationToUser";

-- CreateTable
CREATE TABLE "_UserOrganisation" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_UserOrganisation_AB_unique" ON "_UserOrganisation"("A", "B");

-- CreateIndex
CREATE INDEX "_UserOrganisation_B_index" ON "_UserOrganisation"("B");

-- AddForeignKey
ALTER TABLE "_UserOrganisation" ADD CONSTRAINT "_UserOrganisation_A_fkey" FOREIGN KEY ("A") REFERENCES "Organisation"("orgId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserOrganisation" ADD CONSTRAINT "_UserOrganisation_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("userId") ON DELETE CASCADE ON UPDATE CASCADE;
