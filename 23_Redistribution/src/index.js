import { Pool } from 'pg';
import AWS from 'aws-sdk';

let pool;

const DB_SECRET_ARN = process.env.DB_SECRET_ARN;
const DB_NAME = process.env.DB_NAME;

async function getPool() {
  if (!pool) {
    const secretsManager = new AWS.SecretsManager();
    const secret = await secretsManager.getSecretValue({ SecretId: DB_SECRET_ARN }).promise();
    const secretData = JSON.parse(secret.SecretString);
    console.log(secretData);
    pool = new Pool({
      user: 'postgres',
      host: secretData.host,
      database: DB_NAME,
      password: secretData.password,
      port: secretData.port,
      ssl: { rejectUnauthorized: false }
    });
  }
  return pool;
}

async function createTransaction(client, username, store_id) {
  await client.query('BEGIN');
  await client.query('INSERT INTO users (username, store_id) VALUES ($1, $2)', [username, store_id]);
  await client.query('UPDATE store_usage SET count = count + 1 WHERE store_id = $1', [store_id]);
  await client.query('COMMIT');
}

export const handler = async (event) => {
  const headers = { 'Content-Type': 'application/json' };
  const clientPool = await getPool();
  const client = await clientPool.connect();
  const { username, store_id } = JSON.parse(event.body);
  
  try {
    if (!username || !store_id)
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ message: 'Username and store_id required' }),
      };
    
    const storeData = await client.query('SELECT * FROM stores WHERE id = $1', [store_id]);
    
    if (storeData.rows.length === 0)
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ message: 'Store not found' }),
      };

    const requestCount = await client.query('SELECT count from store_usage where store_id=$1',
      [store_id]
    );

    if(requestCount.rows[0].count >= 10000)
      return {
        statusCode: 429,
        headers,
        body: JSON.stringify({ message: 'Limit reached' }),
      };

      await createTransaction(client, username, store_id);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ message: 'User created successfully' }),
    };

  } catch (error) {
    console.error('Error:', error);
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ message: 'Something went wrong' }),
    };
  } finally {
    client.release();
  }
};
