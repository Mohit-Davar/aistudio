import { and, eq, isNotNull, isNull } from "drizzle-orm";

import { db } from "@/db/client";
import { device, location } from "@/db/schema";

const publicLocationColumns = {
  id: location.id,
  name: location.name,
  organization_id: location.organizationId,
  parent_id: location.parentId,
  can_have_children: location.canHaveChildren,
};

export function listLocationsQuery(organisationId: string) {
  return db
    .select(publicLocationColumns)
    .from(location)
    .where(eq(location.organizationId, organisationId))
    .orderBy(location.name);
}

export async function findLocationQuery(id: string, organisationId: string) {
  const [row] = await db
    .select(publicLocationColumns)
    .from(location)
    .where(
      and(eq(location.id, id), eq(location.organizationId, organisationId)),
    )
    .limit(1);

  return row;
}

export async function insertLocationQuery(
  values: typeof location.$inferInsert,
) {
  const [row] = await db.insert(location).values(values).returning();

  return row;
}

export async function updateLocationQuery(
  id: string,
  organisationId: string,
  values: Partial<typeof location.$inferInsert>,
) {
  const [row] = await db
    .update(location)
    .set(values)
    .where(
      and(eq(location.id, id), eq(location.organizationId, organisationId)),
    )
    .returning();

  return row;
}

export async function removeLocationQuery(id: string, organisationId: string) {
  return db.transaction(async (tx) => {
    await tx
      .update(device)
      .set({ locationId: null })
      .where(
        and(
          eq(device.organizationId, organisationId),
          eq(device.locationId, id),
          isNotNull(device.deletedAt),
        ),
      );

    const [row] = await tx
      .delete(location)
      .where(
        and(eq(location.id, id), eq(location.organizationId, organisationId)),
      )
      .returning({ id: location.id });

    return row;
  });
}

export async function hasLocationChildrenQuery(
  id: string,
  organisationId: string,
) {
  const [row] = await db
    .select({ id: location.id })
    .from(location)
    .where(
      and(
        eq(location.parentId, id),
        eq(location.organizationId, organisationId),
      ),
    )
    .limit(1);

  return row !== undefined;
}

export async function hasLocationDevicesQuery(
  id: string,
  organisationId: string,
) {
  const [row] = await db
    .select({ id: device.id })
    .from(device)
    .innerJoin(location, eq(device.locationId, location.id))
    .where(
      and(
        eq(location.id, id),
        eq(location.organizationId, organisationId),
        isNull(device.deletedAt),
      ),
    )
    .limit(1);

  return row !== undefined;
}
