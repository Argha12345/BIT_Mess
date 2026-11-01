import fs from 'fs/promises';
import existsFs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = process.env.DATA_DIR || path.join(__dirname, '..', '..', 'data');
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017';
const DB_NAME = process.env.MONGODB_DB_NAME || 'bit_mess';

const COLLECTIONS = [
  'users',
  'menu',
  'waste',
  'feedback',
  'announcements',
  'polls',
  'notifications',
  'reservations',
  'bookings',
  'checkins'
];

async function seed() {
  console.log(`Connecting to MongoDB at: ${MONGODB_URI.replace(/:([^:@]+)@/, ':****@')}`);
  const client = new MongoClient(MONGODB_URI);
  try {
    await client.connect();
    console.log(`Connected successfully. Seeding database: ${DB_NAME}`);
    const db = client.db(DB_NAME);

    for (const name of COLLECTIONS) {
      const filePath = path.join(DATA_DIR, `${name}.json`);
      if (existsFs.existsSync(filePath)) {
        const raw = await fs.readFile(filePath, 'utf-8');
        try {
          const records = JSON.parse(raw);
          if (Array.isArray(records) && records.length > 0) {
            const coll = db.collection(name);
            await coll.deleteMany({});
            const docs = records.map(r => {
              const { _id, ...clean } = r;
              return clean;
            });
            await coll.insertMany(docs);
            console.log(`  ✓ Seeded '${name}': ${docs.length} documents`);
          } else {
            console.log(`  - '${name}': 0 documents (empty file)`);
          }
        } catch (e) {
          console.warn(`  ! Could not parse ${name}.json: ${e.message}`);
        }
      }
    }
    console.log('\nAll collections successfully seeded into MongoDB!');
    console.log('You can now open MongoDB Compass and inspect the "bit_mess" database.');
  } catch (err) {
    console.error('Failed to seed MongoDB:', err.message);
  } finally {
    await client.close();
  }
}

seed();

