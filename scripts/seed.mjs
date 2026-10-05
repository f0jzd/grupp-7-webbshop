import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { createClient } from "@supabase/supabase-js";

// Read Supabase credentials
const dbUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const dbKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!dbUrl || !dbKey) {
  console.error("Please ensure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are in .env.local");
  process.exit(1);
}

const supabase = createClient(dbUrl, dbKey);

async function runImport() {
  const raw = readFileSync(resolve("server/products.json"), "utf8");
  const parsed = JSON.parse(raw);

  // 1. Upload Categories
  console.log("Uploading categories...");
  const categoryRows = parsed.categories.map(({ id, name, slug }) => ({
    id,
    name,
    slug,
  }));

  const { error: catError } = await supabase
    .from("categories")
    .upsert(categoryRows);

  if (catError) {
    throw new Error(`Categories failed: ${catError.message}`);
  }
  console.log(`Uploaded ${categoryRows.length} categories.`);

  // 2. Upload Products
  console.log("Uploading products...");
  const { error: prodError } = await supabase
    .from("products")
    .upsert(parsed.products);

  if (prodError) {
    throw new Error(`Products failed: ${prodError.message}`);
  }
  console.log(`Uploaded ${parsed.products.length} products.`);
}

runImport()
  .then(() => console.log("Seeding complete!"))
  .catch((err) => console.error("Error:", err.message));