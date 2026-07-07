-- CreateEnum
CREATE TYPE "Role" AS ENUM ('USER', 'BOARD_OWNER');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "role" "Role" NOT NULL DEFAULT 'USER';
