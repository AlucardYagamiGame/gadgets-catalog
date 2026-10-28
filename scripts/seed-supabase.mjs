import { readFile } from 'node:fs/promises';

const API_DIR = new URL('../public/api/', import.meta.url);
const CATEGORIES = ['phones', 'tablets', 'accessories'];
const BATCH_SIZE = 100;

const { SUPABASE_URL, SUPABASE_SECRET_KEY } = process.env;
const isDryRun = process.argv.includes('--dry-run');

if (!isDryRun && (!SUPABASE_URL || !SUPABASE_SECRET_KEY)) {
  console.error('Set SUPABASE_URL and SUPABASE_SECRET_KEY in .env');
  process.exit(1);
}

const readJson = async (name) =>
  JSON.parse(await readFile(new URL(name, API_DIR), 'utf-8'));

const buildRows = async () => {
  const cards = new Map(
    (await readJson('products.json')).map((card) => [card.itemId, card]),
  );
  const products = [];
  const translations = [];
  const conflicts = [];

  for (const category of CATEGORIES) {
    const en = await readJson(`${category}.json`);
    const ua = new Map(
      (await readJson(`${category}.ua.json`)).map((item) => [item.id, item]),
    );

    for (const details of en) {
      const card = cards.get(details.id);
      const translation = ua.get(details.id);

      if (!card || !translation) {
        throw new Error(`No matching card or UA record for ${details.id}`);
      }

      for (const [field, cardValue, detailsValue] of [
        ['price', card.price, details.priceDiscount],
        ['full_price', card.fullPrice, details.priceRegular],
      ]) {
        if (cardValue !== detailsValue) {
          conflicts.push(
            `${details.id}: ${field} card=${cardValue} details=${detailsValue}`,
          );
        }
      }

      products.push({
        item_id: details.id,
        id: card.id,
        namespace_id: details.namespaceId,
        category,
        name: details.name,
        year: card.year,
        price: card.price,
        full_price: card.fullPrice,
        capacity: details.capacity,
        color: details.color,
        ram: details.ram ?? null,
        screen: details.screen ?? null,
        resolution: details.resolution ?? null,
        processor: details.processor ?? null,
        camera: details.camera ?? null,
        image: card.image,
        images: details.images,
        capacity_available: details.capacityAvailable,
        colors_available: details.colorsAvailable,
      });

      for (const [language, source] of [
        ['en', details],
        ['ua', translation],
      ]) {
        translations.push({
          item_id: details.id,
          language,
          zoom: source.zoom ?? null,
          cell: source.cell ?? [],
          description: source.description ?? [],
        });
      }
    }
  }

  return { products, translations, conflicts };
};

const upsert = async (table, rows, onConflict) => {
  for (let start = 0; start < rows.length; start += BATCH_SIZE) {
    const batch = rows.slice(start, start + BATCH_SIZE);
    const response = await fetch(
      `${SUPABASE_URL}/rest/v1/${table}?on_conflict=${onConflict}`,
      {
        method: 'POST',
        headers: {
          'apikey': SUPABASE_SECRET_KEY,
          'Content-Type': 'application/json',
          'Prefer': 'resolution=merge-duplicates,return=minimal',
        },
        body: JSON.stringify(batch),
      },
    );

    if (!response.ok) {
      throw new Error(`${table}: ${response.status} ${await response.text()}`);
    }
  }

  console.log(`${table}: ${rows.length} rows`);
};

const { products, translations, conflicts } = await buildRows();

if (conflicts.length > 0) {
  console.warn(
    `Prices differ between products.json and details (kept products.json): ${conflicts.length}`,
  );
  conflicts.slice(0, 10).forEach((line) => console.warn(`  ${line}`));

  if (conflicts.length > 10) {
    console.warn(`  ...and ${conflicts.length - 10} more`);
  }
}

if (isDryRun) {
  console.log(
    `Dry run: ${products.length} products, ${translations.length} translations`,
  );
} else {
  await upsert('products', products, 'item_id');
  await upsert('product_translations', translations, 'item_id,language');
  console.log('Done');
}
