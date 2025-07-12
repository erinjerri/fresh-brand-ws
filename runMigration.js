import { Client } from 'pg'

const client = new Client({
  connectionString: process.env.DATABASE_URI, // Ensure this environment variable is set
})

async function runMigration() {
  try {
    await client.connect()
    const migrationSQL = `
      -- Your SQL commands here
      CREATE TABLE IF NOT EXISTS "media" (
        "id" serial PRIMARY KEY NOT NULL,
        "prefix" varchar
        -- Add other columns as needed
      );
    `
    await client.query(migrationSQL)
    console.log('Migration completed successfully.')
  } catch (error) {
    console.error('Error running migration:', error)
  } finally {
    await client.end()
  }
}

runMigration().catch(console.error)
