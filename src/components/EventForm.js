import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { X } from 'lucide-react';
const eventTypes = [
    { value: 'general', label: 'General', color: 'bg-gray-100 text-gray-700' },
    { value: 'exam', label: 'Examen', color: 'bg-red-100 text-red-700' },
    { value: 'assignment', label: 'Entrega', color: 'bg-amber-100 text-amber-700' },
    { value: 'class', label: 'Clase', color: 'bg-blue-100 text-blue-700' },
];
export const EventForm = ({ subjects, onSubmit, onCancel }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [eventDate, setEventDate] = useState('');
    const [eventTime, setEventTime] = useState('');
    const [eventType, setEventType] = useState('general');
    const [subjectId, setSubjectId] = useState('');
    const handleSubmit = (e) => {
        e.preventDefault();
        if (title.trim() && eventDate) {
            onSubmit({
                title: title.trim(),
                description: description.trim(),
                event_date: eventDate,
                event_time: eventTime.trim(),
                event_type: eventType,
                subject_id: subjectId || null,
            });
        }
    };
    return (_jsx("div", { className: "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4", children: _jsxs("div", { className: "bg-white rounded-2xl shadow-2xl w-full max-w-md", children: [_jsxs("div", { className: "flex justify-between items-center p-6 border-b border-gray-200", children: [_jsx("h3", { className: "text-xl font-bold text-gray-800", children: "Nuevo Evento" }), _jsx("button", { onClick: onCancel, className: "p-2 hover:bg-gray-100 rounded-lg transition-colors", children: _jsx(X, { className: "w-5 h-5 text-gray-600" }) })] }), _jsxs("form", { onSubmit: handleSubmit, className: "p-6 space-y-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "T\u00EDtulo" }), _jsx("input", { type: "text", value: title, onChange: (e) => setTitle(e.target.value), placeholder: "Ej: Examen parcial", className: "w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent", autoFocus: true })] }), _jsxs("div", { className: "grid grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Fecha" }), _jsx("input", { type: "date", value: eventDate, onChange: (e) => setEventDate(e.target.value), className: "w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent", required: true })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Hora" }), _jsx("input", { type: "time", value: eventTime, onChange: (e) => setEventTime(e.target.value), className: "w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent" })] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Tipo de evento" }), _jsx("div", { className: "grid grid-cols-2 gap-2", children: eventTypes.map((type) => (_jsx("button", { type: "button", onClick: () => setEventType(type.value), className: `px-4 py-2 rounded-lg font-medium text-sm transition-all ${eventType === type.value
                                            ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-md'
                                            : `${type.color} hover:opacity-80`}`, children: type.label }, type.value))) })] }), subjects.length > 0 && (_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Materia (opcional)" }), _jsxs("select", { value: subjectId, onChange: (e) => setSubjectId(e.target.value), className: "w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent", children: [_jsx("option", { value: "", children: "Sin materia" }), subjects.map((subject) => (_jsx("option", { value: subject.id, children: subject.name }, subject.id)))] })] })), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Descripci\u00F3n" }), _jsx("textarea", { value: description, onChange: (e) => setDescription(e.target.value), placeholder: "Detalles adicionales...", rows: 3, className: "w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent resize-none" })] }), _jsxs("div", { className: "flex gap-3 pt-4", children: [_jsx("button", { type: "submit", className: "flex-1 px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-lg font-semibold hover:from-amber-600 hover:to-orange-600 transition-all shadow-md hover:shadow-lg", children: "Crear Evento" }), _jsx("button", { type: "button", onClick: onCancel, className: "flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-all", children: "Cancelar" })] })] })] }) }));
};
