import { LayoutDashboard, ListTodo, Calendar, BookOpen, Users, TrendingUp, CalendarClock } from 'lucide-react';

interface SidebarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

export const Sidebar = ({ currentPage, onNavigate }: SidebarProps) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'tasks', label: 'Tareas', icon: ListTodo },
    { id: 'calendar', label: 'Calendario', icon: Calendar },
    { id: 'subjects', label: 'Materias', icon: BookOpen },
    { id: 'teachers', label: 'Profesores', icon: Users },
    { id: 'performance', label: 'Rendimiento', icon: TrendingUp },
    { id: 'organization', label: 'Organización', description: 'Planifica tu tiempo, bloques de estudio y descanso.', icon: CalendarClock },
  ];

  return (
    <div className="w-64 bg-white border-r border-gray-200 h-screen flex flex-col">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center">
            <img src="/kd-sticky-note-logo-1024x1024.png" alt="Logo" className="w-7 h-7 object-contain" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-800">KeepDay</h1>
            <p className="text-xs text-gray-500">Pomodoro & Study Log</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            return (
              <li key={item.id}>
                <button
                  onClick={() => onNavigate(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-md'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-left"><span className="block font-medium">{item.label}</span>{item.description && <span className={`mt-0.5 block text-[10px] leading-tight ${isActive ? 'text-white/80' : 'text-gray-500'}`}>{item.description}</span>}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="p-4 border-t border-gray-200">
        <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-lg p-4">
          <p className="text-sm text-gray-700 font-medium">Mantente enfocado</p>
          <p className="text-xs text-gray-600 mt-1">
            Usa la técnica Pomodoro para mejorar tu productividad
          </p>
        </div>
      </div>
    </div>
  );
};
