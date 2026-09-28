import { useState, useEffect, useCallback } from 'react';
import { Plus, Users, Trash2, Mail, Phone, Clock } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Teacher } from '../types';
import { TeacherForm } from '../components/TeacherForm';

export const Teachers = () => {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTeachers = useCallback(async () => {
    setLoading(true);
    setError(null);
    const { data, error: fetchError } = await supabase
      .from('teachers')
      .select('*')
      .order('created_at', { ascending: false });

    if (fetchError) {
      setError('No se pudieron cargar los profesores');
    } else {
      setTeachers(data || []);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchTeachers();
  }, [fetchTeachers]);

  const handleAddTeacher = async (data: {
    name: string;
    email: string;
    phone: string;
    office_hours: string;
    notes: string;
  }) => {
    const { error: insertError } = await supabase.from('teachers').insert({
      name: data.name,
      email: data.email || null,
      phone: data.phone || null,
      office_hours: data.office_hours || null,
      notes: data.notes || null,
    });

    if (insertError) {
      setError('No se pudo crear el profesor');
    } else {
      setShowForm(false);
      fetchTeachers();
    }
  };

  const handleDelete = async (id: string) => {
    const { error: deleteError } = await supabase
      .from('teachers')
      .delete()
      .eq('id', id);

    if (deleteError) {
      setError('No se pudo eliminar el profesor');
    } else {
      setTeachers(teachers.filter((t) => t.id !== id));
    }
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Profesores</h1>
          <p className="text-gray-600 mt-1">Administra información de contacto y horarios</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl font-semibold hover:from-amber-600 hover:to-orange-600 transition-all shadow-lg hover:shadow-xl flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Nuevo Profesor
        </button>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      )}

      {loading ? (
        <div className="text-center py-12">
          <p className="text-gray-500">Cargando profesores...</p>
        </div>
      ) : teachers.length === 0 ? (
        <div className="max-w-4xl">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-amber-100 to-orange-100 rounded-full mb-6">
              <Users className="w-10 h-10 text-amber-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Sin profesores aún</h2>
            <p className="text-gray-600 max-w-md mx-auto">
              Añade a tus profesores para guardar su información de contacto y horarios de consulta.
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl">
          {teachers.map((teacher) => (
            <div
              key={teacher.id}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-sm">
                      {teacher.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-gray-800">{teacher.name}</h3>
                </div>
                <button
                  onClick={() => handleDelete(teacher.id)}
                  className="p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors"
                  title="Eliminar profesor"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-2">
                {teacher.email && (
                  <a
                    href={`mailto:${teacher.email}`}
                    className="flex items-center gap-2 text-sm text-gray-600 hover:text-amber-600 transition-colors"
                  >
                    <Mail className="w-4 h-4 text-gray-400" />
                    <span className="truncate">{teacher.email}</span>
                  </a>
                )}
                {teacher.phone && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Phone className="w-4 h-4 text-gray-400" />
                    <span>{teacher.phone}</span>
                  </div>
                )}
                {teacher.office_hours && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Clock className="w-4 h-4 text-gray-400" />
                    <span>{teacher.office_hours}</span>
                  </div>
                )}
                {teacher.notes && (
                  <p className="text-sm text-gray-500 mt-2 pt-2 border-t border-gray-100">
                    {teacher.notes}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {showForm && (
        <TeacherForm
          onSubmit={handleAddTeacher}
          onCancel={() => setShowForm(false)}
        />
      )}
    </div>
  );
};
