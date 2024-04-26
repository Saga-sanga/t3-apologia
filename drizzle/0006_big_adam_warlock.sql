DO $$ BEGIN
 CREATE TYPE "sex" AS ENUM('male', 'female');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "reply" (
	"id" text PRIMARY KEY NOT NULL,
	"userId" text,
	"content" text,
	"parentId" text,
	"createdAt" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "comment" DROP CONSTRAINT "comment_parentCommentId_comment_id_fk";
--> statement-breakpoint
ALTER TABLE "post" ADD COLUMN "description" text;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "completedOnboarding" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "dob" timestamp;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "sex" "sex";--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "profession" text;--> statement-breakpoint
ALTER TABLE "comment" DROP COLUMN IF EXISTS "parentCommentId";--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "reply" ADD CONSTRAINT "reply_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "reply" ADD CONSTRAINT "reply_parentId_comment_id_fk" FOREIGN KEY ("parentId") REFERENCES "comment"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "user" ADD CONSTRAINT "user_username_unique" UNIQUE("username");