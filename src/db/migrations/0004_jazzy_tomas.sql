ALTER TABLE "users" ALTER COLUMN "hashed_passwords" SET DATA TYPE varchar(256);--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "hashed_passwords" SET DEFAULT 'unset';--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "false" boolean;