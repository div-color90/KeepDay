import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { X } from 'lucide-react';
export const TeacherForm = ({ onSubmit, onCancel }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [officeHours, setOfficeHours] = useState('');
    const [notes, setNotes] = useState('');
    const handleSubmit = (e) => {
        e.preventDefault();
        if (name.trim()) {
            onSubmit({
                name: name.trim(),
                email: email.trim(),
                phone: phone.trim(),
                office_hours: officeHours.trim(),
                notes: notes.trim(),
            });
        }
    };
    return (_jsx("div", { className: "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4", children: _jsxs("div", { className: "bg-white rounded-2xl shadow-2xl w-full max-w-md", children: [_jsxs("div", { className: "flex justify-between items-center p-6 border-b border-gray-200", children: [_jsx("h3", { className: "text-xl font-bold text-gray-800", children: "Nuevo Profesor" }), _jsx("button", { onClick: onCancel, className: "p-2 hover:bg-gray-100 rounded-lg transition-colors", children: _jsx(X, { className: "w-5 h-5 text-gray-600" }) })] }), _jsxs("form", { onSubmit: handleSubmit, className: "p-6 space-y-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Nombre" }), _jsx("input", { type: "text", value: name, onChange: (e) => setName(e.target.value), placeholder: "Ej: Prof. Garc\u00EDa", className: "w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent", autoFocus: true })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Correo electr\u00F3nico" }), _jsx("input", { type: "email", value: email, onChange: (e) => setEmail(e.target.value), placeholder: "Ej: garcia@universidad.edu", className: "w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Tel\u00E9fono" }), _jsx("input", { type: "tel", value: phone, onChange: (e) => setPhone(e.target.value), placeholder: "Ej: +34 600 123 456", className: "w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Horario de consulta" }), _jsx("input", { type: "text", value: officeHours, onChange: (e) => setOfficeHours(e.target.value), placeholder: "Ej: Mi\u00E9 15:00-17:00", className: "w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Notas" }), _jsx("textarea", { value: notes, onChange: (e) => setNotes(e.target.value), placeholder: "Detalles adicionales...", rows: 3, className: "w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent resize-none" })] }), _jsxs("div", { className: "flex gap-3 pt-4", children: [_jsx("button", { type: "submit", className: "flex-1 px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-lg font-semibold hover:from-amber-600 hover:to-orange-600 transition-all shadow-md hover:shadow-lg", children: "Crear Profesor" }), _jsx("button", { type: "button", onClick: onCancel, className: "flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-all", children: "Cancelar" })] })] })] }) }));
};
