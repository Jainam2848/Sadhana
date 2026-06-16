import fs from 'fs';
import path from 'path';

test('Supabase project configuration exists', () => {
  const configExists = fs.existsSync(path.join(__dirname, '../supabase/config.toml'));
  expect(configExists).toBe(true);
});
