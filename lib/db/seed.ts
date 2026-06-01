/**
 * Seed com 20 imóveis fictícios para desenvolvimento local.
 * Executar: npx tsx lib/db/seed.ts
 */
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as dotenv from "dotenv";
import * as schema from "./schema";

dotenv.config({ path: ".env.local" });

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const db = drizzle(pool, { schema });

const SEED_PROPERTIES: schema.NewProperty[] = [
  {
    slug: "apartamento-t2-campo-de-ourique-lisboa-a1b2c3",
    title: "Apartamento T2 com varanda e vista para jardim",
    description: "Excelente apartamento T2 em Campo de Ourique. Totalmente renovado em 2022, cozinha equipada, casa de banho moderna. Perto do Jardim da Parada.",
    propertyType: "apartment", listingType: "sale",
    price: 28500000, bedrooms: 2, bathrooms: 1,
    areaUseful: 85, areaGross: 95, floor: 3, totalFloors: 6,
    condition: "used", energyCertificate: "B",
    hasGarage: false, hasElevator: true, hasPool: false, hasGarden: false,
    lat: "38.7223", lng: "-9.1590",
    addressStreet: "Rua Ferreira Borges", addressParish: "Campo de Ourique",
    addressMunicipality: "Lisboa", addressDistrict: "Lisboa",
    addressPostalCode: "1350-119",
    status: "active", verified: true, featured: true,
    viewsCount: 142, contactsCount: 12,
    publishedAt: new Date("2026-05-27"),
  },
  {
    slug: "apartamento-t1-mouraria-lisboa-d4e5f6",
    title: "Apartamento T1 renovado no coração da Mouraria",
    description: "Charme e modernidade no bairro mais histórico de Lisboa. Totalmente remodelado com materiais premium.",
    propertyType: "apartment", listingType: "sale",
    price: 19500000, bedrooms: 1, bathrooms: 1,
    areaUseful: 52, areaGross: 58, floor: 2, totalFloors: 4,
    condition: "used", energyCertificate: "C",
    hasGarage: false, hasElevator: false, hasPool: false, hasGarden: false,
    lat: "38.7148", lng: "-9.1345",
    addressStreet: "Rua da Mouraria", addressParish: "Santa Maria Maior",
    addressMunicipality: "Lisboa", addressDistrict: "Lisboa",
    addressPostalCode: "1100-351",
    status: "active", verified: true, featured: false,
    viewsCount: 98, contactsCount: 7,
    publishedAt: new Date("2026-05-22"),
  },
  {
    slug: "moradia-t3-cascais-lisboa-g7h8i9",
    title: "Moradia T3 com jardim e garagem em Cascais",
    description: "Moradia isolada com jardim privado de 300m², garagem para 2 carros e piscina. A 5 minutos da praia.",
    propertyType: "house", listingType: "sale",
    price: 42000000, bedrooms: 3, bathrooms: 2,
    areaUseful: 140, areaGross: 165, floor: 0, totalFloors: 2,
    condition: "used", energyCertificate: "B",
    hasGarage: true, hasElevator: false, hasPool: true, hasGarden: true,
    lat: "38.6968", lng: "-9.4205",
    addressStreet: "Rua das Palmeiras", addressParish: "Cascais",
    addressMunicipality: "Cascais", addressDistrict: "Lisboa",
    addressPostalCode: "2750-451",
    status: "active", verified: true, featured: false,
    viewsCount: 203, contactsCount: 18,
    publishedAt: new Date("2026-05-15"),
  },
  {
    slug: "apartamento-t2-principe-real-lisboa-j0k1l2",
    title: "Apartamento T2 mobilado no Príncipe Real",
    description: "Apartamento completamente mobilado e equipado. Disponível imediatamente. Ideal para expatriados.",
    propertyType: "apartment", listingType: "rent",
    price: 135000, bedrooms: 2, bathrooms: 1,
    areaUseful: 78, areaGross: 85, floor: 1, totalFloors: 3,
    condition: "used", energyCertificate: "C",
    hasGarage: false, hasElevator: false, hasPool: false, hasGarden: false,
    lat: "38.7183", lng: "-9.1501",
    addressStreet: "Rua Dom Pedro V", addressParish: "Misericórdia",
    addressMunicipality: "Lisboa", addressDistrict: "Lisboa",
    addressPostalCode: "1250-093",
    status: "active", verified: false, featured: true,
    viewsCount: 87, contactsCount: 9,
    publishedAt: new Date("2026-05-28"),
  },
  {
    slug: "vivenda-t4-sintra-lisboa-m3n4o5",
    title: "Vivenda T4 com piscina em Sintra",
    description: "Deslumbrante vivenda em Sintra com vistas panorâmicas para a Serra. Piscina exterior, jardim landscaped e garagem.",
    propertyType: "villa", listingType: "sale",
    price: 89500000, bedrooms: 4, bathrooms: 3,
    areaUseful: 280, areaGross: 320, floor: 0, totalFloors: 2,
    condition: "used", energyCertificate: "A",
    hasGarage: true, hasElevator: false, hasPool: true, hasGarden: true,
    lat: "38.7978", lng: "-9.3880",
    addressStreet: "Estrada da Lagoa Azul", addressParish: "Sintra",
    addressMunicipality: "Sintra", addressDistrict: "Lisboa",
    addressPostalCode: "2710-405",
    status: "active", verified: true, featured: true,
    viewsCount: 341, contactsCount: 28,
    publishedAt: new Date("2026-05-10"),
  },
  {
    slug: "apartamento-t3-porto-foz-p6q7r8",
    title: "Apartamento T3 novo na Foz do Douro",
    description: "Apartamento novo em condomínio fechado com piscina e ginásio. Vista mar parcial. Acabamentos de luxo.",
    propertyType: "apartment", listingType: "sale",
    price: 52000000, bedrooms: 3, bathrooms: 2,
    areaUseful: 125, areaGross: 140, floor: 5, totalFloors: 8,
    condition: "new", energyCertificate: "A+",
    hasGarage: true, hasElevator: true, hasPool: true, hasGarden: false,
    lat: "41.1512", lng: "-8.6765",
    addressStreet: "Av. do Brasil", addressParish: "Foz do Douro",
    addressMunicipality: "Porto", addressDistrict: "Porto",
    addressPostalCode: "4150-155",
    status: "active", verified: true, featured: true,
    viewsCount: 267, contactsCount: 22,
    publishedAt: new Date("2026-05-18"),
  },
  {
    slug: "apartamento-t1-bonfim-porto-s9t0u1",
    title: "Apartamento T1 remodelado no Bonfim",
    description: "Apartamento charmoso em edifício de 1900 totalmente remodelado. Pé-direito alto, soalho de madeira original.",
    propertyType: "apartment", listingType: "rent",
    price: 85000, bedrooms: 1, bathrooms: 1,
    areaUseful: 45, areaGross: 50, floor: 2, totalFloors: 4,
    condition: "used", energyCertificate: "D",
    hasGarage: false, hasElevator: false, hasPool: false, hasGarden: false,
    lat: "41.1452", lng: "-8.6102",
    addressStreet: "Rua de Serpa Pinto", addressParish: "Bonfim",
    addressMunicipality: "Porto", addressDistrict: "Porto",
    addressPostalCode: "4300-447",
    status: "active", verified: true, featured: false,
    viewsCount: 156, contactsCount: 14,
    publishedAt: new Date("2026-05-20"),
  },
  {
    slug: "moradia-t4-braga-centro-v2w3x4",
    title: "Moradia T4 com jardim no centro de Braga",
    description: "Espaçosa moradia em banda no coração de Braga. Jardim frontal e traseiro, garagem e arrumos.",
    propertyType: "house", listingType: "sale",
    price: 31000000, bedrooms: 4, bathrooms: 3,
    areaUseful: 185, areaGross: 210, floor: 0, totalFloors: 3,
    condition: "used", energyCertificate: "C",
    hasGarage: true, hasElevator: false, hasPool: false, hasGarden: true,
    lat: "41.5518", lng: "-8.4229",
    addressStreet: "Rua Dom Paio Mendes", addressParish: "Braga",
    addressMunicipality: "Braga", addressDistrict: "Braga",
    addressPostalCode: "4700-025",
    status: "active", verified: true, featured: false,
    viewsCount: 118, contactsCount: 8,
    publishedAt: new Date("2026-05-12"),
  },
  {
    slug: "apartamento-t2-setubal-centro-y5z6a7",
    title: "Apartamento T2 no centro de Setúbal",
    description: "Apartamento bem localizado a 2 minutos do centro comercial e transportes. Ideal para investimento.",
    propertyType: "apartment", listingType: "sale",
    price: 14500000, bedrooms: 2, bathrooms: 1,
    areaUseful: 68, areaGross: 75, floor: 1, totalFloors: 5,
    condition: "used", energyCertificate: "E",
    hasGarage: false, hasElevator: true, hasPool: false, hasGarden: false,
    lat: "38.5238", lng: "-8.8936",
    addressStreet: "Rua Bocage", addressParish: "Setúbal",
    addressMunicipality: "Setúbal", addressDistrict: "Setúbal",
    addressPostalCode: "2900-116",
    status: "active", verified: false, featured: false,
    viewsCount: 64, contactsCount: 5,
    publishedAt: new Date("2026-05-25"),
  },
  {
    slug: "apartamento-t3-faro-gambelas-b8c9d0",
    title: "Apartamento T3 perto da Ria Formosa em Faro",
    description: "Moderno apartamento com vista para a Ria Formosa. Condomínio com piscina e segurança 24h.",
    propertyType: "apartment", listingType: "sale",
    price: 38500000, bedrooms: 3, bathrooms: 2,
    areaUseful: 110, areaGross: 125, floor: 4, totalFloors: 6,
    condition: "new", energyCertificate: "A",
    hasGarage: true, hasElevator: true, hasPool: true, hasGarden: false,
    lat: "37.0193", lng: "-7.9304",
    addressStreet: "Av. da República", addressParish: "Faro",
    addressMunicipality: "Faro", addressDistrict: "Faro",
    addressPostalCode: "8000-078",
    status: "active", verified: true, featured: true,
    viewsCount: 189, contactsCount: 16,
    publishedAt: new Date("2026-05-08"),
  },
];

async function seed() {
  console.log("🌱 A fazer seed da base de dados...");

  await db.delete(schema.properties);
  console.log("  ✓ Tabela properties limpa");

  await db.insert(schema.properties).values(SEED_PROPERTIES);
  console.log(`  ✓ ${SEED_PROPERTIES.length} imóveis inseridos`);

  await pool.end();
  console.log("✅ Seed concluído!");
}

seed().catch((err) => {
  console.error("❌ Erro no seed:", err);
  pool.end();
  process.exit(1);
});
