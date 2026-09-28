import { useState, useEffect, useCallback } from 'react';
import { Plus } from 'lucide-react';
import { Task, Subject } from '../types';
import { supabase } from '../lib/supabase';
import { TaskList } from '../components/TaskList';
import { TaskForm } from '../components/TaskForm';

interface TasksProps {
  tasks: Task[];
  onAddTask: (
    title: string,
    description: string,
    isUrgent: boolean,
    subjectId: string | null,
    dueDate: string | null
  ) => void;
  onToggleComplete: (id: string) => void;
  onToggleUrgent: (id: string) => void;
  onDeleteTask: (id: string) => void;
}

type FilterType = 'all' | 'pending' | 'urgent' | 'completed';

export const Tasks = ({
  tasks,
  onAddTask,
  onToggleComplete,
  onToggleUrgent,
  onDeleteTask,
}: TasksProps) => {
  const [showForm, setShowForm] = useState(false);
  const [filter, setFilter] = useState<FilterType>('all');
  const [subjects, setSubjects] = useState<Subject[]>([]);

  const fetchSubjects = useCallback(async () => {
    const { data } = await supabase.from('subjects').select('*').order('name');
    if (data) setSubjects(data);
  }, []);

  useEffect(() => {
    fetchSubjects();
  }, [fetchSubjects]);

  const filteredTasks = tasks.filter((task) => {
    switch (filter) {
      case 'pending':
        return !task.is_completed;
      case 'urgent':
        return task.is_urgent && !task.is_completed;
      case 'completed':
        return task.is_completed;
      default:
        return true;
    }
  });

  const filters = [
    { id: 'all', label: 'Todas', count: tasks.length },
    { id: 'pending', label: 'Pendientes', count: tasks.filter(t => !t.is_completed).length },
    { id: 'urgent', label: 'Urgentes', count: tasks.filter(t => t.is_urgent && !t.is_completed).length },
    { id: 'completed', label: 'Completadas', count: tasks.filter(t => t.is_completed).length },
  ];

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Tareas</h1>
          <p className="text-gray-600 mt-1">Gestiona todas tus tareas y actividades</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl font-semibold hover:from-amber-600 hover:to-orange-600 transition-all shadow-lg hover:shadow-xl flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Nueva Tarea
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-2 mb-6 inline-flex gap-2">
        {filters.map((f) => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id as FilterType)}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              filter === f.id
                ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-md'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            {f.label} ({f.count})
          </button>
        ))}
      </div>

      <div className="max-w-4xl">
        <TaskList
          tasks={filteredTasks}
          subjects={subjects}
          onToggleComplete={onToggleComplete}
          onToggleUrgent={onToggleUrgent}
          onDelete={onDeleteTask}
        />
      </div>

      {showForm && (
        <TaskForm
          subjects={subjects}
          onSubmit={(title, description, isUrgent, subjectId, dueDate) => {
            onAddTask(title, description, isUrgent, subjectId, dueDate);
            setShowForm(false);
          }}
          onCancel={() => setShowForm(false)}
        />
      )}
    </div>
  );
};
