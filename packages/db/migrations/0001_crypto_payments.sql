CREATE TABLE IF NOT EXISTS "crypto_payments" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "user_id" uuid NOT NULL,
  "nowpayments_id" text,
  "plan" text NOT NULL,
  "status" text DEFAULT 'pending' NOT NULL,
  "amount_usd" integer NOT NULL,
  "raw" jsonb,
  "created_at" timestamp DEFAULT now() NOT NULL,
  "updated_at" timestamp DEFAULT now() NOT NULL,
  CONSTRAINT "crypto_payments_nowpayments_id_unique" UNIQUE("nowpayments_id")
);
--> statement-breakpoint
DO $$ BEGIN
  ALTER TABLE "crypto_payments"
    ADD CONSTRAINT "crypto_payments_user_id_profiles_id_fk"
    FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id")
    ON DELETE cascade ON UPDATE no action;
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;
