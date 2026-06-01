import {
  pgTable, pgEnum, uuid, text, integer, boolean,
  timestamp, varchar, index, uniqueIndex,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

// ── Enums ─────────────────────────────────────────────────────────────────────
export const propertyTypeEnum = pgEnum("property_type", [
  "apartment", "house", "villa", "commercial", "land", "garage",
]);

export const listingTypeEnum = pgEnum("listing_type", ["sale", "rent"]);

export const conditionEnum = pgEnum("condition", [
  "new", "used", "needs_renovation", "under_construction",
]);

export const energyCertEnum = pgEnum("energy_certificate", [
  "A+", "A", "B", "B-", "C", "D", "E", "F", "exempt",
]);

export const propertyStatusEnum = pgEnum("property_status", [
  "draft", "pending_review", "active", "paused", "sold", "rented", "expired",
]);

export const userRoleEnum = pgEnum("user_role", [
  "buyer", "agent", "agency_admin", "admin",
]);

// ── Users ─────────────────────────────────────────────────────────────────────
export const users = pgTable("users", {
  id:            uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  email:         text("email").unique().notNull(),
  name:          text("name"),
  phone:         varchar("phone", { length: 20 }),
  role:          userRoleEnum("role").default("buyer").notNull(),
  avatarUrl:     text("avatar_url"),
  emailVerified: timestamp("email_verified"),
  createdAt:     timestamp("created_at").defaultNow().notNull(),
  updatedAt:     timestamp("updated_at").defaultNow().notNull(),
});

// ── Agencies ──────────────────────────────────────────────────────────────────
export const agencies = pgTable("agencies", {
  id:            uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  name:          text("name").notNull(),
  slug:          text("slug").unique().notNull(),
  logoUrl:       text("logo_url"),
  website:       text("website"),
  phone:         text("phone"),
  email:         text("email"),
  licenseNumber: text("license_number"),
  verified:      boolean("verified").default(false).notNull(),
  createdAt:     timestamp("created_at").defaultNow().notNull(),
});

// ── Properties ────────────────────────────────────────────────────────────────
export const properties = pgTable("properties", {
  id:               uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  slug:             text("slug").unique().notNull(),
  title:            text("title").notNull(),
  description:      text("description"),
  propertyType:     propertyTypeEnum("property_type").notNull(),
  listingType:      listingTypeEnum("listing_type").notNull(),
  // preço em cêntimos (evita floats)
  price:            integer("price").notNull(),
  priceNegotiable:  boolean("price_negotiable").default(false).notNull(),
  areaGross:        integer("area_gross"),
  areaUseful:       integer("area_useful"),
  bedrooms:         integer("bedrooms").notNull(),
  bathrooms:        integer("bathrooms"),
  floor:            integer("floor"),
  totalFloors:      integer("total_floors"),
  condition:        conditionEnum("condition"),
  energyCertificate:energyCertEnum("energy_certificate"),
  hasGarage:        boolean("has_garage").default(false).notNull(),
  hasElevator:      boolean("has_elevator").default(false).notNull(),
  hasPool:          boolean("has_pool").default(false).notNull(),
  hasGarden:        boolean("has_garden").default(false).notNull(),
  features:         text("features").array().default(sql`ARRAY[]::text[]`),
  // localização (PostGIS gerido via SQL raw nas queries)
  lat:              text("lat"),
  lng:              text("lng"),
  addressStreet:    text("address_street"),
  addressParish:    text("address_parish"),
  addressMunicipality: text("address_municipality").notNull(),
  addressDistrict:  text("address_district").notNull(),
  addressPostalCode:varchar("address_postal_code", { length: 8 }),
  status:           propertyStatusEnum("status").default("pending_review").notNull(),
  verified:         boolean("verified").default(false).notNull(),
  featured:         boolean("featured").default(false).notNull(),
  viewsCount:       integer("views_count").default(0).notNull(),
  contactsCount:    integer("contacts_count").default(0).notNull(),
  publishedAt:      timestamp("published_at"),
  expiresAt:        timestamp("expires_at"),
  // relações
  userId:           uuid("user_id").references(() => users.id),
  agencyId:         uuid("agency_id").references(() => agencies.id),
  createdAt:        timestamp("created_at").defaultNow().notNull(),
  updatedAt:        timestamp("updated_at").defaultNow().notNull(),
}, (table) => [
  index("idx_properties_status_type").on(table.status, table.listingType),
  index("idx_properties_municipality").on(table.addressMunicipality, table.status),
  index("idx_properties_district").on(table.addressDistrict, table.status),
  index("idx_properties_price").on(table.listingType, table.price),
  index("idx_properties_bedrooms").on(table.bedrooms),
  index("idx_properties_published").on(table.publishedAt),
]);

// ── Property Images ───────────────────────────────────────────────────────────
export const propertyImages = pgTable("property_images", {
  id:         uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  propertyId: uuid("property_id")
    .references(() => properties.id, { onDelete: "cascade" })
    .notNull(),
  url:       text("url").notNull(),
  position:  integer("position").default(0).notNull(),
  isCover:   boolean("is_cover").default(false).notNull(),
  width:     integer("width"),
  height:    integer("height"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => [
  index("idx_images_property").on(table.propertyId),
]);

// ── Leads / Contactos ─────────────────────────────────────────────────────────
export const leads = pgTable("leads", {
  id:         uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  propertyId: uuid("property_id")
    .references(() => properties.id, { onDelete: "cascade" })
    .notNull(),
  userId:     uuid("user_id").references(() => users.id),
  name:       text("name").notNull(),
  email:      text("email").notNull(),
  phone:      text("phone"),
  message:    text("message"),
  createdAt:  timestamp("created_at").defaultNow().notNull(),
}, (table) => [
  index("idx_leads_property").on(table.propertyId),
]);

// ── Favorites ─────────────────────────────────────────────────────────────────
export const favorites = pgTable("favorites", {
  userId:     uuid("user_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  propertyId: uuid("property_id").references(() => properties.id, { onDelete: "cascade" }).notNull(),
  createdAt:  timestamp("created_at").defaultNow().notNull(),
}, (table) => [
  uniqueIndex("idx_favorites_unique").on(table.userId, table.propertyId),
]);

// ── Saved Searches (alertas) ──────────────────────────────────────────────────
export const savedSearches = pgTable("saved_searches", {
  id:              uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  userId:          uuid("user_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  name:            text("name"),
  filters:         text("filters").notNull(), // JSON string
  active:          boolean("active").default(true).notNull(),
  lastNotifiedAt:  timestamp("last_notified_at"),
  createdAt:       timestamp("created_at").defaultNow().notNull(),
}, (table) => [
  index("idx_saved_searches_user").on(table.userId),
]);

// ── Types exportados do schema ─────────────────────────────────────────────────
export type User             = typeof users.$inferSelect;
export type NewUser          = typeof users.$inferInsert;
export type Agency           = typeof agencies.$inferSelect;
export type Property         = typeof properties.$inferSelect;
export type NewProperty      = typeof properties.$inferInsert;
export type PropertyImage    = typeof propertyImages.$inferSelect;
export type Lead             = typeof leads.$inferSelect;
export type NewLead          = typeof leads.$inferInsert;
export type Favorite         = typeof favorites.$inferSelect;
export type SavedSearch      = typeof savedSearches.$inferSelect;
