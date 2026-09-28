import { Timer, CheckCircle2, Clock, TrendingUp } from 'lucide-react';
import { Task } from '../types';

interface PerformanceProps {
  tasks: Task[];
  totalPomodoros: number;
  totalFocusTime: number;
}

export const Performance = ({ tasks, totalPomodoros, totalFocusTime }: PerformanceProps) => {
  const completedTasks = tasks.filter(t => t.is_completed).length;
  const totalTasks = tasks.length;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const stats = [
    {
      label: 'Pomodoros Completados',
      value: totalPomodoros,
      icon: Timer,
      color: 'from-amber-500 to-orange-500',
      bgColor: 'bg-amber-50',
      textColor: 'text-amber-600',
    },
    {
      label: 'Tareas Completadas',
      value: completedTasks,
      icon: CheckCircle2,
      color: 'from-green-500 to-emerald-500',
      bgColor: 'bg-green-50',
      textColor: 'text-green-600',
    },
    {
      label: 'Tiempo Total Enfocado',
      value: `${totalFocusTime} min`,
      icon: Clock,
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600',
    },
    {
      label: 'Tasa de Completación',
      value: `${completionRate}%`,
      icon: TrendingUp,
      color: 'from-purple-500 to-pink-500',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-600',
    },
  ];

  const recentCompletedTasks = tasks
    .filter(t => t.is_completed)
    .sort((a, b) => {
      const dateA = new Date(a.completed_at || 0).getTime();
      const dateB = new Date(b.completed_at || 0).getTime();
      return dateB - dateA;
    })
    .slice(0, 5);

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Rendimiento</h1>
        <p className="text-gray-600 mt-1">Estadísticas y progreso de tu productividad</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
            >
              <div className={`${stat.bgColor} w-12 h-12 rounded-xl flex items-center justify-center mb-4`}>
                <Icon className={`w-6 h-6 ${stat.textColor}`} />
              </div>
              <p className="text-sm font-medium text-gray-600 mb-1">{stat.label}</p>
              <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Resumen de Productividad</h2>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-600">Progreso general</span>
                <span className="font-semibold text-gray-800">{completionRate}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-gradient-to-r from-amber-500 to-orange-500 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${completionRate}%` }}
                ></div>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-200">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Total de tareas</p>
                  <p className="text-2xl font-bold text-gray-800">{totalTasks}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Promedio Pomodoros/tarea</p>
                  <p className="text-2xl font-bold text-gray-800">
                    {completedTasks > 0
                      ? Math.round(
                          tasks
                            .filter(t => t.is_completed)
                            .reduce((acc, t) => acc + t.pomodoros_completed, 0) / completedTasks
                        )
                      : 0}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Tareas Completadas Recientemente</h2>
          {recentCompletedTasks.length > 0 ? (
            <div className="space-y-3">
              {recentCompletedTasks.map((task) => (
                <div
                  key={task.id}
                  className="flex items-start gap-3 pb-3 border-b border-gray-100 last:border-0 last:pb-0"
                >
                  <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-800 truncate">{task.title}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-gray-500">
                        {new Date(task.completed_at!).toLocaleDateString()}
                      </span>
                      {task.pomodoros_completed > 0 && (
                        <span className="text-xs text-amber-600 font-medium">
                          {task.pomodoros_completed} Pomodoros
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">No hay tareas completadas aún</p>
              <p className="text-gray-400 text-sm mt-1">Completa tu primera tarea para ver tus logros</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
