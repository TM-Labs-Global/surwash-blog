import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const projectId = process.env.SANITY_PROJECT_ID;
const dataset = process.env.SANITY_DATASET || 'production';
const token = process.env.SANITY_API_WRITE_TOKEN;

if (!projectId || !token) {
  console.error('Missing SANITY_PROJECT_ID or SANITY_API_WRITE_TOKEN in .env.local');
  process.exit(1);
}

const url = `https://${projectId}.api.sanity.io/v2023-05-03/data/mutate/${dataset}`;

const mutations = [
  { delete: { id: 'comment-c1' } },
  { delete: { id: 'comment-c2' } },
  { delete: { id: 'comment-c3' } }
];

async function run() {
  console.log('Sending delete mutation to Sanity...');
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ mutations })
    });
    
    const data = await res.json();
    if (res.ok) {
      console.log('Mutation completed successfully:', JSON.stringify(data, null, 2));
    } else {
      console.error('Error from Sanity:', JSON.stringify(data, null, 2));
    }
  } catch (err) {
    console.error('Fetch error:', err);
  }
}

run();
