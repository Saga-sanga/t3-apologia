ALTER TABLE "post" DROP CONSTRAINT "post_categoryId_category_id_fk";
--> statement-breakpoint
ALTER TABLE "post" ADD COLUMN "questionId" text;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "post" ADD CONSTRAINT "post_questionId_zawhna_id_fk" FOREIGN KEY ("questionId") REFERENCES "zawhna"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "post" ADD CONSTRAINT "post_categoryId_category_id_fk" FOREIGN KEY ("categoryId") REFERENCES "category"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
