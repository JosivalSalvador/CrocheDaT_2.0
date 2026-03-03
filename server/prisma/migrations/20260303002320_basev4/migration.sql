/*
  Warnings:

  - A unique constraint covering the columns `[cart_id]` on the table `chats` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "ChatType" AS ENUM ('ORDER', 'SUPPORT');

-- AlterTable
ALTER TABLE "chats" ADD COLUMN     "cart_id" TEXT,
ADD COLUMN     "last_message_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "type" "ChatType" NOT NULL DEFAULT 'SUPPORT';

-- CreateIndex
CREATE UNIQUE INDEX "chats_cart_id_key" ON "chats"("cart_id");

-- AddForeignKey
ALTER TABLE "chats" ADD CONSTRAINT "chats_cart_id_fkey" FOREIGN KEY ("cart_id") REFERENCES "carts"("id") ON DELETE SET NULL ON UPDATE CASCADE;
