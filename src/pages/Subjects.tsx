import { useState, useEffect, useCallback } from 'react';
import { Plus, BookOpen, Trash2, User, Clock } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Subject, Teacher } from '../types';
import { SubjectForm } from '../components/SubjectForm';

export const Subjects = () => {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSubjects = useCallback(async () => {
    setLoading(true);
    setError(null);
    const { data, error: fetchError } = await supabase
      .from('subjects')
      .select('*')
      .order('created_at', { ascending: false });

    if (fetchError) {
      setError('No se pudieron cargar las materias');
    } else {
      setSubjects(data || []);
    }
    setLoading(false);
  }, []);

  const fetchTeachers = useCallback(async () => {
    const { data } = await supabase.from('teachers').select('*').order('name');
    if (data) setTeachers(data);
  }, []);

  useEffect(() => {
    fetchSubjects();
    fetchTeachers();
  }, [fetchSubjects, fetchTeachers]);

  const handleAddSubject = async (data: {
    name: string;
    teacher_id: string | null;
    schedule: string;
    notes: string;
  }) => {
    const { error: insertError } = await supabase.from('subjects').insert({
      name: data.name,
      teacher_id: data.teacher_id,
      schedule: data.schedule || null,
      notes: data.notes || null,
    });

    if (insertError) {
      setError('No se pudo crear la materia');
    } else {
      setShowForm(false);
      fetchSubjects();
    }
  };

  const handleDelete = async (id: string) => {
    const { error: deleteError } = await supabase
      .from('subjects')
      .delete()
      .eq('id', id);

    if (deleteError) {
      setError('No se pudo eliminar la materia');
    } else {
      setSubjects(subjects.filter((s) => s.id !== id));
    }
  };

  const getTeacherName = (teacherId: string | null) => {
    if (!teacherId) return null;
    return teachers.find((t) => t.id === teacherId)?.name || null;
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Materias</h1>
          <p className="text-gray-600 mt-1">Gestiona tus asignaturas y cursos</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl font-semibold hover:from-amber-600 hover:to-orange-600 transition-all shadow-lg hover:shadow-xl flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Nueva Materia
        </button>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      )}

      {loading ? (
        <div className="text-center py-12">
          <p className="text-gray-500">Cargando materias...</p>
        </div>
      ) : subjects.length === 0 ? (
        <div className="max-w-4xl">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-amber-100 to-orange-100 rounded-full mb-6">
              <BookOpen className="w-10 h-10 text-amber-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Sin materias aún</h2>
            <p className="text-gray-600 max-w-md mx-auto">
              Añade tu primera materia para organizar tus estudios y vincularlos con tus tareas.
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl">
          {subjects.map((subject) => {
            const teacherName = getTeacherName(subject.teacher_id);
            return (
              <div
                key={subject.id}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-orange-500 rounded-lg flex items-center justify-center">
                      <BookOpen className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-800">{subject.name}</h3>
                  </div>
                  <button
                    onClick={() => handleDelete(subject.id)}
                    className="p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors"
                    title="Eliminar materia"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-2">
                  {teacherName && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <User className="w-4 h-4 text-gray-400" />
                      <span>{teacherName}</span>
                    </div>
                  )}
                  {subject.schedule && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Clock className="w-4 h-4 text-gray-400" />
                      <span>{subject.schedule}</span>
                    </div>
                  )}
                  {subject.notes && (
                    <p className="text-sm text-gray-500 mt-2 pt-2 border-t border-gray-100">
                      {subject.notes}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {showForm && (
        <SubjectForm
          teachers={teachers}
          onSubmit={handleAddSubject}
          onCancel={() => setShowForm(false)}
        />
      )}
    </div>
  );
};
