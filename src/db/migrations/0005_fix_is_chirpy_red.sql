ALTER TABLE "users" RENAME COLUMN "false" TO "is_chirpy_red";--> statement-breakpoint
UPDATE "users" SET "is_chirpy_red" = false WHERE "is_chirpy_red" IS NULL;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "is_chirpy_red" SET DEFAULT false;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "is_chirpy_red" SET NOT NULL;
