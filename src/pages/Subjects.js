import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect, useCallback } from 'react';
import { Plus, BookOpen, Trash2, User, Clock } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { SubjectForm } from '../components/SubjectForm';
export const Subjects = () => {
    const [subjects, setSubjects] = useState([]);
    const [teachers, setTeachers] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const fetchSubjects = useCallback(async () => {
        setLoading(true);
        setError(null);
        const { data, error: fetchError } = await supabase
            .from('subjects')
            .select('*')
            .order('created_at', { ascending: false });
        if (fetchError) {
            setError('No se pudieron cargar las materias');
        }
        else {
            setSubjects(data || []);
        }
        setLoading(false);
    }, []);
    const fetchTeachers = useCallback(async () => {
        const { data } = await supabase.from('teachers').select('*').order('name');
        if (data)
            setTeachers(data);
    }, []);
    useEffect(() => {
        fetchSubjects();
        fetchTeachers();
    }, [fetchSubjects, fetchTeachers]);
    const handleAddSubject = async (data) => {
        const { error: insertError } = await supabase.from('subjects').insert({
            name: data.name,
            teacher_id: data.teacher_id,
            schedule: data.schedule || null,
            notes: data.notes || null,
        });
        if (insertError) {
            setError('No se pudo crear la materia');
        }
        else {
            setShowForm(false);
            fetchSubjects();
        }
    };
    const handleDelete = async (id) => {
        const { error: deleteError } = await supabase
            .from('subjects')
            .delete()
            .eq('id', id);
        if (deleteError) {
            setError('No se pudo eliminar la materia');
        }
        else {
            setSubjects(subjects.filter((s) => s.id !== id));
        }
    };
    const getTeacherName = (teacherId) => {
        if (!teacherId)
            return null;
        return teachers.find((t) => t.id === teacherId)?.name || null;
    };
    return (_jsxs("div", { className: "p-8", children: [_jsxs("div", { className: "flex justify-between items-center mb-8", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-3xl font-bold text-gray-800", children: "Materias" }), _jsx("p", { className: "text-gray-600 mt-1", children: "Gestiona tus asignaturas y cursos" })] }), _jsxs("button", { onClick: () => setShowForm(true), className: "px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl font-semibold hover:from-amber-600 hover:to-orange-600 transition-all shadow-lg hover:shadow-xl flex items-center gap-2", children: [_jsx(Plus, { className: "w-5 h-5" }), "Nueva Materia"] })] }), error && (_jsx("div", { className: "mb-4 p-4 bg-red-50 border border-red-200 rounded-lg", children: _jsx("p", { className: "text-red-700 text-sm", children: error }) })), loading ? (_jsx("div", { className: "text-center py-12", children: _jsx("p", { className: "text-gray-500", children: "Cargando materias..." }) })) : subjects.length === 0 ? (_jsx("div", { className: "max-w-4xl", children: _jsxs("div", { className: "bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center", children: [_jsx("div", { className: "inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-amber-100 to-orange-100 rounded-full mb-6", children: _jsx(BookOpen, { className: "w-10 h-10 text-amber-600" }) }), _jsx("h2", { className: "text-2xl font-bold text-gray-800 mb-2", children: "Sin materias a\u00FAn" }), _jsx("p", { className: "text-gray-600 max-w-md mx-auto", children: "A\u00F1ade tu primera materia para organizar tus estudios y vincularlos con tus tareas." })] }) })) : (_jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl", children: subjects.map((subject) => {
                    const teacherName = getTeacherName(subject.teacher_id);
                    return (_jsxs("div", { className: "bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow", children: [_jsxs("div", { className: "flex items-start justify-between mb-4", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx("div", { className: "w-10 h-10 bg-gradient-to-br from-amber-400 to-orange-500 rounded-lg flex items-center justify-center", children: _jsx(BookOpen, { className: "w-5 h-5 text-white" }) }), _jsx("h3", { className: "text-lg font-bold text-gray-800", children: subject.name })] }), _jsx("button", { onClick: () => handleDelete(subject.id), className: "p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors", title: "Eliminar materia", children: _jsx(Trash2, { className: "w-4 h-4" }) })] }), _jsxs("div", { className: "space-y-2", children: [teacherName && (_jsxs("div", { className: "flex items-center gap-2 text-sm text-gray-600", children: [_jsx(User, { className: "w-4 h-4 text-gray-400" }), _jsx("span", { children: teacherName })] })), subject.schedule && (_jsxs("div", { className: "flex items-center gap-2 text-sm text-gray-600", children: [_jsx(Clock, { className: "w-4 h-4 text-gray-400" }), _jsx("span", { children: subject.schedule })] })), subject.notes && (_jsx("p", { className: "text-sm text-gray-500 mt-2 pt-2 border-t border-gray-100", children: subject.notes }))] })] }, subject.id));
                }) })), showForm && (_jsx(SubjectForm, { teachers: teachers, onSubmit: handleAddSubject, onCancel: () => setShowForm(false) }))] }));
};
