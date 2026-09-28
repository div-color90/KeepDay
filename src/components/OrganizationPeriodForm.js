import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { X } from 'lucide-react';
export const OrganizationPeriodForm = ({ onSubmit, onCancel }) => {
    const [name, setName] = useState('');
    const [startDate, setStartDate] = useState('2026-09-15');
    const [endDate, setEndDate] = useState('2026-10-22');
    const handleSubmit = (event) => {
        event.preventDefault();
        if (name.trim() && startDate <= endDate)
            onSubmit({ name: name.trim(), start_date: startDate, end_date: endDate });
    };
    return (_jsx("div", { className: "fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4", children: _jsxs("div", { className: "w-full max-w-md rounded-2xl bg-white shadow-2xl", children: [_jsxs("div", { className: "flex items-center justify-between border-b border-gray-200 p-6", children: [_jsx("h3", { className: "text-xl font-bold text-gray-800", children: "Nuevo periodo" }), _jsx("button", { onClick: onCancel, className: "rounded-lg p-2 hover:bg-gray-100", children: _jsx(X, { className: "h-5 w-5 text-gray-600" }) })] }), _jsxs("form", { onSubmit: handleSubmit, className: "space-y-4 p-6", children: [_jsxs("div", { children: [_jsx("label", { className: "mb-2 block text-sm font-medium text-gray-700", children: "Nombre" }), _jsx("input", { value: name, onChange: (event) => setName(event.target.value), required: true, placeholder: "Ej: Periodo de alta carga", className: "w-full rounded-lg border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-amber-500" })] }), _jsxs("div", { className: "grid grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsx("label", { className: "mb-2 block text-sm font-medium text-gray-700", children: "Inicio" }), _jsx("input", { type: "date", value: startDate, onChange: (event) => setStartDate(event.target.value), required: true, className: "w-full rounded-lg border border-gray-300 px-3 py-3 focus:ring-2 focus:ring-amber-500" })] }), _jsxs("div", { children: [_jsx("label", { className: "mb-2 block text-sm font-medium text-gray-700", children: "Final" }), _jsx("input", { type: "date", value: endDate, onChange: (event) => setEndDate(event.target.value), required: true, className: "w-full rounded-lg border border-gray-300 px-3 py-3 focus:ring-2 focus:ring-amber-500" })] })] }), _jsxs("div", { className: "flex gap-3 pt-2", children: [_jsx("button", { type: "submit", className: "flex-1 rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 px-6 py-3 font-semibold text-white", children: "Crear periodo" }), _jsx("button", { type: "button", onClick: onCancel, className: "flex-1 rounded-lg bg-gray-200 px-6 py-3 font-semibold text-gray-700", children: "Cancelar" })] })] })] }) }));
};
