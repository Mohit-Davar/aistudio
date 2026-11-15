ALTER TABLE "dashboards" DROP CONSTRAINT "dashboards_scope_check";--> statement-breakpoint
ALTER TABLE "dashboards" DROP CONSTRAINT "dashboards_scope_target_check";--> statement-breakpoint
DROP INDEX "dashboards_default_unique";--> statement-breakpoint
ALTER TABLE "dashboards" ADD COLUMN "template_id" text;--> statement-breakpoint
ALTER TABLE "dashboards" ADD CONSTRAINT "dashboards_template_same_organization_fk" FOREIGN KEY ("organization_id","template_id") REFERENCES "public"."device_templates"("organization_id","id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "dashboards_default_unique" ON "dashboards" USING btree ("organization_id","scope",coalesce("location_id", "device_id", "template_id", '')) WHERE "dashboards"."is_default";--> statement-breakpoint
ALTER TABLE "dashboards" ADD CONSTRAINT "dashboards_scope_check" CHECK ("dashboards"."scope" in ('organisation', 'location', 'device', 'template'));--> statement-breakpoint
ALTER TABLE "dashboards" ADD CONSTRAINT "dashboards_scope_target_check" CHECK (("dashboards"."scope" = 'organisation' and num_nonnulls("dashboards"."location_id", "dashboards"."device_id", "dashboards"."template_id") = 0)
        or ("dashboards"."scope" = 'location' and "dashboards"."location_id" is not null and num_nonnulls("dashboards"."device_id", "dashboards"."template_id") = 0)
        or ("dashboards"."scope" = 'device' and "dashboards"."device_id" is not null and num_nonnulls("dashboards"."location_id", "dashboards"."template_id") = 0)
        or ("dashboards"."scope" = 'template' and "dashboards"."template_id" is not null and num_nonnulls("dashboards"."location_id", "dashboards"."device_id") = 0));