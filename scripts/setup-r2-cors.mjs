/**
 * Configura CORS no bucket R2 para permitir uploads directos do browser.
 * Executar: node scripts/setup-r2-cors.mjs
 */
import { S3Client, PutBucketCorsCommand, GetBucketCorsCommand } from "@aws-sdk/client-s3";
import { config } from "dotenv";
import { resolve } from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
config({ path: resolve(__dirname, "../.env.local") });

const {
  CLOUDFLARE_R2_ACCOUNT_ID,
  CLOUDFLARE_R2_ACCESS_KEY_ID,
  CLOUDFLARE_R2_SECRET_ACCESS_KEY,
  CLOUDFLARE_R2_BUCKET_NAME = "suamorada-images",
} = process.env;

if (!CLOUDFLARE_R2_ACCOUNT_ID || !CLOUDFLARE_R2_ACCESS_KEY_ID || !CLOUDFLARE_R2_SECRET_ACCESS_KEY) {
  console.error("❌ Credenciais R2 em falta no .env.local");
  process.exit(1);
}

const r2 = new S3Client({
  region: "auto",
  endpoint: `https://${CLOUDFLARE_R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId:     CLOUDFLARE_R2_ACCESS_KEY_ID,
    secretAccessKey: CLOUDFLARE_R2_SECRET_ACCESS_KEY,
  },
});

const corsRules = {
  CORSRules: [
    {
      AllowedOrigins: ["*"],                                  // restringe em prod
      AllowedMethods: ["GET", "PUT", "HEAD"],
      AllowedHeaders: ["Content-Type", "Content-Length"],
      MaxAgeSeconds:  3600,
    },
  ],
};

async function main() {
  console.log(`🔧 Configurar CORS no bucket: ${CLOUDFLARE_R2_BUCKET_NAME}`);

  try {
    await r2.send(new PutBucketCorsCommand({
      Bucket:            CLOUDFLARE_R2_BUCKET_NAME,
      CORSConfiguration: corsRules,
    }));
    console.log("✅ CORS configurado com sucesso!");

    // Verificar
    const res = await r2.send(new GetBucketCorsCommand({ Bucket: CLOUDFLARE_R2_BUCKET_NAME }));
    console.log("📋 Regras activas:", JSON.stringify(res.CORSRules, null, 2));
  } catch (err) {
    console.error("❌ Erro:", err.message);
    process.exit(1);
  }
}

main();
