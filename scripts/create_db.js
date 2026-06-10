const { Client } = require('pg');

async function main() {
  const env = process.env.DATABASE_URL;
  if (!env) {
    console.error('DATABASE_URL not set');
    process.exit(1);
  }

  try {
    const url = new URL(env);
    const targetDb = url.pathname.replace(/^\//, '').split('?')[0] || 'emlakpro';
    // connect to default 'postgres' database to create target
    const baseUrl = new URL(env);
    baseUrl.pathname = '/postgres';

    const client = new Client({ connectionString: baseUrl.toString() });
    await client.connect();

    const res = await client.query('SELECT 1 FROM pg_database WHERE datname = $1', [targetDb]);
    if (res.rowCount === 0) {
      console.log(`Database ${targetDb} not found — creating...`);
      await client.query(`CREATE DATABASE "${targetDb}"`);
      console.log('Created database:', targetDb);
    } else {
      console.log('Database exists:', targetDb);
    }

    await client.end();
    process.exit(0);
  } catch (err) {
    console.error('Error creating/checking database:', err.message || err);
    process.exit(1);
  }
}

main();
