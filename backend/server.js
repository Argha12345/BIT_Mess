import app from './src/app.js';
import { getMongoDb } from './src/database/dbDriver.js';

const PORT = process.env.PORT || 5000;

app.listen(PORT, '0.0.0.0', async () => {
  console.log(`==================================================`);
  console.log(`  BIT Hostel Mess Analytics Server Running on:     `);
  console.log(`  http://localhost:${PORT}                        `);
  console.log(`  Mode: ${process.env.NODE_ENV || 'development'}  `);

  try {
    const mongoDb = await getMongoDb();
    if (mongoDb) {
      console.log(`  Database: MongoDB (Connected)                   `);
      console.log(`  Compass URI: ${process.env.MONGODB_URI.replace(/:([^:@]+)@/, ':****@')}`);
    } else {
      console.log(`  Database: Local JSON (backend/data)             `);
      console.log(`  To connect MongoDB Compass:                     `);
      console.log(`  Add MONGODB_URI in backend/.env                 `);
    }
  } catch (err) {
    console.log(`  Database: Fallback to JSON (${err.message})     `);
  }
  console.log(`==================================================`);
});
