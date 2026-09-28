import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { LayoutDashboard, ListTodo, Calendar, BookOpen, Users, TrendingUp, CalendarClock } from 'lucide-react';
export const Sidebar = ({ currentPage, onNavigate }) => {
    const menuItems = [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'tasks', label: 'Tareas', icon: ListTodo },
        { id: 'calendar', label: 'Calendario', icon: Calendar },
        { id: 'subjects', label: 'Materias', icon: BookOpen },
        { id: 'teachers', label: 'Profesores', icon: Users },
        { id: 'performance', label: 'Rendimiento', icon: TrendingUp },
        { id: 'organization', label: 'Organización', description: 'Planifica tu tiempo, bloques de estudio y descanso.', icon: CalendarClock },
    ];
    return (_jsxs("div", { className: "w-64 bg-white border-r border-gray-200 h-screen flex flex-col", children: [_jsx("div", { className: "p-6 border-b border-gray-200", children: _jsxs("div", { className: "flex items-center gap-3", children: [_jsx("div", { className: "w-10 h-10 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center", children: _jsx("img", { src: "/kd-sticky-note-logo-1024x1024.png", alt: "Logo", className: "w-7 h-7 object-contain" }) }), _jsxs("div", { children: [_jsx("h1", { className: "text-xl font-bold text-gray-800", children: "KeepDay" }), _jsx("p", { className: "text-xs text-gray-500", children: "Pomodoro & Study Log" })] })] }) }), _jsx("nav", { className: "flex-1 p-4", children: _jsx("ul", { className: "space-y-2", children: menuItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = currentPage === item.id;
                        return (_jsx("li", { children: _jsxs("button", { onClick: () => onNavigate(item.id), className: `w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${isActive
                                    ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-md'
                                    : 'text-gray-700 hover:bg-gray-100'}`, children: [_jsx(Icon, { className: "w-5 h-5" }), _jsxs("span", { className: "text-left", children: [_jsx("span", { className: "block font-medium", children: item.label }), item.description && _jsx("span", { className: `mt-0.5 block text-[10px] leading-tight ${isActive ? 'text-white/80' : 'text-gray-500'}`, children: item.description })] })] }) }, item.id));
                    }) }) }), _jsx("div", { className: "p-4 border-t border-gray-200", children: _jsxs("div", { className: "bg-gradient-to-br from-amber-50 to-orange-50 rounded-lg p-4", children: [_jsx("p", { className: "text-sm text-gray-700 font-medium", children: "Mantente enfocado" }), _jsx("p", { className: "text-xs text-gray-600 mt-1", children: "Usa la t\u00E9cnica Pomodoro para mejorar tu productividad" })] }) })] }));
};
