import { CheckCircle2, AlertCircle, ListChecks } from 'lucide-react';
import { PomodoroTimer } from '../components/PomodoroTimer';
import { Task } from '../types';

interface DashboardProps {
  tasks: Task[];
  timeLeft: number;
  isActive: boolean;
  isPaused: boolean;
  isFocusMode: boolean;
  focusTime: number;
  breakTime: number;
  formatTime: (seconds: number) => string;
  onStart: () => void;
  onPause: () => void;
  onResume: () => void;
  onReset: () => void;
  onSkip: () => void;
  onFocusTimeChange: (time: number) => void;
  onBreakTimeChange: (time: number) => void;
}

export const Dashboard = ({
  tasks,
  timeLeft,
  isActive,
  isPaused,
  isFocusMode,
  focusTime,
  breakTime,
  formatTime,
  onStart,
  onPause,
  onResume,
  onReset,
  onSkip,
  onFocusTimeChange,
  onBreakTimeChange,
}: DashboardProps) => {
  const pendingTasks = tasks.filter(t => !t.is_completed);
  const urgentTasks = tasks.filter(t => t.is_urgent && !t.is_completed);
  const completedTasks = tasks.filter(t => t.is_completed);

  const stats = [
    {
      label: 'Tareas Pendientes',
      value: pendingTasks.length,
      icon: ListChecks,
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600',
    },
    {
      label: 'Tareas Urgentes',
      value: urgentTasks.length,
      icon: AlertCircle,
      color: 'from-red-500 to-pink-500',
      bgColor: 'bg-red-50',
      textColor: 'text-red-600',
    },
    {
      label: 'Tareas Completadas',
      value: completedTasks.length,
      icon: CheckCircle2,
      color: 'from-green-500 to-emerald-500',
      bgColor: 'bg-green-50',
      textColor: 'text-green-600',
    },
  ];

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
        <p className="text-gray-600 mt-1">Bienvenido a tu espacio de productividad</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">{stat.label}</p>
                  <p className="text-3xl font-bold text-gray-800">{stat.value}</p>
                </div>
                <div className={`${stat.bgColor} p-3 rounded-xl`}>
                  <Icon className={`w-8 h-8 ${stat.textColor}`} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="max-w-3xl mx-auto">
        <PomodoroTimer
          timeLeft={timeLeft}
          isActive={isActive}
          isPaused={isPaused}
          isFocusMode={isFocusMode}
          focusTime={focusTime}
          breakTime={breakTime}
          formatTime={formatTime}
          onStart={onStart}
          onPause={onPause}
          onResume={onResume}
          onReset={onReset}
          onSkip={onSkip}
          onFocusTimeChange={onFocusTimeChange}
          onBreakTimeChange={onBreakTimeChange}
        />
      </div>

      {pendingTasks.length > 0 && (
        <div className="mt-8 max-w-3xl mx-auto">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Tareas Recientes</h2>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="space-y-3">
              {pendingTasks.slice(0, 3).map((task) => (
                <div key={task.id} className="flex items-center gap-3 pb-3 border-b border-gray-100 last:border-0 last:pb-0">
                  <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-800">{task.title}</p>
                    {task.is_urgent && (
                      <span className="text-xs text-red-600 font-medium">Urgente</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
