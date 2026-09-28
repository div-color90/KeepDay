import { Check, AlertCircle, Trash2, Timer, BookOpen, Calendar } from 'lucide-react';
import { Task, Subject } from '../types';

interface TaskListProps {
  tasks: Task[];
  subjects: Subject[];
  onToggleComplete: (id: string) => void;
  onToggleUrgent: (id: string) => void;
  onDelete: (id: string) => void;
}

export const TaskList = ({ tasks, subjects, onToggleComplete, onToggleUrgent, onDelete }: TaskListProps) => {
  const getSubjectName = (subjectId: string | null) => {
    if (!subjectId) return null;
    const subject = subjects.find((s) => s.id === subjectId);
    return subject?.name || null;
  };

  if (tasks.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
          <Timer className="w-8 h-8 text-gray-400" />
        </div>
        <p className="text-gray-500">No hay tareas todavía</p>
        <p className="text-gray-400 text-sm mt-1">Crea una nueva tarea para comenzar</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {tasks.map((task) => (
        <div
          key={task.id}
          className={`bg-white rounded-xl shadow-sm border-2 transition-all hover:shadow-md ${
            task.is_completed ? 'border-green-200 bg-green-50' : 'border-gray-200'
          }`}
        >
          <div className="p-4">
            <div className="flex items-start gap-3">
              <button
                onClick={() => onToggleComplete(task.id)}
                className={`mt-1 flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                  task.is_completed
                    ? 'bg-green-500 border-green-500'
                    : 'border-gray-300 hover:border-amber-500'
                }`}
              >
                {task.is_completed && <Check className="w-4 h-4 text-white" />}
              </button>

              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <h4
                    className={`font-semibold text-gray-800 ${
                      task.is_completed ? 'line-through text-gray-500' : ''
                    }`}
                  >
                    {task.title}
                  </h4>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button
                      onClick={() => onToggleUrgent(task.id)}
                      className={`p-1.5 rounded-lg transition-colors ${
                        task.is_urgent
                          ? 'bg-red-100 text-red-600'
                          : 'text-gray-400 hover:bg-gray-100'
                      }`}
                      title={task.is_urgent ? 'Quitar urgente' : 'Marcar como urgente'}
                    >
                      <AlertCircle className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDelete(task.id)}
                      className="p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors"
                      title="Eliminar tarea"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {task.description && (
                  <p className="text-sm text-gray-600 mt-1">{task.description}</p>
                )}

                <div className="flex items-center gap-4 mt-3 text-xs text-gray-500">
                  {task.pomodoros_completed > 0 && (
                    <div className="flex items-center gap-1">
                      <Timer className="w-3 h-3" />
                      <span>{task.pomodoros_completed} Pomodoro{task.pomodoros_completed !== 1 ? 's' : ''}</span>
                    </div>
                  )}
                  {getSubjectName(task.subject_id) && (
                    <div className="flex items-center gap-1">
                      <BookOpen className="w-3 h-3" />
                      <span>{getSubjectName(task.subject_id)}</span>
                    </div>
                  )}
                  {task.due_date && (
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      <span>{new Date(task.due_date + 'T00:00:00').toLocaleDateString('es-ES')}</span>
                    </div>
                  )}
                  {task.is_urgent && (
                    <span className="px-2 py-1 bg-red-100 text-red-700 rounded-full font-medium">
                      Urgente
                    </span>
                  )}
                  {task.is_completed && task.completed_at && (
                    <span className="text-green-600">
                      Completada {new Date(task.completed_at).toLocaleDateString()}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
