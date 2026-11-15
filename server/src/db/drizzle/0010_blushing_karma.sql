-- Backfill unlinked legacy parameters, preferring an organisation definition over a built-in one.
INSERT INTO "metric_definitions" (
	"id", "organization_id", "key", "label", "unit", "symbol", "data_type", "category"
)
SELECT
	gen_random_uuid()::text,
	legacy."organization_id",
	legacy."key",
	legacy."label",
	legacy."unit",
	legacy."symbol",
	legacy."data_type",
	'Custom'
FROM (
	SELECT DISTINCT ON (tv."organization_id", tm."key")
		tv."organization_id", tm."key", tm."label", tm."unit", tm."symbol", tm."data_type"
	FROM "template_metrics" tm
	INNER JOIN "template_versions" tv ON tv."id" = tm."template_version_id"
	WHERE tm."metric_definition_id" IS NULL
		AND NOT EXISTS (
			SELECT 1 FROM "metric_definitions" md
			WHERE md."organization_id" = tv."organization_id" AND md."key" = tm."key"
		)
		AND NOT EXISTS (
			SELECT 1 FROM "metric_definitions" md
			WHERE md."organization_id" IS NULL AND md."key" = tm."key"
		)
	ORDER BY tv."organization_id", tm."key", tv."version" DESC, tm."id"
) legacy
ON CONFLICT DO NOTHING;--> statement-breakpoint
UPDATE "template_metrics" tm
SET "metric_definition_id" = COALESCE(
	(
		SELECT md."id"
		FROM "template_versions" tv
		INNER JOIN "metric_definitions" md
			ON md."organization_id" = tv."organization_id" AND md."key" = tm."key"
		WHERE tv."id" = tm."template_version_id"
		LIMIT 1
	),
	(
		SELECT md."id"
		FROM "metric_definitions" md
		WHERE md."organization_id" IS NULL AND md."key" = tm."key"
		LIMIT 1
	)
)
WHERE tm."metric_definition_id" IS NULL;--> statement-breakpoint
ALTER TABLE "template_metrics" DROP CONSTRAINT "template_metrics_version_id_key_unique";--> statement-breakpoint
ALTER TABLE "template_metrics" DROP CONSTRAINT "template_metrics_data_type_check";--> statement-breakpoint
ALTER TABLE "template_metrics" DROP CONSTRAINT "template_metrics_metric_definition_id_metric_definitions_id_fk";
--> statement-breakpoint
ALTER TABLE "template_metrics" ALTER COLUMN "metric_definition_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "template_metrics" ADD CONSTRAINT "template_metrics_metric_definition_id_metric_definitions_id_fk" FOREIGN KEY ("metric_definition_id") REFERENCES "public"."metric_definitions"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "template_metrics_metric_definition_id_idx" ON "template_metrics" USING btree ("metric_definition_id");--> statement-breakpoint
ALTER TABLE "template_metrics" DROP COLUMN "key";--> statement-breakpoint
ALTER TABLE "template_metrics" DROP COLUMN "data_type";--> statement-breakpoint
ALTER TABLE "template_metrics" DROP COLUMN "unit";--> statement-breakpoint
ALTER TABLE "template_metrics" DROP COLUMN "symbol";--> statement-breakpoint
ALTER TABLE "template_metrics" DROP COLUMN "label";--> statement-breakpoint
ALTER TABLE "template_metrics" ADD CONSTRAINT "template_metrics_version_id_metric_definition_id_unique" UNIQUE("template_version_id","metric_definition_id");