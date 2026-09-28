import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect, useCallback } from 'react';
import { Plus } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { TaskList } from '../components/TaskList';
import { TaskForm } from '../components/TaskForm';
export const Tasks = ({ tasks, onAddTask, onToggleComplete, onToggleUrgent, onDeleteTask, }) => {
    const [showForm, setShowForm] = useState(false);
    const [filter, setFilter] = useState('all');
    const [subjects, setSubjects] = useState([]);
    const fetchSubjects = useCallback(async () => {
        const { data } = await supabase.from('subjects').select('*').order('name');
        if (data)
            setSubjects(data);
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
    return (_jsxs("div", { className: "p-8", children: [_jsxs("div", { className: "flex justify-between items-center mb-8", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-3xl font-bold text-gray-800", children: "Tareas" }), _jsx("p", { className: "text-gray-600 mt-1", children: "Gestiona todas tus tareas y actividades" })] }), _jsxs("button", { onClick: () => setShowForm(true), className: "px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl font-semibold hover:from-amber-600 hover:to-orange-600 transition-all shadow-lg hover:shadow-xl flex items-center gap-2", children: [_jsx(Plus, { className: "w-5 h-5" }), "Nueva Tarea"] })] }), _jsx("div", { className: "bg-white rounded-xl shadow-sm border border-gray-200 p-2 mb-6 inline-flex gap-2", children: filters.map((f) => (_jsxs("button", { onClick: () => setFilter(f.id), className: `px-4 py-2 rounded-lg font-medium transition-all ${filter === f.id
                        ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-md'
                        : 'text-gray-600 hover:bg-gray-100'}`, children: [f.label, " (", f.count, ")"] }, f.id))) }), _jsx("div", { className: "max-w-4xl", children: _jsx(TaskList, { tasks: filteredTasks, subjects: subjects, onToggleComplete: onToggleComplete, onToggleUrgent: onToggleUrgent, onDelete: onDeleteTask }) }), showForm && (_jsx(TaskForm, { subjects: subjects, onSubmit: (title, description, isUrgent, subjectId, dueDate) => {
                    onAddTask(title, description, isUrgent, subjectId, dueDate);
                    setShowForm(false);
                }, onCancel: () => setShowForm(false) }))] }));
};
