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

const queryUrl = `https://${projectId}.api.sanity.io/v2023-05-03/data/query/${dataset}?query=${encodeURIComponent('*[_type == "post" && approvalStatus != "approved"]')}`;
const mutateUrl = `https://${projectId}.api.sanity.io/v2023-05-03/data/mutate/${dataset}`;

async function run() {
  console.log('Fetching posts that are not approved...');
  try {
    const res = await fetch(queryUrl, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    const queryData = await res.json();
    if (!res.ok) {
      console.error('Query failed:', queryData);
      return;
    }

    const posts = queryData.result || [];
    console.log(`Found ${posts.length} posts to approve.`);
    if (posts.length === 0) return;

    const mutations = posts.map(post => ({
      patch: {
        id: post._id,
        set: { approvalStatus: 'approved' }
      }
    }));

    console.log('Sending approve mutation to Sanity...');
    const mutateRes = await fetch(mutateUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ mutations })
    });
    
    const mutateData = await mutateRes.json();
    if (mutateRes.ok) {
      console.log('Mutation completed successfully, approved all posts!');
    } else {
      console.error('Error from Sanity mutate:', mutateData);
    }
  } catch (err) {
    console.error('Fetch error:', err);
  }
}

run();
