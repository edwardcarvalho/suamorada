/**
 * Seed com imóveis fictícios para desenvolvimento local.
 * Executar: npm run db:seed
 */
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as dotenv from "dotenv";
import * as schema from "./schema";

dotenv.config({ path: ".env.local" });

const pool = new Pool({ connectionString: process.env.DATABASE_URL?.replace("localhost", "127.0.0.1") });
const db = drizzle(pool, { schema });

// ── Fotos via picsum.photos (gratuito, sem autenticação, seed consistente) ────
// seed diferente = foto diferente mas sempre a mesma para o mesmo seed
const P = (seed: string, w = 1200, h = 800) =>
  `https://picsum.photos/seed/${seed}/${w}/${h}`;

const PHOTOS = {
  apartment: [
    P("apt-lisb-1"), P("apt-lisb-2"), P("apt-lisb-kit"), P("apt-lisb-bed"),
  ],
  apartment_alt: [
    P("apt-preal-1"), P("apt-preal-2"), P("apt-preal-kit"), P("apt-preal-bed"),
  ],
  apartment_small: [
    P("apt-small-1"), P("apt-small-2"), P("apt-small-bed"),
  ],
  house: [
    P("house-cascais-1"), P("house-cascais-2"), P("house-cascais-3"), P("house-cascais-4"),
  ],
  villa: [
    P("villa-sintra-1"), P("villa-sintra-pool"), P("villa-sintra-sala"), P("villa-sintra-kit"),
  ],
  luxury: [
    P("lux-foz-1"), P("lux-foz-2"), P("lux-foz-kit"), P("lux-foz-bed"),
  ],
  classic: [
    P("classic-mour-1"), P("classic-mour-2"), P("classic-mour-3"), P("classic-mour-4"),
  ],
};

// ── Imóveis ───────────────────────────────────────────────────────────────────
const SEED_PROPERTIES: (schema.NewProperty & { _photos: string[] })[] = [
  {
    slug: "apartamento-t2-campo-de-ourique-lisboa-a1b2c3",
    title: "Apartamento T2 com varanda e vista para jardim",
    description: "Excelente apartamento T2 situado no coração de Campo de Ourique, um dos bairros mais tranquilos e residenciais de Lisboa. O imóvel foi totalmente renovado em 2022, com acabamentos de qualidade superior, cozinha equipada com electrodomésticos de topo e casa de banho moderna.\n\nO apartamento dispõe de uma ampla varanda com exposição solar a Sul, soalho flutuante em toda a área habitável e janelas duplas para isolamento acústico e térmico.\n\nLocalizado a 5 minutos a pé do jardim, comércio local, supermercados e rede de transportes públicos.",
    propertyType: "apartment", listingType: "sale",
    price: 28500000, bedrooms: 2, bathrooms: 1,
    areaUseful: 85, areaGross: 95, floor: 3, totalFloors: 6,
    condition: "used", energyCertificate: "B",
    hasGarage: false, hasElevator: true, hasPool: false, hasGarden: false,
    features: ["Varanda", "Elevador", "Porteiro", "Arrecadação", "Cozinha equipada", "Ar condicionado"],
    lat: "38.7223", lng: "-9.1590",
    addressStreet: "Rua Ferreira Borges", addressParish: "Campo de Ourique",
    addressMunicipality: "Lisboa", addressDistrict: "Lisboa", addressPostalCode: "1350-119",
    status: "active", verified: true, featured: true,
    viewsCount: 142, contactsCount: 12, publishedAt: new Date("2026-05-27"),
    _photos: PHOTOS.apartment,
  },
  {
    slug: "apartamento-t1-mouraria-lisboa-d4e5f6",
    title: "Apartamento T1 renovado no coração da Mouraria",
    description: "Charme e modernidade no bairro mais histórico de Lisboa. Totalmente remodelado com materiais premium, este T1 combina a autenticidade lisboeta com todo o conforto contemporâneo.\n\nSoalho em madeira original restaurada, tecto em abóbada, janelas duplas e cozinha totalmente equipada. A 5 minutos a pé do Castelo de São Jorge.",
    propertyType: "apartment", listingType: "sale",
    price: 19500000, bedrooms: 1, bathrooms: 1,
    areaUseful: 52, areaGross: 58, floor: 2, totalFloors: 4,
    condition: "used", energyCertificate: "C",
    hasGarage: false, hasElevator: false, hasPool: false, hasGarden: false,
    features: ["Soalho de madeira", "Cozinha equipada", "Armários embutidos"],
    lat: "38.7148", lng: "-9.1345",
    addressStreet: "Rua da Mouraria", addressParish: "Santa Maria Maior",
    addressMunicipality: "Lisboa", addressDistrict: "Lisboa", addressPostalCode: "1100-351",
    status: "active", verified: true, featured: false,
    viewsCount: 98, contactsCount: 7, publishedAt: new Date("2026-05-22"),
    _photos: PHOTOS.classic,
  },
  {
    slug: "moradia-t3-cascais-lisboa-g7h8i9",
    title: "Moradia T3 com jardim e garagem em Cascais",
    description: "Moradia isolada com jardim privado de 300m², garagem para 2 carros e piscina aquecida. A 5 minutos da praia do Guincho e 10 minutos do centro de Cascais.\n\nCozinha americana com ilha, sala de estar com lareira, suite principal com closet. Acabamentos de qualidade superior.",
    propertyType: "house", listingType: "sale",
    price: 42000000, bedrooms: 3, bathrooms: 2,
    areaUseful: 140, areaGross: 165, floor: 0, totalFloors: 2,
    condition: "used", energyCertificate: "B",
    hasGarage: true, hasElevator: false, hasPool: true, hasGarden: true,
    features: ["Piscina", "Jardim", "Garagem", "Lareira", "Cozinha equipada", "Arrecadação"],
    lat: "38.6968", lng: "-9.4205",
    addressStreet: "Rua das Palmeiras", addressParish: "Cascais",
    addressMunicipality: "Cascais", addressDistrict: "Lisboa", addressPostalCode: "2750-451",
    status: "active", verified: true, featured: false,
    viewsCount: 203, contactsCount: 18, publishedAt: new Date("2026-05-15"),
    _photos: PHOTOS.house,
  },
  {
    slug: "apartamento-t2-principe-real-lisboa-j0k1l2",
    title: "Apartamento T2 mobilado no Príncipe Real",
    description: "Apartamento completamente mobilado e equipado em pleno Príncipe Real. Disponível imediatamente, ideal para expatriados ou estadias de longa duração.\n\nMobiliário de design, electrodomésticos topo de gama, internet fibra incluída. A 2 minutos do Jardim das Flores.",
    propertyType: "apartment", listingType: "rent",
    price: 135000, bedrooms: 2, bathrooms: 1,
    areaUseful: 78, areaGross: 85, floor: 1, totalFloors: 3,
    condition: "used", energyCertificate: "C",
    hasGarage: false, hasElevator: false, hasPool: false, hasGarden: false,
    features: ["Mobilado", "Cozinha equipada", "Ar condicionado", "Internet fibra"],
    lat: "38.7183", lng: "-9.1501",
    addressStreet: "Rua Dom Pedro V", addressParish: "Misericórdia",
    addressMunicipality: "Lisboa", addressDistrict: "Lisboa", addressPostalCode: "1250-093",
    status: "active", verified: false, featured: true,
    viewsCount: 87, contactsCount: 9, publishedAt: new Date("2026-05-28"),
    _photos: PHOTOS.apartment_alt,
  },
  {
    slug: "vivenda-t4-sintra-lisboa-m3n4o5",
    title: "Vivenda T4 com piscina em Sintra",
    description: "Deslumbrante vivenda em Sintra com vistas panorâmicas para a Serra. Piscina exterior aquecida, jardim landscaped por arquitecto paisagista e garagem para 3 viaturas.\n\nSuite principal com casa de banho privativa e dressing room, sala de cinema, ginásio. Domótica Somfy integrada.",
    propertyType: "villa", listingType: "sale",
    price: 89500000, bedrooms: 4, bathrooms: 3,
    areaUseful: 280, areaGross: 320, floor: 0, totalFloors: 2,
    condition: "used", energyCertificate: "A",
    hasGarage: true, hasElevator: false, hasPool: true, hasGarden: true,
    features: ["Piscina", "Jardim", "Garagem", "Lareira", "Domótica", "Ginásio", "Ar condicionado"],
    lat: "38.7978", lng: "-9.3880",
    addressStreet: "Estrada da Lagoa Azul", addressParish: "Sintra",
    addressMunicipality: "Sintra", addressDistrict: "Lisboa", addressPostalCode: "2710-405",
    status: "active", verified: true, featured: true,
    viewsCount: 341, contactsCount: 28, publishedAt: new Date("2026-05-10"),
    _photos: PHOTOS.villa,
  },
  {
    slug: "apartamento-t3-porto-foz-p6q7r8",
    title: "Apartamento T3 novo na Foz do Douro",
    description: "Apartamento novo em condomínio fechado premium com piscina coberta, ginásio e concierge 24h. Vista mar parcial do quarto principal.\n\nAcabamentos de luxo: mármore Carrara, caixilharia a corte térmico, estores motorizados. Cozinha Siematic com electrodomésticos Gaggenau.",
    propertyType: "apartment", listingType: "sale",
    price: 52000000, bedrooms: 3, bathrooms: 2,
    areaUseful: 125, areaGross: 140, floor: 5, totalFloors: 8,
    condition: "new", energyCertificate: "A+",
    hasGarage: true, hasElevator: true, hasPool: true, hasGarden: false,
    features: ["Piscina", "Elevador", "Garagem", "Ginásio", "Porteiro", "Ar condicionado", "Varanda"],
    lat: "41.1512", lng: "-8.6765",
    addressStreet: "Av. do Brasil", addressParish: "Foz do Douro",
    addressMunicipality: "Porto", addressDistrict: "Porto", addressPostalCode: "4150-155",
    status: "active", verified: true, featured: true,
    viewsCount: 267, contactsCount: 22, publishedAt: new Date("2026-05-18"),
    _photos: PHOTOS.luxury,
  },
  {
    slug: "apartamento-t1-bonfim-porto-s9t0u1",
    title: "Apartamento T1 remodelado no Bonfim",
    description: "Apartamento charmoso em edifício de 1900 totalmente remodelado. Pé-direito alto de 3,20m, soalho de madeira original recuperado, vigas de ferro aparentes.\n\nCozinha integrada, casa de banho com base de duche e banheira, roupa branca incluída. Óptimo para estudantes ou jovens profissionais.",
    propertyType: "apartment", listingType: "rent",
    price: 85000, bedrooms: 1, bathrooms: 1,
    areaUseful: 45, areaGross: 50, floor: 2, totalFloors: 4,
    condition: "used", energyCertificate: "D",
    hasGarage: false, hasElevator: false, hasPool: false, hasGarden: false,
    features: ["Soalho de madeira", "Cozinha equipada", "Varanda"],
    lat: "41.1452", lng: "-8.6102",
    addressStreet: "Rua de Serpa Pinto", addressParish: "Bonfim",
    addressMunicipality: "Porto", addressDistrict: "Porto", addressPostalCode: "4300-447",
    status: "active", verified: true, featured: false,
    viewsCount: 156, contactsCount: 14, publishedAt: new Date("2026-05-20"),
    _photos: PHOTOS.apartment_small,
  },
  {
    slug: "moradia-t4-braga-centro-v2w3x4",
    title: "Moradia T4 com jardim no centro de Braga",
    description: "Espaçosa moradia em banda no coração de Braga. Jardim frontal e traseiro com fruteiras, garagem para 2 carros e arrumos.\n\nSala de estar com lareira, cozinha semi-equipada, 4 quartos (1 suite), 3 casas de banho. Excelente estado de conservação.",
    propertyType: "house", listingType: "sale",
    price: 31000000, bedrooms: 4, bathrooms: 3,
    areaUseful: 185, areaGross: 210, floor: 0, totalFloors: 3,
    condition: "used", energyCertificate: "C",
    hasGarage: true, hasElevator: false, hasPool: false, hasGarden: true,
    features: ["Jardim", "Garagem", "Lareira", "Arrecadação"],
    lat: "41.5518", lng: "-8.4229",
    addressStreet: "Rua Dom Paio Mendes", addressParish: "Braga",
    addressMunicipality: "Braga", addressDistrict: "Braga", addressPostalCode: "4700-025",
    status: "active", verified: true, featured: false,
    viewsCount: 118, contactsCount: 8, publishedAt: new Date("2026-05-12"),
    _photos: PHOTOS.house,
  },
  {
    slug: "apartamento-t2-setubal-centro-y5z6a7",
    title: "Apartamento T2 no centro de Setúbal",
    description: "Apartamento bem localizado a 2 minutos do centro comercial e principais serviços. Ideal para investimento com rendimento garantido.\n\nDois quartos amplos, sala com varanda, cozinha independente. Elevador no prédio. Excelente oportunidade de negócio.",
    propertyType: "apartment", listingType: "sale",
    price: 14500000, bedrooms: 2, bathrooms: 1,
    areaUseful: 68, areaGross: 75, floor: 1, totalFloors: 5,
    condition: "used", energyCertificate: "E",
    hasGarage: false, hasElevator: true, hasPool: false, hasGarden: false,
    features: ["Elevador", "Varanda"],
    lat: "38.5238", lng: "-8.8936",
    addressStreet: "Rua Bocage", addressParish: "Setúbal",
    addressMunicipality: "Setúbal", addressDistrict: "Setúbal", addressPostalCode: "2900-116",
    status: "active", verified: false, featured: false,
    viewsCount: 64, contactsCount: 5, publishedAt: new Date("2026-05-25"),
    _photos: PHOTOS.apartment_alt,
  },
  {
    slug: "apartamento-t3-faro-gambelas-b8c9d0",
    title: "Apartamento T3 perto da Ria Formosa em Faro",
    description: "Moderno apartamento com vista deslumbrante para a Ria Formosa. Condomínio fechado com piscina, segurança 24h e parque de estacionamento coberto.\n\nT3 com suite, dois quartos, sala com acesso a terraço de 30m², cozinha equipada. Acabamentos de alta qualidade.",
    propertyType: "apartment", listingType: "sale",
    price: 38500000, bedrooms: 3, bathrooms: 2,
    areaUseful: 110, areaGross: 125, floor: 4, totalFloors: 6,
    condition: "new", energyCertificate: "A",
    hasGarage: true, hasElevator: true, hasPool: true, hasGarden: false,
    features: ["Piscina", "Elevador", "Garagem", "Terraço", "Porteiro", "Ar condicionado"],
    lat: "37.0193", lng: "-7.9304",
    addressStreet: "Av. da República", addressParish: "Faro",
    addressMunicipality: "Faro", addressDistrict: "Faro", addressPostalCode: "8000-078",
    status: "active", verified: true, featured: true,
    viewsCount: 189, contactsCount: 16, publishedAt: new Date("2026-05-08"),
    _photos: PHOTOS.luxury,
  },
];

// ── Seed ──────────────────────────────────────────────────────────────────────
async function seed() {
  console.log("🌱 A fazer seed da base de dados...");

  // Limpa na ordem correcta (FK constraints)
  await db.delete(schema.propertyImages);
  await db.delete(schema.properties);
  console.log("  ✓ Tabelas limpas");

  // Insere imóveis e obtém os IDs gerados
  const inserted = await db
    .insert(schema.properties)
    .values(SEED_PROPERTIES.map(({ _photos: _, ...p }) => p))
    .returning({ id: schema.properties.id, slug: schema.properties.slug });

  console.log(`  ✓ ${inserted.length} imóveis inseridos`);

  // Constrói as imagens para cada imóvel
  type NewImage = typeof schema.propertyImages.$inferInsert;
  const images: NewImage[] = [];
  for (const { id, slug } of inserted) {
    const prop = SEED_PROPERTIES.find((p) => p.slug === slug)!;
    prop._photos.forEach((url, i) => {
      images.push({
        propertyId: id,
        url,
        position: i,
        isCover: i === 0,
        width: 1200,
        height: 800,
      });
    });
  }

  await db.insert(schema.propertyImages).values(images);
  console.log(`  ✓ ${images.length} imagens inseridas`);

  await pool.end();
  console.log("✅ Seed concluído!");
}

seed().catch((err) => {
  console.error("❌ Erro no seed:", err);
  pool.end();
  process.exit(1);
});

