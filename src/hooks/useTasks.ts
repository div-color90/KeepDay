import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { Task } from '../types';

export const useTasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data) {
      setTasks(data);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const addTask = async (
    title: string,
    description: string,
    isUrgent: boolean,
    subjectId: string | null = null,
    dueDate: string | null = null
  ) => {
    const { data, error } = await supabase
      .from('tasks')
      .insert({
        title,
        description: description || null,
        is_urgent: isUrgent,
        is_completed: false,
        pomodoros_completed: 0,
        subject_id: subjectId,
        due_date: dueDate,
      })
      .select()
      .single();

    if (!error && data) {
      setTasks((prev) => [data as Task, ...prev]);
    }
  };

  const updateTask = async (id: string, updates: Partial<Task>) => {
    const { error } = await supabase.from('tasks').update(updates).eq('id', id);
    if (!error) {
      setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, ...updates } : t)));
    }
  };

  const deleteTask = async (id: string) => {
    const { error } = await supabase.from('tasks').delete().eq('id', id);
    if (!error) {
      setTasks((prev) => prev.filter((t) => t.id !== id));
    }
  };

  const toggleComplete = async (id: string) => {
    const task = tasks.find((t) => t.id === id);
    if (!task) return;
    const newCompleted = !task.is_completed;
    const { error } = await supabase
      .from('tasks')
      .update({
        is_completed: newCompleted,
        completed_at: newCompleted ? new Date().toISOString() : null,
      })
      .eq('id', id);
    if (!error) {
      setTasks((prev) =>
        prev.map((t) =>
          t.id === id
            ? {
                ...t,
                is_completed: newCompleted,
                completed_at: newCompleted ? new Date().toISOString() : null,
              }
            : t
        )
      );
    }
  };

  const toggleUrgent = async (id: string) => {
    const task = tasks.find((t) => t.id === id);
    if (!task) return;
    const newUrgent = !task.is_urgent;
    const { error } = await supabase
      .from('tasks')
      .update({ is_urgent: newUrgent })
      .eq('id', id);
    if (!error) {
      setTasks((prev) =>
        prev.map((t) => (t.id === id ? { ...t, is_urgent: newUrgent } : t))
      );
    }
  };

  const incrementPomodoro = async (id: string) => {
    const task = tasks.find((t) => t.id === id);
    if (!task) return;
    const newCount = task.pomodoros_completed + 1;
    const { error } = await supabase
      .from('tasks')
      .update({ pomodoros_completed: newCount })
      .eq('id', id);
    if (!error) {
      setTasks((prev) =>
        prev.map((t) => (t.id === id ? { ...t, pomodoros_completed: newCount } : t))
      );
    }
  };

  return {
    tasks,
    loading,
    addTask,
    updateTask,
    deleteTask,
    toggleComplete,
    toggleUrgent,
    incrementPomodoro,
  };
};
