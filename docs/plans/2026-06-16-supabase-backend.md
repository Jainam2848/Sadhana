# Supabase Backend Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build, test, and deploy the Supabase backend for Sadhana, including schemas, auth setup, triggers for streak tracking, storage rules, and API endpoints.

**Architecture:** A serverless backend built on Supabase (PostgreSQL + RLS + GoTrue Auth). Database-level triggers handle user streaks, while Custom SQL functions (RPC) manage ad counts, coin updates, and GDPR cascades.

**Tech Stack:** Supabase CLI, PostgreSQL, Node.js/TypeScript, Jest testing framework.

---

### Task 1: Initialize Backend Project

**Files:**
- Create: `supabase/config.toml` (initialized by CLI)
- Create: `supabase/.gitignore` (initialized by CLI)
- Create: `tests/package.json` (for local test running environment)
- Create: `tests/tsconfig.json`

**Step 1: Write the failing test**
Create a test script `tests/init.test.ts` to assert that the local Supabase configuration file exists.
```typescript
import fs from 'fs';
import path from 'path';

test('Supabase project configuration exists', () => {
  const configExists = fs.existsSync(path.join(__dirname, '../supabase/config.toml'));
  expect(configExists).toBe(true);
});
```

**Step 2: Run test to verify it fails**
Run: `npm run test tests/init.test.ts`
Expected: FAIL (file does not exist)

**Step 3: Write minimal implementation**
Run: `supabase init` in the project root. This creates the `supabase` directory and `config.toml` file.

**Step 4: Run test to verify it passes**
Run: `npm run test tests/init.test.ts`
Expected: PASS

**Step 5: Commit**
```bash
git add supabase/config.toml supabase/.gitignore tests/
git commit -m "chore: initialize supabase local project"
```

---

### Task 2: Set up Database Schema and Migrations

**Files:**
- Create: `supabase/migrations/20260616000000_init_schema.sql`
- Test: `tests/schema.test.ts`

**Step 1: Write the failing test**
Write `tests/schema.test.ts` that tries to connect to the local Supabase database and verify that tables `profiles`, `sadhana_routines`, etc., exist.
```typescript
import { createClient } from '@supabase/supabase-js';

const supabase = createClient('http://localhost:54321', 'mock-anon-key');

test('Verify schema tables exist', async () => {
  const { data: profiles, error } = await supabase.from('profiles').select('*').limit(1);
  expect(error).toBeNull();
});
```

**Step 2: Run test to verify it fails**
Ensure local Supabase containers are started: `supabase start`
Run: `npm run test tests/schema.test.ts`
Expected: FAIL (relation "profiles" does not exist)

**Step 3: Write minimal implementation**
Create a migration file `supabase/migrations/20260616000000_init_schema.sql` containing all table schemas, constraints, indices, and RLS policies defined in `docs/architecture/DATABASE_SCHEMA.md`.
Run: `supabase db reset` to apply the migrations locally.

**Step 4: Run test to verify it passes**
Run: `npm run test tests/schema.test.ts`
Expected: PASS

**Step 5: Commit**
```bash
git add supabase/migrations/
git commit -m "feat: implement relational database schema migration"
```

---

### Task 3: Implement Auth

**Files:**
- Modify: `supabase/migrations/20260616000000_init_schema.sql` (append user creation triggers)
- Test: `tests/auth.test.ts`

**Step 1: Write the failing test**
Write a test in `tests/auth.test.ts` that signs up a new user using the Supabase client and checks if a corresponding row in the public `profiles` table and `user_streaks` is created automatically.
```typescript
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'http://localhost:54321';
const supabaseAdminKey = 'service-role-key-from-supabase'; // Read from local env
const supabaseAdmin = createClient(supabaseUrl, supabaseAdminKey);

test('User registration automatically triggers profile and streak creation', async () => {
  const email = `test-${Date.now()}@example.com`;
  const { data, error } = await supabaseAdmin.auth.admin.createUser({
    email,
    password: 'Password123',
    user_metadata: { username: 'Test User' },
    email_confirm: true
  });
  
  expect(error).toBeNull();
  
  // Verify profile exists
  const { data: profile } = await supabaseAdmin
    .from('profiles')
    .select('*')
    .eq('id', data.user!.id)
    .single();
    
  expect(profile).toBeDefined();
  expect(profile.username).toBe('Test User');
});
```

**Step 2: Run test to verify it fails**
Run: `npm run test tests/auth.test.ts`
Expected: FAIL (profile record not created since trigger is missing)

**Step 3: Write minimal implementation**
Add the `handle_new_user` PL/pgSQL function and the `on_auth_user_created` trigger on the database.
Run: `supabase db reset`

**Step 4: Run test to verify it passes**
Run: `npm run test tests/auth.test.ts`
Expected: PASS

**Step 5: Commit**
```bash
git commit -am "feat: implement auth new-user triggers"
```

---

### Task 4: Build CRUD Endpoints for `sadhana_routines` (Primary Entity)

**Files:**
- Modify: `supabase/migrations/20260616000000_init_schema.sql` (insert default catalog data and configure RLS)
- Test: `tests/routines.test.ts`

**Step 1: Write the failing test**
Write `tests/routines.test.ts` that attempts to read routines as a guest user, and attempts to write to the table as a guest. Guest read should succeed (returns data), but guest write should fail due to RLS rules.
```typescript
import { createClient } from '@supabase/supabase-js';

const supabaseAnon = createClient('http://localhost:54321', 'local-anon-key');

test('Routines are readable by guests but writable only by admins', async () => {
  const { data, error } = await supabaseAnon.from('sadhana_routines').select('*');
  expect(error).toBeNull();
  
  const { error: writeError } = await supabaseAnon.from('sadhana_routines').insert({
    title: 'Hacked Routine',
    description: 'Should fail',
    duration_minutes: 10,
    category: 'asana',
    media_url: 'bad'
  });
  expect(writeError).not.toBeNull();
});
```

**Step 2: Run test to verify it fails**
Run: `npm run test tests/routines.test.ts`
Expected: FAIL (either guest read returns empty/error, or write succeeds because RLS isn't enabled)

**Step 3: Write minimal implementation**
Enable RLS on `sadhana_routines` and define the public select policy in SQL. Seed the table with some default routines.
Run: `supabase db reset`

**Step 4: Run test to verify it passes**
Run: `npm run test tests/routines.test.ts`
Expected: PASS

**Step 5: Commit**
```bash
git commit -am "feat: configure RLS and seed sadhana_routines"
```

---

### Task 5: Build CRUD Endpoints for `session_logs` and Streaks (Secondary Entity)

**Files:**
- Modify: `supabase/migrations/20260616000000_init_schema.sql` (append streak triggers)
- Test: `tests/streaks.test.ts`

**Step 1: Write the failing test**
Write a test in `tests/streaks.test.ts` that inserts a `session_log` for a user and asserts that their `user_streaks.current_streak` is updated to `1`.
```typescript
import { createClient } from '@supabase/supabase-js';

test('Logging a session automatically updates user streak', async () => {
  // Setup user and client
  const client = createClient('http://localhost:54321', 'user-token');
  const { data: log, error } = await client.from('session_logs').insert({
    duration_practiced: 15
  });
  
  const { data: streak } = await client.from('user_streaks').select('*').single();
  expect(streak.current_streak).toBe(1);
});
```

**Step 2: Run test to verify it fails**
Run: `npm run test tests/streaks.test.ts`
Expected: FAIL (streak remains 0)

**Step 3: Write minimal implementation**
Implement the PL/pgSQL `update_user_streak` function and trigger on `session_logs` inserts.
Run: `supabase db reset`

**Step 4: Run test to verify it passes**
Run: `npm run test tests/streaks.test.ts`
Expected: PASS

**Step 5: Commit**
```bash
git commit -am "feat: implement session streak tracking trigger"
```

---

### Task 6: Implement File Upload

**Files:**
- Create: `supabase/storage.sql` (or append bucket definitions to migration)
- Test: `tests/storage.test.ts`

**Step 1: Write the failing test**
Write `tests/storage.test.ts` that tries to read a file from the `media` storage bucket as a guest user, and asserts that guests cannot upload files.
```typescript
import { createClient } from '@supabase/supabase-js';

const anonClient = createClient('http://localhost:54321', 'local-anon');

test('Media bucket permits public download but prevents public upload', async () => {
  const { data, error } = await anonClient.storage.from('media').download('test.mp3');
  // Upload should fail
  const fileBody = Buffer.from('mock audio');
  const { error: uploadError } = await anonClient.storage.from('media').upload('test.mp3', fileBody);
  expect(uploadError).not.toBeNull();
});
```

**Step 2: Run test to verify it fails**
Run: `npm run test tests/storage.test.ts`
Expected: FAIL (bucket does not exist or upload policies are missing)

**Step 3: Write minimal implementation**
Configure the `media` storage bucket and write security policies inside the migrations:
```sql
insert into storage.buckets (id, name, public) values ('media', 'media', true);

create policy "Public Access" on storage.objects for select using (bucket_id = 'media');
create policy "Admin Upload" on storage.objects for insert with check (bucket_id = 'media' and auth.role() = 'service_role');
```

**Step 4: Run test to verify it passes**
Run: `npm run test tests/storage.test.ts`
Expected: PASS

**Step 5: Commit**
```bash
git commit -am "feat: set up storage bucket and policies"
```

---

### Task 7: Write Integration Tests for All Endpoints

**Files:**
- Create: `tests/integration.test.ts`

**Step 1: Write the integration test suite**
Create a comprehensive test suite `tests/integration.test.ts` that simulates a full user lifecycle flow:
1. Signup user and verify profile created.
2. Complete onboarding questionnaire.
3. Fetch daily plans.
4. Complete session (inserts log, updates streak).
5. Watch ad -> calls RPC `increment_ad_views` -> unlocks milestones.
6. Wallet operations -> calls RPC `redeem_karma_coins`.
7. GDPR Deletion -> calls RPC `delete_user_account` -> verifies cascade deletion.

**Step 2: Run tests and watch it fail**
Ensure some endpoints/RPCs are not fully implemented.
Run: `npm run test tests/integration.test.ts`
Expected: FAIL (e.g., RPC functions missing)

**Step 3: Write minimal implementation**
Implement the custom SQL RPC functions:
- `increment_ad_views`
- `redeem_karma_coins`
- `delete_user_account`
Run: `supabase db reset`

**Step 4: Run tests to verify it passes**
Run: `npm run test tests/integration.test.ts`
Expected: PASS

**Step 5: Commit**
```bash
git commit -am "feat: implement custom RPCs and verify full integration tests"
```

---

### Task 8: Deploy to Staging

**Files:**
- Create: `.env.staging` (contains staging environment variables)

**Step 1: Write the verification check**
Confirm staging project link configuration:
```bash
supabase link --project-ref $STAGING_PROJECT_REF
```

**Step 2: Verify dry-run fails if config is incorrect**
Expected: Dry-run fails if credentials or environment is not defined.

**Step 3: Deploy database and configurations**
Deploy migrations to staging:
```bash
supabase db push
```

**Step 4: Verify migration status on remote staging**
Run: `supabase db remote commit` or check Supabase dashboard.

**Step 5: Commit**
Save staging instructions and configurations:
```bash
git add .env.staging
git commit -m "deploy: setup staging configurations"
```
