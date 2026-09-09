import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

let url = 'https://prjdbvjkbrakpmadzitt.supabase.co';
let key = 'sb_publishable_-vEEVZhC87TqwICFOfyqXw_1nusS1WL';

try {
  const envContent = fs.readFileSync('.env', 'utf-8');
  for (const line of envContent.split('\n')) {
    const trimmed = line.trim();
    if (trimmed.startsWith('VITE_SUPABASE_URL=') || trimmed.startsWith('NEXT_PUBLIC_SUPABASE_URL=')) {
      url = trimmed.split('=')[1].trim();
    }
    if (trimmed.startsWith('VITE_SUPABASE_ANON_KEY=') || trimmed.startsWith('NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=')) {
      key = trimmed.split('=')[1].trim();
    }
  }
} catch (e) {}

console.log('Testing Supabase with URL:', url);
console.log('Key prefix:', key?.substring(0, 15));

const supabase = createClient(url, key);

async function test() {
  const tables = [
    'website_published',
    'website_content',
    'site_settings',
    'section_settings',
    'projects',
    'skill_categories',
    'services',
    'media_assets',
    'activity_log'
  ];

  for (const table of tables) {
    try {
      const { data, error } = await supabase.from(table).select('*').limit(1);
      if (error) {
        console.log(`❌ Table '${table}': ${error.message} (${error.code})`);
      } else {
        console.log(`✅ Table '${table}': Accessible! (Rows: ${data?.length})`);
      }
    } catch (e) {
      console.log(`❌ Table '${table}': Exception ${e.message}`);
    }
  }
}

test();
