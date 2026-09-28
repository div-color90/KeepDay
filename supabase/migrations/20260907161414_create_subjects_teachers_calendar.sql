/*
# Create subjects, teachers, and calendar_events tables

1. New Tables
- `subjects`
  - `id` (uuid, primary key)
  - `name` (text, not null) — name of the subject/course
  - `teacher_name` (text, nullable) — optional teacher name linked to this subject
  - `schedule` (text, nullable) — optional schedule description (e.g. "Lun 10:00-12:00")
  - `color` (text, nullable) — optional color tag for visual organization
  - `notes` (text, nullable) — additional notes about the subject
  - `created_at` (timestamptz, default now)
- `teachers`
  - `id` (uuid, primary key)
  - `name` (text, not null) — teacher's full name
  - `email` (text, nullable) — contact email
  - `phone` (text, nullable) — contact phone
  - `office_hours` (text, nullable) — office/consultation hours
  - `notes` (text, nullable) — additional notes
  - `created_at` (timestamptz, default now)
- `calendar_events`
  - `id` (uuid, primary key)
  - `title` (text, not null) — event title
  - `description` (text, nullable) — event description
  - `event_date` (date, not null) — date of the event
  - `event_time` (text, nullable) — time of the event (e.g. "14:30")
  - `event_type` (text, not null default 'general') — type: 'exam', 'assignment', 'class', 'general'
  - `subject_id` (uuid, nullable, references subjects) — optional link to a subject
  - `created_at` (timestamptz, default now)

2. Security
- Enable RLS on all three tables.
- This is a single-tenant app (no sign-in), so all policies use `TO anon, authenticated` with `USING (true)` / `WITH CHECK (true)` because the data is intentionally shared/public.

3. Important Notes
- All tables use `gen_random_uuid()` for primary keys.
- `calendar_events.subject_id` has ON DELETE SET NULL so deleting a subject doesn't lose calendar events.
- Policies are idempotent (DROP IF EXISTS before CREATE).
*/

CREATE TABLE IF NOT EXISTS subjects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  teacher_name text,
  schedule text,
  color text,
  notes text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE subjects ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_subjects" ON subjects;
CREATE POLICY "anon_select_subjects" ON subjects FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_subjects" ON subjects;
CREATE POLICY "anon_insert_subjects" ON subjects FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_subjects" ON subjects;
CREATE POLICY "anon_update_subjects" ON subjects FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_subjects" ON subjects;
CREATE POLICY "anon_delete_subjects" ON subjects FOR DELETE
  TO anon, authenticated USING (true);

CREATE TABLE IF NOT EXISTS teachers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text,
  phone text,
  office_hours text,
  notes text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE teachers ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_teachers" ON teachers;
CREATE POLICY "anon_select_teachers" ON teachers FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_teachers" ON teachers;
CREATE POLICY "anon_insert_teachers" ON teachers FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_teachers" ON teachers;
CREATE POLICY "anon_update_teachers" ON teachers FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_teachers" ON teachers;
CREATE POLICY "anon_delete_teachers" ON teachers FOR DELETE
  TO anon, authenticated USING (true);

CREATE TABLE IF NOT EXISTS calendar_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  event_date date NOT NULL,
  event_time text,
  event_type text NOT NULL DEFAULT 'general',
  subject_id uuid REFERENCES subjects(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE calendar_events ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_calendar_events" ON calendar_events;
CREATE POLICY "anon_select_calendar_events" ON calendar_events FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_calendar_events" ON calendar_events;
CREATE POLICY "anon_insert_calendar_events" ON calendar_events FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_calendar_events" ON calendar_events;
CREATE POLICY "anon_update_calendar_events" ON calendar_events FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_calendar_events" ON calendar_events;
CREATE POLICY "anon_delete_calendar_events" ON calendar_events FOR DELETE
  TO anon, authenticated USING (true);
