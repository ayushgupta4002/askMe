-- AlterTable
ALTER TABLE "public"."Message" ADD COLUMN     "images" TEXT[],
ADD COLUMN     "stepwise" BOOLEAN DEFAULT false;
