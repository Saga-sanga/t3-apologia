ALTER TABLE "zawhna" DROP CONSTRAINT "zawhna_answerId_post_id_fk";
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "zawhna" ADD CONSTRAINT "zawhna_answerId_post_id_fk" FOREIGN KEY ("answerId") REFERENCES "post"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
