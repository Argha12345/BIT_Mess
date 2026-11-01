import app from './src/app.js';

const PORT = process.env.PORT || 5000;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`==================================================`);
  console.log(`  BIT Hostel Mess Analytics Server Running on:     `);
  console.log(`  http://localhost:${PORT}                        `);
  console.log(`  Mode: Development                              `);
  console.log(`==================================================`);
});
