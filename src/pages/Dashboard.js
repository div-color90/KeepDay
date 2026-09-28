import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { CheckCircle2, AlertCircle, ListChecks } from 'lucide-react';
import { PomodoroTimer } from '../components/PomodoroTimer';
export const Dashboard = ({ tasks, timeLeft, isActive, isPaused, isFocusMode, focusTime, breakTime, formatTime, onStart, onPause, onResume, onReset, onSkip, onFocusTimeChange, onBreakTimeChange, }) => {
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
    return (_jsxs("div", { className: "p-8", children: [_jsxs("div", { className: "mb-8", children: [_jsx("h1", { className: "text-3xl font-bold text-gray-800", children: "Dashboard" }), _jsx("p", { className: "text-gray-600 mt-1", children: "Bienvenido a tu espacio de productividad" })] }), _jsx("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8", children: stats.map((stat) => {
                    const Icon = stat.icon;
                    return (_jsx("div", { className: "bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("p", { className: "text-sm font-medium text-gray-600 mb-1", children: stat.label }), _jsx("p", { className: "text-3xl font-bold text-gray-800", children: stat.value })] }), _jsx("div", { className: `${stat.bgColor} p-3 rounded-xl`, children: _jsx(Icon, { className: `w-8 h-8 ${stat.textColor}` }) })] }) }, stat.label));
                }) }), _jsx("div", { className: "max-w-3xl mx-auto", children: _jsx(PomodoroTimer, { timeLeft: timeLeft, isActive: isActive, isPaused: isPaused, isFocusMode: isFocusMode, focusTime: focusTime, breakTime: breakTime, formatTime: formatTime, onStart: onStart, onPause: onPause, onResume: onResume, onReset: onReset, onSkip: onSkip, onFocusTimeChange: onFocusTimeChange, onBreakTimeChange: onBreakTimeChange }) }), pendingTasks.length > 0 && (_jsxs("div", { className: "mt-8 max-w-3xl mx-auto", children: [_jsx("h2", { className: "text-xl font-bold text-gray-800 mb-4", children: "Tareas Recientes" }), _jsx("div", { className: "bg-white rounded-xl shadow-sm border border-gray-200 p-6", children: _jsx("div", { className: "space-y-3", children: pendingTasks.slice(0, 3).map((task) => (_jsxs("div", { className: "flex items-center gap-3 pb-3 border-b border-gray-100 last:border-0 last:pb-0", children: [_jsx("div", { className: "w-2 h-2 bg-amber-500 rounded-full" }), _jsxs("div", { className: "flex-1", children: [_jsx("p", { className: "font-medium text-gray-800", children: task.title }), task.is_urgent && (_jsx("span", { className: "text-xs text-red-600 font-medium", children: "Urgente" }))] })] }, task.id))) }) })] }))] }));
};
