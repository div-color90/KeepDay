import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Timer, CheckCircle2, Clock, TrendingUp } from 'lucide-react';
export const Performance = ({ tasks, totalPomodoros, totalFocusTime }) => {
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
    return (_jsxs("div", { className: "p-8", children: [_jsxs("div", { className: "mb-8", children: [_jsx("h1", { className: "text-3xl font-bold text-gray-800", children: "Rendimiento" }), _jsx("p", { className: "text-gray-600 mt-1", children: "Estad\u00EDsticas y progreso de tu productividad" })] }), _jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8", children: stats.map((stat) => {
                    const Icon = stat.icon;
                    return (_jsxs("div", { className: "bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow", children: [_jsx("div", { className: `${stat.bgColor} w-12 h-12 rounded-xl flex items-center justify-center mb-4`, children: _jsx(Icon, { className: `w-6 h-6 ${stat.textColor}` }) }), _jsx("p", { className: "text-sm font-medium text-gray-600 mb-1", children: stat.label }), _jsx("p", { className: "text-2xl font-bold text-gray-800", children: stat.value })] }, stat.label));
                }) }), _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-6", children: [_jsxs("div", { className: "bg-white rounded-xl shadow-sm border border-gray-200 p-6", children: [_jsx("h2", { className: "text-xl font-bold text-gray-800 mb-4", children: "Resumen de Productividad" }), _jsxs("div", { className: "space-y-4", children: [_jsxs("div", { children: [_jsxs("div", { className: "flex justify-between text-sm mb-2", children: [_jsx("span", { className: "text-gray-600", children: "Progreso general" }), _jsxs("span", { className: "font-semibold text-gray-800", children: [completionRate, "%"] })] }), _jsx("div", { className: "w-full bg-gray-200 rounded-full h-3", children: _jsx("div", { className: "bg-gradient-to-r from-amber-500 to-orange-500 h-3 rounded-full transition-all duration-500", style: { width: `${completionRate}%` } }) })] }), _jsx("div", { className: "pt-4 border-t border-gray-200", children: _jsxs("div", { className: "grid grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsx("p", { className: "text-sm text-gray-600", children: "Total de tareas" }), _jsx("p", { className: "text-2xl font-bold text-gray-800", children: totalTasks })] }), _jsxs("div", { children: [_jsx("p", { className: "text-sm text-gray-600", children: "Promedio Pomodoros/tarea" }), _jsx("p", { className: "text-2xl font-bold text-gray-800", children: completedTasks > 0
                                                                ? Math.round(tasks
                                                                    .filter(t => t.is_completed)
                                                                    .reduce((acc, t) => acc + t.pomodoros_completed, 0) / completedTasks)
                                                                : 0 })] })] }) })] })] }), _jsxs("div", { className: "bg-white rounded-xl shadow-sm border border-gray-200 p-6", children: [_jsx("h2", { className: "text-xl font-bold text-gray-800 mb-4", children: "Tareas Completadas Recientemente" }), recentCompletedTasks.length > 0 ? (_jsx("div", { className: "space-y-3", children: recentCompletedTasks.map((task) => (_jsxs("div", { className: "flex items-start gap-3 pb-3 border-b border-gray-100 last:border-0 last:pb-0", children: [_jsx("div", { className: "flex-shrink-0 w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center", children: _jsx(CheckCircle2, { className: "w-5 h-5 text-green-600" }) }), _jsxs("div", { className: "flex-1 min-w-0", children: [_jsx("p", { className: "font-medium text-gray-800 truncate", children: task.title }), _jsxs("div", { className: "flex items-center gap-2 mt-1", children: [_jsx("span", { className: "text-xs text-gray-500", children: new Date(task.completed_at).toLocaleDateString() }), task.pomodoros_completed > 0 && (_jsxs("span", { className: "text-xs text-amber-600 font-medium", children: [task.pomodoros_completed, " Pomodoros"] }))] })] })] }, task.id))) })) : (_jsxs("div", { className: "text-center py-8", children: [_jsx("p", { className: "text-gray-500", children: "No hay tareas completadas a\u00FAn" }), _jsx("p", { className: "text-gray-400 text-sm mt-1", children: "Completa tu primera tarea para ver tus logros" })] }))] })] })] }));
};
