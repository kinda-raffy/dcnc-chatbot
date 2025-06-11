CREATE TABLE IF NOT EXISTS "KnowledgeUnit" (
	"id" uuid DEFAULT gen_random_uuid() NOT NULL,
	"label" text NOT NULL,
	"content" text NOT NULL,
	"userId" uuid NOT NULL,
	"createdAt" timestamp NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "KnowledgeUnit" ADD CONSTRAINT "KnowledgeUnit_userId_User_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
