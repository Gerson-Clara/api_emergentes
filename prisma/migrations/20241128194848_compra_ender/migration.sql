/*
  Warnings:

  - You are about to drop the column `descricao` on the `compras` table. All the data in the column will be lost.
  - Added the required column `endereco` to the `compras` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "compras" DROP COLUMN "descricao",
ADD COLUMN     "endereco" VARCHAR(255) NOT NULL;
