const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const readline = require('readline');

const SEED_DATA_PATH = path.join(__dirname, 'seed_data.json');

const VALID_CATEGORIES = ['asana', 'pranayama', 'dhyana', 'philosophy'];
const VALID_LEVELS = ['beginner', 'intermediate', 'advanced'];
const VALID_TIGHTNESS = ['hips', 'hamstrings', 'lower_back', 'shoulders', 'chest', 'neck', 'quads', 'spine'];
const VALID_GOALS = ['stress', 'mobility', 'philosophy', 'strength', 'focus', 'energy', 'sleep'];

function validateUUID(uuid) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(uuid);
}

function loadSeedData() {
  if (!fs.existsSync(SEED_DATA_PATH)) {
    console.error(`❌ File not found: ${SEED_DATA_PATH}`);
    process.exit(1);
  }
  try {
    const rawContent = fs.readFileSync(SEED_DATA_PATH, 'utf-8');
    return JSON.parse(rawContent);
  } catch (error) {
    console.error(`❌ Failed to parse JSON: ${error.message}`);
    process.exit(1);
  }
}

function saveSeedData(data) {
  try {
    fs.writeFileSync(SEED_DATA_PATH, JSON.stringify(data, null, 2), 'utf-8');
    console.log(`\n✅ Successfully updated ${SEED_DATA_PATH}`);
  } catch (error) {
    console.error(`❌ Failed to save JSON: ${error.message}`);
    process.exit(1);
  }
}

function validateCatalog(data) {
  console.log('\n🔍 Validating routines and exercises catalog...');
  let errors = 0;
  let warnings = 0;
  const ids = new Set();

  if (!data.routines || !Array.isArray(data.routines)) {
    console.error('❌ JSON missing "routines" array.');
    return false;
  }

  data.routines.forEach((routine, idx) => {
    const prefix = `[Routine #${idx + 1} - "${routine.title || 'Untitled'}"]`;

    // 1. Check ID
    if (!routine.id) {
      console.error(`${prefix} Error: Missing ID.`);
      errors++;
    } else if (!validateUUID(routine.id)) {
      console.error(`${prefix} Error: Invalid UUID format: "${routine.id}"`);
      errors++;
    } else if (ids.has(routine.id)) {
      console.error(`${prefix} Error: Duplicate ID: "${routine.id}"`);
      errors++;
    } else {
      ids.add(routine.id);
    }

    // 2. Check Title
    if (!routine.title || typeof routine.title !== 'string') {
      console.error(`${prefix} Error: Title is required and must be a string.`);
      errors++;
    } else if (routine.title.length > 150) {
      console.error(`${prefix} Error: Title exceeds 150 characters.`);
      errors++;
    }

    // 3. Check Description
    if (!routine.description || typeof routine.description !== 'string') {
      console.error(`${prefix} Error: Description is required.`);
      errors++;
    }

    // 4. Check Category
    if (!routine.category || !VALID_CATEGORIES.includes(routine.category)) {
      console.error(`${prefix} Error: Invalid category "${routine.category}". Must be one of: ${VALID_CATEGORIES.join(', ')}`);
      errors++;
    }

    // 5. Check Duration
    if (typeof routine.duration_minutes !== 'number' || routine.duration_minutes <= 0) {
      console.error(`${prefix} Error: duration_minutes must be a positive number.`);
      errors++;
    }

    // 6. Check Level
    if (!routine.experience_level || !VALID_LEVELS.includes(routine.experience_level)) {
      console.error(`${prefix} Error: Invalid experience_level "${routine.experience_level}". Must be one of: ${VALID_LEVELS.join(', ')}`);
      errors++;
    }

    // 7. Check Tightness (array)
    if (!Array.isArray(routine.tightness)) {
      console.error(`${prefix} Error: "tightness" must be an array.`);
      errors++;
    } else {
      routine.tightness.forEach(t => {
        if (!VALID_TIGHTNESS.includes(t)) {
          console.warn(`${prefix} Warning: Non-standard tightness tag "${t}". Standard options: ${VALID_TIGHTNESS.join(', ')}`);
          warnings++;
        }
      });
    }

    // 8. Check Goals (array)
    if (!Array.isArray(routine.goals)) {
      console.error(`${prefix} Error: "goals" must be an array.`);
      errors++;
    } else {
      routine.goals.forEach(g => {
        if (!VALID_GOALS.includes(g)) {
          console.warn(`${prefix} Warning: Non-standard goal tag "${g}". Standard options: ${VALID_GOALS.join(', ')}`);
          warnings++;
        }
      });
    }

    // 9. Check URLs
    if (!routine.thumbnail_url || !routine.thumbnail_url.startsWith('http')) {
      console.warn(`${prefix} Warning: Missing or invalid thumbnail_url.`);
      warnings++;
    }
    if (!routine.media_url || !routine.media_url.startsWith('http')) {
      console.warn(`${prefix} Warning: Missing or invalid media_url.`);
      warnings++;
    }
  });

  console.log(`\nValidation Summary: ${errors} Errors, ${warnings} Warnings.`);
  return errors === 0;
}

async function runInteractiveAdd() {
  const data = loadSeedData();
  
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  const ask = (query) => new Promise((resolve) => rl.question(query, resolve));

  console.log('\n======================================');
  console.log('🧘  Sadhana Routine Creator CLI  🧘');
  console.log('======================================\n');

  try {
    // 1. Title
    let title = '';
    while (!title.trim()) {
      title = await ask('Enter Title (e.g. Heart Opener Flow): ');
    }

    // 2. Description
    let description = '';
    while (!description.trim()) {
      description = await ask('Enter Description: ');
    }

    // 3. Duration
    let duration = 0;
    while (isNaN(duration) || duration <= 0) {
      const input = await ask('Enter Duration in minutes (e.g. 15): ');
      duration = parseInt(input, 10);
    }

    // 4. Category
    let category = '';
    while (!VALID_CATEGORIES.includes(category)) {
      console.log(`\nAvailable Categories: ${VALID_CATEGORIES.join(', ')}`);
      category = (await ask('Select Category: ')).toLowerCase().trim();
    }

    // 5. Is Premium
    const premiumInput = await ask('Is this a Premium routine? (y/N): ');
    const is_premium = premiumInput.toLowerCase().trim() === 'y';

    // 6. Experience Level
    let experience_level = '';
    while (!VALID_LEVELS.includes(experience_level)) {
      console.log(`\nAvailable Experience Levels: ${VALID_LEVELS.join(', ')}`);
      experience_level = (await ask('Select Experience Level: ')).toLowerCase().trim();
    }

    // 7. Tightness Tags
    console.log(`\nStandard tightness focus areas: ${VALID_TIGHTNESS.join(', ')}`);
    const tightnessInput = await ask('Enter tightness focus tags (comma-separated, or leave empty): ');
    const tightness = tightnessInput
      .split(',')
      .map(t => t.trim().toLowerCase())
      .filter(t => t.length > 0);

    // 8. Goal Tags
    console.log(`\nStandard wellness goal tags: ${VALID_GOALS.join(', ')}`);
    const goalsInput = await ask('Enter goal tags (comma-separated, or leave empty): ');
    const goals = goalsInput
      .split(',')
      .map(g => g.trim().toLowerCase())
      .filter(g => g.length > 0);

    // 9. Sanskrit Terms
    const sanskrit_terms = {};
    console.log('\nSanskrit Vocabulary definitions (Optional)');
    let addingSanskrit = true;
    while (addingSanskrit) {
      const term = await ask('Sanskrit Term (e.g. Tadasana, leave empty to stop): ');
      if (!term.trim()) {
        addingSanskrit = false;
      } else {
        const translation = await ask(`Translation/English meaning for "${term}": `);
        sanskrit_terms[term.trim()] = translation.trim();
      }
    }

    // 10. Thumbnail & Media URLs
    let thumbnail_url = await ask('\nEnter Thumbnail Image URL (Optional, press Enter for default): ');
    if (!thumbnail_url.trim()) {
      thumbnail_url = 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=600';
    }

    let media_url = await ask('Enter Loop Video/Audio Media URL (Optional, press Enter for default): ');
    if (!media_url.trim()) {
      media_url = category === 'dhyana' 
        ? 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3'
        : 'https://vjs.zencdn.net/v/oceans.mp4';
    }

    // Generate new entry
    const newRoutine = {
      id: crypto.randomUUID(),
      title: title.trim(),
      description: description.trim(),
      duration_minutes: duration,
      category,
      is_premium,
      thumbnail_url: thumbnail_url.trim(),
      media_url: media_url.trim(),
      experience_level,
      tightness,
      goals,
      sanskrit_terms
    };

    console.log('\n--------------------------------------');
    console.log('Previewing New Routine Entry:');
    console.log(JSON.stringify(newRoutine, null, 2));
    console.log('--------------------------------------');

    const confirm = await ask('Save this routine to seed_data.json? (Y/n): ');
    if (confirm.toLowerCase().trim() !== 'n') {
      data.routines.push(newRoutine);
      saveSeedData(data);
      console.log('\n🎉 Routine added successfully!');
      console.log('To push this routine to the staging database, run:');
      console.log('   npm run db:seed');
    } else {
      console.log('❌ Canceled. Routine was not saved.');
    }

  } catch (err) {
    console.error('An error occurred during interactive addition:', err);
  } finally {
    rl.close();
  }
}

// Command dispatcher
const args = process.argv.slice(2);
const command = args[0] || 'validate';

if (command === 'validate') {
  const data = loadSeedData();
  const valid = validateCatalog(data);
  process.exit(valid ? 0 : 1);
} else if (command === 'add') {
  runInteractiveAdd();
} else {
  console.log('Unknown command. Use "validate" or "add".');
  process.exit(1);
}
