# Hugging Face Yoga Poses Dataset Integration Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Import the Hugging Face `omergoshen/yoga_poses` dataset into the Sadhana routines catalog to provide 160 new physical yoga postures (asanas) for the personalization engine.

**Architecture:** Create a Node.js utility script (`supabase/import_hf_dataset.js`) that fetches the poses from the Hugging Face Dataset Viewer API. Map the dataset's schema into the `sadhana_routines` schema (with logical mapping for experience levels, tightness, goals, and deterministic UUID generation). Merge these new routines into the existing `supabase/seed_data.json`, validate the resulting catalog, and seed it to the remote staging database.

**Tech Stack:** Node.js, Supabase JS, Jest (for testing mapping logic).

---

## User Review Required

We propose the following automatic mapping rules to translate the Hugging Face poses into Sadhana routines:

1. **Experience Levels:**
   - `"Beginner"` / empty `""` -> `'beginner'` (Free)
   - `"Intermediate"` -> `'intermediate'` (Premium)
   - `"Advanced"` -> `'advanced'` (Premium)
2. **Premium Lock:**
   - Free: Beginner poses
   - Premium: Intermediate and Advanced poses
3. **Tightness Areas:**
   - `"Forward Bend"` in pose type -> `['hamstrings', 'lower_back']`
   - `"Back Bend"` in pose type -> `['lower_back', 'shoulders', 'spine']`
   - `"Twist"` in pose type -> `['spine', 'lower_back']`
   - `"Standing"` or `"Seated"` in pose type -> `['hips']`
   - `"Lateral Bend"` in pose type -> `['spine']`
   - `"Shoulder"` in name -> `['shoulders']`
   - `"Neck"` in name -> `['neck']`
   - `"Chest"` or `"Heart"` in name -> `['chest']`
   - `"Quad"` or `"Thigh"` in name -> `['quads']`
4. **Goals Mapping:**
   - All physical poses (asanas) get `'mobility'`.
   - `"Balancing"` in pose type -> `['focus', 'strength']`.
   - `"Back Bend"`, `"Standing"`, or power-pose names (e.g. Plank, Warrior, Crane) -> `['strength']`.
   - `"Forward Bend"`, `"Supine"`, `"Prone"`, or restful names (e.g. Corpse, Child) -> `['stress', 'sleep']`.
   - `"Inversion"` -> `['energy', 'focus']`.
5. **Media URLs:**
   - All asanas use the standard placeholder video loop `https://vjs.zencdn.net/v/oceans.mp4` as `media_url`.
   - `thumbnail_url` is mapped directly from the dataset's `photo_url`.

## Open Questions

> [!NOTE]
> None. The above automated mapping rules cover all database requirements and will be implemented directly.

---

## Proposed Changes

### Seeding & Import Scripts

#### [NEW] [import_hf_dataset.js](file:///d:/Desktop/Fitness/supabase/import_hf_dataset.js)
Create a Node.js script to:
1. Query `https://datasets-server.huggingface.co/rows?dataset=omergoshen/yoga_poses` using the native `fetch` API in two paginated calls (offset 0 and offset 100).
2. Generate deterministic UUIDs from the pose name using SHA-256 to allow safe, idempotent seeding.
3. Map the fields as specified in the rules above.
4. Read `supabase/seed_data.json`, merge the new routines with the existing ones (preventing duplicates), and write the updated JSON back.

### Testing

#### [NEW] [import_hf.test.ts](file:///d:/Desktop/Fitness/tests/import_hf.test.ts)
Create a Jest test file to verify:
1. The UUID generation helper produces deterministic, valid UUIDs.
2. The schema mapper correctly handles various inputs (e.g., empty expertise level maps to `'beginner'`, `'Forward Bend'` maps to `'hamstrings'` and `'lower_back'`).
3. The merging logic correctly handles updating existing entries without duplication.

---

## Verification Plan

### Automated Tests
Run the new import test suite:
```bash
node d:\Desktop\Fitness\tests\node_modules\jest\bin\jest.js --config d:\Desktop\Fitness\tests\jest.config.js tests/import_hf.test.ts
```

Run the catalog validation script:
```bash
npm run catalog:validate
```

Run the remote DB seeding:
```bash
npm run db:seed
```

Run the entire test suite against the updated database:
```bash
npm run test
```

### Manual Verification
1. Open the JSON file `supabase/seed_data.json` and verify that it contains the new 160 imported poses.
2. Verify that the routines table in the remote database has been successfully updated with the new rows.
