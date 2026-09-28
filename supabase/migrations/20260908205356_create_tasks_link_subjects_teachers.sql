/*
# Create tasks table and link subjects with teachers

1. New Tables
- `tasks`
  - `id` (uuid, primary key)
  - `title` (text, not null)
  - `description` (text, nullable)
  - `is_urgent` (boolean, default false)
  - `is_completed` (boolean, default false)
  - `created_at` (timestamptz, default now)
  - `completed_at` (timestamptz, nullable)
  - `pomodoros_completed` (integer, default 0)
  - `subject_id` (uuid, nullable, references subjects ON DELETE SET NULL)
  - `due_date` (date, nullable) — deadline for the task, shown in calendar

2. Modified Tables
- `subjects`: add `teacher_id` (uuid, nullable, references teachers ON DELETE SET NULL)
  This links each subject to a specific teacher.

3. Security
- Enable RLS on `tasks`.
- Single-tenant app (no sign-in): all policies use `TO anon, authenticated` with `USING (true)` / `WITH CHECK (true)`.
- Policies are idempotent (DROP IF EXISTS before CREATE).

4. Important Notes
- `tasks.subject_id` links tasks to subjects (ON DELETE SET NULL so deleting a subject doesn't lose tasks).
- `subjects.teacher_id` links subjects to teachers (ON DELETE SET NULL so deleting a teacher doesn't lose subjects).
- `tasks.due_date` allows tasks to appear on the calendar.
*/

CREATE TABLE IF NOT EXISTS tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  is_urgent boolean NOT NULL DEFAULT false,
  is_completed boolean NOT NULL DEFAULT false,
  created_at timestamptz DEFAULT now(),
  completed_at timestamptz,
  pomodoros_completed integer NOT NULL DEFAULT 0,
  subject_id uuid REFERENCES subjects(id) ON DELETE SET NULL,
  due_date date
);

ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_tasks" ON tasks;
CREATE POLICY "anon_select_tasks" ON tasks FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_tasks" ON tasks;
CREATE POLICY "anon_insert_tasks" ON tasks FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_tasks" ON tasks;
CREATE POLICY "anon_update_tasks" ON tasks FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_tasks" ON tasks;
CREATE POLICY "anon_delete_tasks" ON tasks FOR DELETE
  TO anon, authenticated USING (true);

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'subjects' AND column_name = 'teacher_id'
  ) THEN
    ALTER TABLE subjects ADD COLUMN teacher_id uuid REFERENCES teachers(id) ON DELETE SET NULL;
  END IF;
END $$;
