import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect, useCallback } from 'react';
import { Plus, Users, Trash2, Mail, Phone, Clock } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { TeacherForm } from '../components/TeacherForm';
export const Teachers = () => {
    const [teachers, setTeachers] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const fetchTeachers = useCallback(async () => {
        setLoading(true);
        setError(null);
        const { data, error: fetchError } = await supabase
            .from('teachers')
            .select('*')
            .order('created_at', { ascending: false });
        if (fetchError) {
            setError('No se pudieron cargar los profesores');
        }
        else {
            setTeachers(data || []);
        }
        setLoading(false);
    }, []);
    useEffect(() => {
        fetchTeachers();
    }, [fetchTeachers]);
    const handleAddTeacher = async (data) => {
        const { error: insertError } = await supabase.from('teachers').insert({
            name: data.name,
            email: data.email || null,
            phone: data.phone || null,
            office_hours: data.office_hours || null,
            notes: data.notes || null,
        });
        if (insertError) {
            setError('No se pudo crear el profesor');
        }
        else {
            setShowForm(false);
            fetchTeachers();
        }
    };
    const handleDelete = async (id) => {
        const { error: deleteError } = await supabase
            .from('teachers')
            .delete()
            .eq('id', id);
        if (deleteError) {
            setError('No se pudo eliminar el profesor');
        }
        else {
            setTeachers(teachers.filter((t) => t.id !== id));
        }
    };
    return (_jsxs("div", { className: "p-8", children: [_jsxs("div", { className: "flex justify-between items-center mb-8", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-3xl font-bold text-gray-800", children: "Profesores" }), _jsx("p", { className: "text-gray-600 mt-1", children: "Administra informaci\u00F3n de contacto y horarios" })] }), _jsxs("button", { onClick: () => setShowForm(true), className: "px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl font-semibold hover:from-amber-600 hover:to-orange-600 transition-all shadow-lg hover:shadow-xl flex items-center gap-2", children: [_jsx(Plus, { className: "w-5 h-5" }), "Nuevo Profesor"] })] }), error && (_jsx("div", { className: "mb-4 p-4 bg-red-50 border border-red-200 rounded-lg", children: _jsx("p", { className: "text-red-700 text-sm", children: error }) })), loading ? (_jsx("div", { className: "text-center py-12", children: _jsx("p", { className: "text-gray-500", children: "Cargando profesores..." }) })) : teachers.length === 0 ? (_jsx("div", { className: "max-w-4xl", children: _jsxs("div", { className: "bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center", children: [_jsx("div", { className: "inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-amber-100 to-orange-100 rounded-full mb-6", children: _jsx(Users, { className: "w-10 h-10 text-amber-600" }) }), _jsx("h2", { className: "text-2xl font-bold text-gray-800 mb-2", children: "Sin profesores a\u00FAn" }), _jsx("p", { className: "text-gray-600 max-w-md mx-auto", children: "A\u00F1ade a tus profesores para guardar su informaci\u00F3n de contacto y horarios de consulta." })] }) })) : (_jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl", children: teachers.map((teacher) => (_jsxs("div", { className: "bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow", children: [_jsxs("div", { className: "flex items-start justify-between mb-4", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx("div", { className: "w-10 h-10 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center", children: _jsx("span", { className: "text-white font-bold text-sm", children: teacher.name.charAt(0).toUpperCase() }) }), _jsx("h3", { className: "text-lg font-bold text-gray-800", children: teacher.name })] }), _jsx("button", { onClick: () => handleDelete(teacher.id), className: "p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors", title: "Eliminar profesor", children: _jsx(Trash2, { className: "w-4 h-4" }) })] }), _jsxs("div", { className: "space-y-2", children: [teacher.email && (_jsxs("a", { href: `mailto:${teacher.email}`, className: "flex items-center gap-2 text-sm text-gray-600 hover:text-amber-600 transition-colors", children: [_jsx(Mail, { className: "w-4 h-4 text-gray-400" }), _jsx("span", { className: "truncate", children: teacher.email })] })), teacher.phone && (_jsxs("div", { className: "flex items-center gap-2 text-sm text-gray-600", children: [_jsx(Phone, { className: "w-4 h-4 text-gray-400" }), _jsx("span", { children: teacher.phone })] })), teacher.office_hours && (_jsxs("div", { className: "flex items-center gap-2 text-sm text-gray-600", children: [_jsx(Clock, { className: "w-4 h-4 text-gray-400" }), _jsx("span", { children: teacher.office_hours })] })), teacher.notes && (_jsx("p", { className: "text-sm text-gray-500 mt-2 pt-2 border-t border-gray-100", children: teacher.notes }))] })] }, teacher.id))) })), showForm && (_jsx(TeacherForm, { onSubmit: handleAddTeacher, onCancel: () => setShowForm(false) }))] }));
};
