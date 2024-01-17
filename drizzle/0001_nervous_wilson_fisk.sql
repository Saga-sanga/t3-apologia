ALTER TABLE "posts" RENAME COLUMN "body" TO "content";--> statement-breakpoint
ALTER TABLE "posts" ALTER COLUMN "content" SET DATA TYPE json;