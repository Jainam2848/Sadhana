const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const SEED_DATA_PATH = path.join(__dirname, 'seed_data.json');

// 1. Generate deterministic and valid UUIDs based on the pose name
function uuidFromHash(name) {
  const hash = crypto.createHash('sha256').update(name || '').digest('hex');
  // Return format: xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx (standard UUID version 4 variant 1 shape)
  return `${hash.slice(0, 8)}-${hash.slice(8, 12)}-4${hash.slice(13, 16)}-a${hash.slice(17, 20)}-${hash.slice(20, 32)}`;
}

// 2. Map expertise level strings to valid experience level values
function mapExpertiseLevel(level) {
  const val = (level || '').toLowerCase().trim();
  if (val === 'beginner') return 'beginner';
  if (val === 'intermediate') return 'intermediate';
  if (val === 'advanced') return 'advanced';
  return 'beginner'; // Default
}

// 3. Map pose types and names to specific target tightness areas
function mapTightnessTags(pose_type, name) {
  const tags = [];
  const typeStr = (pose_type || []).join(' ').toLowerCase();
  const nameStr = (name || '').toLowerCase();
  
  if (typeStr.includes('forward bend')) {
    tags.push('hamstrings', 'lower_back');
  }
  if (typeStr.includes('back bend')) {
    tags.push('lower_back', 'shoulders', 'spine');
  }
  if (typeStr.includes('twist')) {
    tags.push('spine', 'lower_back');
  }
  if (typeStr.includes('standing') || typeStr.includes('seated')) {
    tags.push('hips');
  }
  if (typeStr.includes('lateral bend')) {
    tags.push('spine');
  }
  if (nameStr.includes('shoulder')) {
    tags.push('shoulders');
  }
  if (nameStr.includes('neck')) {
    tags.push('neck');
  }
  if (nameStr.includes('chest') || nameStr.includes('heart')) {
    tags.push('chest');
  }
  if (nameStr.includes('quad') || nameStr.includes('thigh')) {
    tags.push('quads');
  }
  
  return Array.from(new Set(tags));
}

// 4. Map pose types and names to target wellness goals
function mapGoalTags(pose_type, name) {
  const goals = ['mobility']; // All physical asanas facilitate mobility
  const typeStr = (pose_type || []).join(' ').toLowerCase();
  const nameStr = (name || '').toLowerCase();
  
  if (typeStr.includes('balancing')) {
    goals.push('focus', 'strength');
  }
  if (typeStr.includes('back bend') || typeStr.includes('standing') || 
      nameStr.includes('warrior') || nameStr.includes('plank') || 
      nameStr.includes('crane') || nameStr.includes('crow')) {
    goals.push('strength');
  }
  if (typeStr.includes('forward bend') || typeStr.includes('supine') || typeStr.includes('prone') || 
      nameStr.includes('corpse') || nameStr.includes('child')) {
    goals.push('stress', 'sleep');
  }
  if (typeStr.includes('inversion')) {
    goals.push('energy', 'focus');
  }
  
  return Array.from(new Set(goals));
}

// 5. Transform raw Hugging Face pose row to sadhana_routines schema
function transformPose(pose) {
  const experience_level = mapExpertiseLevel(pose.expertise_level);
  const is_premium = (experience_level === 'intermediate' || experience_level === 'advanced');
  
  const sanskrit_terms = {};
  if (pose.sanskrit_name && pose.sanskrit_name.trim() && pose.name && pose.name.trim()) {
    sanskrit_terms[pose.sanskrit_name.trim()] = pose.name.trim();
  }
  
  // Set logical practicing duration based on pose difficulty
  let duration_minutes = 5;
  if (experience_level === 'intermediate') duration_minutes = 8;
  else if (experience_level === 'advanced') duration_minutes = 12;

  const title = (pose.name || '').trim();
  const sanskritPart = pose.sanskrit_name ? ` (${pose.sanskrit_name.trim()})` : '';
  const description = `A classical ${experience_level} yoga pose: ${title}${sanskritPart}. Focuses on alignment, stability, and mindfulness. Category: ${(pose.pose_type || []).join(', ')}.`;

  return {
    id: uuidFromHash(title),
    title,
    description,
    duration_minutes,
    category: 'asana',
    is_premium,
    thumbnail_url: pose.photo_url || 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=600',
    media_url: 'https://vjs.zencdn.net/v/oceans.mp4', // Default placeholder loop for physical asanas
    experience_level,
    tightness: mapTightnessTags(pose.pose_type, title),
    goals: mapGoalTags(pose.pose_type, title),
    sanskrit_terms
  };
}

// 6. Merge routines by keeping unique routines by ID (upsert behavior)
function mergeRoutines(existing, incoming) {
  const map = new Map();
  existing.forEach(r => map.set(r.id, r));
  incoming.forEach(r => map.set(r.id, r));
  return Array.from(map.values());
}

// 7. Full execution flow
async function runImport() {
  console.log('🚀 Starting Hugging Face yoga poses import...');
  try {
    const allRows = [];
    const limit = 100;
    
    // Fetch offset 0-100
    console.log('Fetching batch 1 (rows 0-100)...');
    const res1 = await fetch(`https://datasets-server.huggingface.co/rows?dataset=omergoshen/yoga_poses&config=default&split=train&offset=0&length=${limit}`);
    if (!res1.ok) {
      throw new Error(`Failed to fetch first batch: ${res1.status} ${res1.statusText}`);
    }
    const data1 = await res1.json();
    allRows.push(...data1.rows.map(r => r.row));
    
    // Fetch offset 100-200
    console.log('Fetching batch 2 (rows 100-200)...');
    const res2 = await fetch(`https://datasets-server.huggingface.co/rows?dataset=omergoshen/yoga_poses&config=default&split=train&offset=100&length=${limit}`);
    if (!res2.ok) {
      throw new Error(`Failed to fetch second batch: ${res2.status} ${res2.statusText}`);
    }
    const data2 = await res2.json();
    allRows.push(...data2.rows.map(r => r.row));
    
    console.log(`Fetched ${allRows.length} raw rows from Hugging Face dataset.`);
    
    // Filter out rows with invalid/empty titles or placeholder details
    const validRows = allRows.filter(row => {
      const name = (row.name || '').trim();
      return name && name.toLowerCase() !== 'pose' && name.length > 2;
    });
    
    console.log(`Filtered down to ${validRows.length} valid yoga poses.`);
    
    // Transform all poses
    const transformed = validRows.map(transformPose);
    
    // Read existing seed data
    if (!fs.existsSync(SEED_DATA_PATH)) {
      throw new Error(`Seed data file not found at ${SEED_DATA_PATH}`);
    }
    const seedData = JSON.parse(fs.readFileSync(SEED_DATA_PATH, 'utf-8'));
    
    // Merge routines
    console.log(`Merging ${transformed.length} incoming poses with ${seedData.routines.length} existing routines...`);
    const mergedRoutines = mergeRoutines(seedData.routines, transformed);
    
    // Update seed data object
    seedData.routines = mergedRoutines;
    
    // Write back to seed_data.json
    fs.writeFileSync(SEED_DATA_PATH, JSON.stringify(seedData, null, 2), 'utf-8');
    console.log(`\n🎉 Success! seed_data.json updated successfully. Total routines now: ${seedData.routines.length}`);
    
  } catch (error) {
    console.error('\n❌ Import failed:', error.message);
    process.exit(1);
  }
}

module.exports = {
  uuidFromHash,
  mapExpertiseLevel,
  mapTightnessTags,
  mapGoalTags,
  transformPose,
  mergeRoutines
};

if (require.main === module) {
  runImport();
}
