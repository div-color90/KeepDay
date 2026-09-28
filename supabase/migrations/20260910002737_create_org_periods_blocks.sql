/*
# Create organization periods and blocks tables

1. New Tables
- `org_periods`
  - `id` (uuid, primary key)
  - `name` (text, not null) — e.g. "Periodo de alta carga"
  - `start_date` (date, not null)
  - `end_date` (date, not null)
  - `is_active` (boolean, default true)
  - `created_at` (timestamptz, default now())

- `org_blocks`
  - `id` (uuid, primary key)
  - `name` (text, not null)
  - `block_date` (date, not null) — the specific date this block occurs on
  - `start_time` (time, not null)
  - `end_time` (time, not null)
  - `block_type` (text, not null) — one of: study, work, task, tutoring, review, break, meal, commute, personal, sleep
  - `subject_id` (uuid, nullable, references subjects ON DELETE SET NULL)
  - `task_id` (uuid, nullable, references tasks ON DELETE SET NULL)
  - `recurrence` (text, nullable) — 'none', 'weekly', 'daily'
  - `notes` (text, nullable)
  - `pomodoros_estimated` (integer, default 0)
  - `pomodoros_completed` (integer, default 0)
  - `created_at` (timestamptz, default now())

2. Security
- Enable RLS on both tables.
- Single-tenant app (no sign-in): all policies use `TO anon, authenticated` with `USING (true)` / `WITH CHECK (true)`.
- 4 policies per table (select/insert/update/delete).

3. Important Notes
- `org_blocks.subject_id` links blocks to subjects (ON DELETE SET NULL).
- `org_blocks.task_id` links blocks to tasks (ON DELETE SET NULL).
- Recurring blocks store a recurrence type; the frontend expands them visually across the period.
- `pomodoros_estimated` is calculated from block duration and current Pomodoro config.
*/

CREATE TABLE IF NOT EXISTS org_periods (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  start_date date NOT NULL,
  end_date date NOT NULL,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE org_periods ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_org_periods" ON org_periods;
CREATE POLICY "anon_select_org_periods" ON org_periods FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_org_periods" ON org_periods;
CREATE POLICY "anon_insert_org_periods" ON org_periods FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_org_periods" ON org_periods;
CREATE POLICY "anon_update_org_periods" ON org_periods FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_org_periods" ON org_periods;
CREATE POLICY "anon_delete_org_periods" ON org_periods FOR DELETE
  TO anon, authenticated USING (true);

CREATE TABLE IF NOT EXISTS org_blocks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  block_date date NOT NULL,
  start_time time NOT NULL,
  end_time time NOT NULL,
  block_type text NOT NULL DEFAULT 'study',
  subject_id uuid REFERENCES subjects(id) ON DELETE SET NULL,
  task_id uuid REFERENCES tasks(id) ON DELETE SET NULL,
  recurrence text DEFAULT 'none',
  notes text,
  pomodoros_estimated integer NOT NULL DEFAULT 0,
  pomodoros_completed integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE org_blocks ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_org_blocks" ON org_blocks;
CREATE POLICY "anon_select_org_blocks" ON org_blocks FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_org_blocks" ON org_blocks;
CREATE POLICY "anon_insert_org_blocks" ON org_blocks FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_org_blocks" ON org_blocks;
CREATE POLICY "anon_update_org_blocks" ON org_blocks FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_org_blocks" ON org_blocks;
CREATE POLICY "anon_delete_org_blocks" ON org_blocks FOR DELETE
  TO anon, authenticated USING (true);
