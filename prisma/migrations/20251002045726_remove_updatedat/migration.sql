/*
  Warnings:

  - You are about to drop the column `updatedAt` on the `cartitem` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `game` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `gamekey` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `orderitem` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `user` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `cartitem` DROP COLUMN `updatedAt`;

-- AlterTable
ALTER TABLE `game` DROP COLUMN `updatedAt`;

-- AlterTable
ALTER TABLE `gamekey` DROP COLUMN `updatedAt`;

-- AlterTable
ALTER TABLE `orderitem` DROP COLUMN `updatedAt`;

-- AlterTable
ALTER TABLE `user` DROP COLUMN `updatedAt`;
