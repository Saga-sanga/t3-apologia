ALTER TABLE "post" RENAME COLUMN "userId" TO "authorId";--> statement-breakpoint
ALTER TABLE "post" DROP CONSTRAINT "post_zawhnaId_zawhna_id_fk";
--> statement-breakpoint
ALTER TABLE "post" DROP CONSTRAINT "post_userId_user_id_fk";
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "post" ADD CONSTRAINT "post_authorId_user_id_fk" FOREIGN KEY ("authorId") REFERENCES "user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "post" DROP COLUMN IF EXISTS "zawhnaId";