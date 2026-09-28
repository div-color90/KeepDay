import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
const blockTypes = [
    { value: 'study', label: 'Estudio' },
    { value: 'work', label: 'Trabajo' },
    { value: 'task', label: 'Tareas' },
    { value: 'tutoring', label: 'Clase particular' },
    { value: 'review', label: 'Repaso' },
    { value: 'break', label: 'Descanso' },
    { value: 'meal', label: 'Comida' },
    { value: 'commute', label: 'Desplazamiento' },
    { value: 'personal', label: 'Tiempo personal' },
    { value: 'sleep', label: 'Dormir' },
];
const getMinutes = (time) => {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
};
const getPomodoros = (start, end, focusMinutes, breakMinutes) => {
    const duration = getMinutes(end) - getMinutes(start);
    if (duration <= 0 || focusMinutes <= 0)
        return 0;
    return Math.floor(duration / (focusMinutes + breakMinutes));
};
export const OrganizationBlockForm = ({ block, selectedDate, subjects, tasks, focusMinutes, breakMinutes, onSubmit, onCancel, }) => {
    const [name, setName] = useState(block?.name || '');
    const [date, setDate] = useState(block?.block_date || selectedDate);
    const [startTime, setStartTime] = useState(block?.start_time?.slice(0, 5) || '08:15');
    const [endTime, setEndTime] = useState(block?.end_time?.slice(0, 5) || '09:15');
    const [blockType, setBlockType] = useState(block?.block_type || 'study');
    const [subjectId, setSubjectId] = useState(block?.subject_id || '');
    const [taskId, setTaskId] = useState(block?.task_id || '');
    const [recurrence, setRecurrence] = useState(block?.recurrence || 'none');
    const [notes, setNotes] = useState(block?.notes || '');
    useEffect(() => {
        if (blockType !== 'study' && blockType !== 'review') {
            setSubjectId('');
        }
    }, [blockType]);
    const estimatedPomodoros = getPomodoros(startTime, endTime, focusMinutes, breakMinutes);
    const handleSubmit = (event) => {
        event.preventDefault();
        if (!name.trim() || getMinutes(endTime) <= getMinutes(startTime))
            return;
        onSubmit({
            name: name.trim(),
            block_date: date,
            start_time: startTime,
            end_time: endTime,
            block_type: blockType,
            subject_id: subjectId || null,
            task_id: taskId || null,
            recurrence,
            notes: notes.trim(),
            pomodoros_estimated: estimatedPomodoros,
        });
    };
    return (_jsx("div", { className: "fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4", children: _jsxs("div", { className: "max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white shadow-2xl", children: [_jsxs("div", { className: "flex items-center justify-between border-b border-gray-200 p-6", children: [_jsx("h3", { className: "text-xl font-bold text-gray-800", children: block ? 'Editar bloque' : 'Nuevo bloque' }), _jsx("button", { onClick: onCancel, className: "rounded-lg p-2 transition-colors hover:bg-gray-100", children: _jsx(X, { className: "h-5 w-5 text-gray-600" }) })] }), _jsxs("form", { onSubmit: handleSubmit, className: "space-y-4 p-6", children: [_jsxs("div", { children: [_jsx("label", { className: "mb-2 block text-sm font-medium text-gray-700", children: "Nombre" }), _jsx("input", { value: name, onChange: (event) => setName(event.target.value), required: true, autoFocus: true, placeholder: "Ej: Estudiar programaci\u00F3n", className: "w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-transparent focus:ring-2 focus:ring-amber-500" })] }), _jsxs("div", { className: "grid grid-cols-1 gap-4 sm:grid-cols-3", children: [_jsxs("div", { children: [_jsx("label", { className: "mb-2 block text-sm font-medium text-gray-700", children: "Fecha" }), _jsx("input", { type: "date", value: date, onChange: (event) => setDate(event.target.value), required: true, className: "w-full rounded-lg border border-gray-300 px-3 py-3 focus:border-transparent focus:ring-2 focus:ring-amber-500" })] }), _jsxs("div", { children: [_jsx("label", { className: "mb-2 block text-sm font-medium text-gray-700", children: "Inicio" }), _jsx("input", { type: "time", value: startTime, onChange: (event) => setStartTime(event.target.value), required: true, className: "w-full rounded-lg border border-gray-300 px-3 py-3 focus:border-transparent focus:ring-2 focus:ring-amber-500" })] }), _jsxs("div", { children: [_jsx("label", { className: "mb-2 block text-sm font-medium text-gray-700", children: "Fin" }), _jsx("input", { type: "time", value: endTime, onChange: (event) => setEndTime(event.target.value), required: true, className: "w-full rounded-lg border border-gray-300 px-3 py-3 focus:border-transparent focus:ring-2 focus:ring-amber-500" })] })] }), _jsxs("div", { children: [_jsx("label", { className: "mb-2 block text-sm font-medium text-gray-700", children: "Tipo de bloque" }), _jsx("select", { value: blockType, onChange: (event) => setBlockType(event.target.value), className: "w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-transparent focus:ring-2 focus:ring-amber-500", children: blockTypes.map((type) => _jsx("option", { value: type.value, children: type.label }, type.value)) })] }), (blockType === 'study' || blockType === 'review') && (_jsxs("div", { children: [_jsx("label", { className: "mb-2 block text-sm font-medium text-gray-700", children: "Materia (opcional)" }), _jsxs("select", { value: subjectId, onChange: (event) => setSubjectId(event.target.value), className: "w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-transparent focus:ring-2 focus:ring-amber-500", children: [_jsx("option", { value: "", children: "Sin materia" }), subjects.map((subject) => _jsx("option", { value: subject.id, children: subject.name }, subject.id))] })] })), (blockType === 'task' || blockType === 'study' || blockType === 'review') && (_jsxs("div", { children: [_jsx("label", { className: "mb-2 block text-sm font-medium text-gray-700", children: "Tarea relacionada (opcional)" }), _jsxs("select", { value: taskId, onChange: (event) => setTaskId(event.target.value), className: "w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-transparent focus:ring-2 focus:ring-amber-500", children: [_jsx("option", { value: "", children: "Sin tarea" }), tasks.filter((task) => !task.is_completed).map((task) => _jsx("option", { value: task.id, children: task.title }, task.id))] })] })), _jsxs("div", { children: [_jsx("label", { className: "mb-2 block text-sm font-medium text-gray-700", children: "Repetici\u00F3n" }), _jsxs("select", { value: recurrence, onChange: (event) => setRecurrence(event.target.value), className: "w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-transparent focus:ring-2 focus:ring-amber-500", children: [_jsx("option", { value: "none", children: "No repetir" }), _jsx("option", { value: "daily", children: "Cada d\u00EDa" }), _jsx("option", { value: "weekdays", children: "De lunes a viernes" }), _jsx("option", { value: "tue-fri", children: "De martes a viernes" }), _jsx("option", { value: "weekends", children: "S\u00E1bado y domingo" }), _jsx("option", { value: "weekly", children: "Cada semana" })] })] }), _jsxs("div", { children: [_jsx("label", { className: "mb-2 block text-sm font-medium text-gray-700", children: "Notas" }), _jsx("textarea", { value: notes, onChange: (event) => setNotes(event.target.value), rows: 2, placeholder: "Detalles adicionales...", className: "w-full resize-none rounded-lg border border-gray-300 px-4 py-3 focus:border-transparent focus:ring-2 focus:ring-amber-500" })] }), _jsx("div", { className: "rounded-lg bg-amber-50 p-3 text-sm text-amber-800", children: getMinutes(endTime) > getMinutes(startTime)
                                ? `${getMinutes(endTime) - getMinutes(startTime)} minutos · ${estimatedPomodoros} Pomodoros posibles (${focusMinutes}/${breakMinutes} min)`
                                : 'La hora de finalización debe ser posterior a la de inicio.' }), _jsxs("div", { className: "flex gap-3 pt-2", children: [_jsx("button", { type: "submit", className: "flex-1 rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 px-6 py-3 font-semibold text-white shadow-md transition-all hover:from-amber-600 hover:to-orange-600", children: block ? 'Guardar cambios' : 'Crear bloque' }), _jsx("button", { type: "button", onClick: onCancel, className: "flex-1 rounded-lg bg-gray-200 px-6 py-3 font-semibold text-gray-700 transition-all hover:bg-gray-300", children: "Cancelar" })] })] })] }) }));
};
