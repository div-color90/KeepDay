import { useState, useEffect, useCallback } from 'react';
import { Plus, ChevronLeft, ChevronRight, Trash2, Calendar as CalendarIcon, CheckCircle2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { CalendarEvent, Subject, Task } from '../types';
import { EventForm } from '../components/EventForm';

const MONTH_NAMES = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
];

const DAY_NAMES = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];

const eventTypeStyles: Record<string, { dot: string; badge: string; label: string }> = {
  exam: { dot: 'bg-red-500', badge: 'bg-red-100 text-red-700', label: 'Examen' },
  assignment: { dot: 'bg-amber-500', badge: 'bg-amber-100 text-amber-700', label: 'Entrega' },
  class: { dot: 'bg-blue-500', badge: 'bg-blue-100 text-blue-700', label: 'Clase' },
  general: { dot: 'bg-gray-500', badge: 'bg-gray-100 text-gray-700', label: 'General' },
  task: { dot: 'bg-green-500', badge: 'bg-green-100 text-green-700', label: 'Tarea' },
};

interface DayItem {
  id: string;
  title: string;
  description: string | null;
  type: string;
  time: string | null;
  subjectName: string | null;
  isCompleted: boolean;
  kind: 'event' | 'task';
}

const getDaysInMonth = (year: number, month: number) => {
  return new Date(year, month + 1, 0).getDate();
};

const getFirstDayOfWeek = (year: number, month: number) => {
  const day = new Date(year, month, 1).getDay();
  return day === 0 ? 6 : day - 1;
};

const formatDate = (year: number, month: number, day: number) => {
  return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
};

export const Calendar = () => {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const today = new Date();
  const todayStr = formatDate(today.getFullYear(), today.getMonth(), today.getDate());

  const fetchAll = useCallback(async () => {
    setLoading(true);
    setError(null);

    const [eventsRes, tasksRes, subjectsRes] = await Promise.all([
      supabase.from('calendar_events').select('*').order('event_date', { ascending: true }),
      supabase.from('tasks').select('*').order('created_at', { ascending: false }),
      supabase.from('subjects').select('*').order('name'),
    ]);

    if (eventsRes.error || tasksRes.error) {
      setError('No se pudieron cargar los datos');
    } else {
      setEvents(eventsRes.data || []);
      setTasks(tasksRes.data || []);
      setSubjects(subjectsRes.data || []);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const handleAddEvent = async (data: {
    title: string;
    description: string;
    event_date: string;
    event_time: string;
    event_type: 'exam' | 'assignment' | 'class' | 'general';
    subject_id: string | null;
  }) => {
    const { error: insertError } = await supabase.from('calendar_events').insert({
      title: data.title,
      description: data.description || null,
      event_date: data.event_date,
      event_time: data.event_time || null,
      event_type: data.event_type,
      subject_id: data.subject_id,
    });

    if (insertError) {
      setError('No se pudo crear el evento');
    } else {
      setShowForm(false);
      fetchAll();
    }
  };

  const handleDeleteEvent = async (id: string) => {
    const { error: deleteError } = await supabase
      .from('calendar_events')
      .delete()
      .eq('id', id);

    if (deleteError) {
      setError('No se pudo eliminar el evento');
    } else {
      setEvents(events.filter((e) => e.id !== id));
    }
  };

  const handleToggleTask = async (id: string) => {
    const task = tasks.find((t) => t.id === id);
    if (!task) return;
    const newCompleted = !task.is_completed;
    const { error: updateError } = await supabase
      .from('tasks')
      .update({
        is_completed: newCompleted,
        completed_at: newCompleted ? new Date().toISOString() : null,
      })
      .eq('id', id);

    if (!updateError) {
      setTasks((prev) =>
        prev.map((t) =>
          t.id === id
            ? { ...t, is_completed: newCompleted, completed_at: newCompleted ? new Date().toISOString() : null }
            : t
        )
      );
    }
  };

  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
    setSelectedDate(null);
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
    setSelectedDate(null);
  };

  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfWeek(year, month);

  const calendarCells: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) {
    calendarCells.push(null);
  }
  for (let d = 1; d <= daysInMonth; d++) {
    calendarCells.push(d);
  }

  const getSubjectName = (subjectId: string | null) => {
    if (!subjectId) return null;
    return subjects.find((s) => s.id === subjectId)?.name || null;
  };

  const itemsByDate = (() => {
    const map: Record<string, DayItem[]> = {};

    events.forEach((event) => {
      if (!map[event.event_date]) map[event.event_date] = [];
      map[event.event_date].push({
        id: event.id,
        title: event.title,
        description: event.description,
        type: event.event_type,
        time: event.event_time,
        subjectName: getSubjectName(event.subject_id),
        isCompleted: false,
        kind: 'event',
      });
    });

    tasks.forEach((task) => {
      if (!task.due_date) return;
      if (!map[task.due_date]) map[task.due_date] = [];
      map[task.due_date].push({
        id: task.id,
        title: task.title,
        description: task.description,
        type: 'task',
        time: null,
        subjectName: getSubjectName(task.subject_id),
        isCompleted: task.is_completed,
        kind: 'task',
      });
    });

    return map;
  })();

  const selectedItems = selectedDate ? itemsByDate[selectedDate] || [] : [];

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Calendario</h1>
          <p className="text-gray-600 mt-1">Organiza tus eventos y plazos</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl font-semibold hover:from-amber-600 hover:to-orange-600 transition-all shadow-lg hover:shadow-xl flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Nuevo Evento
        </button>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      )}

      {loading ? (
        <div className="text-center py-12">
          <p className="text-gray-500">Cargando...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-6xl">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-800">
                  {MONTH_NAMES[month]} {year}
                </h2>
                <div className="flex gap-2">
                  <button
                    onClick={prevMonth}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <ChevronLeft className="w-5 h-5 text-gray-600" />
                  </button>
                  <button
                    onClick={nextMonth}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <ChevronRight className="w-5 h-5 text-gray-600" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-7 gap-1 mb-2">
                {DAY_NAMES.map((day) => (
                  <div
                    key={day}
                    className="text-center text-xs font-semibold text-gray-500 py-2"
                  >
                    {day}
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-7 gap-1">
                {calendarCells.map((day, idx) => {
                  if (day === null) {
                    return <div key={idx} className="h-24" />;
                  }

                  const dateStr = formatDate(year, month, day);
                  const dayItems = itemsByDate[dateStr] || [];
                  const isToday = dateStr === todayStr;
                  const isSelected = dateStr === selectedDate;

                  return (
                    <button
                      key={idx}
                      onClick={() => setSelectedDate(dateStr)}
                      className={`h-24 rounded-lg p-1.5 border transition-all text-left overflow-hidden ${
                        isSelected
                          ? 'border-amber-500 bg-amber-50'
                          : isToday
                          ? 'border-amber-300 bg-amber-50/50'
                          : 'border-gray-100 hover:border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      <div className={`text-sm font-medium mb-1 ${
                        isToday ? 'text-amber-700' : 'text-gray-700'
                      }`}>
                        {day}
                      </div>
                      <div className="space-y-0.5">
                        {dayItems.slice(0, 2).map((item) => (
                          <div
                            key={item.id}
                            className="flex items-center gap-1 text-xs text-gray-600 truncate"
                          >
                            <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${eventTypeStyles[item.type]?.dot || 'bg-gray-500'}`} />
                            <span className={`truncate ${item.isCompleted ? 'line-through text-gray-400' : ''}`}>{item.title}</span>
                          </div>
                        ))}
                        {dayItems.length > 2 && (
                          <div className="text-xs text-gray-400 font-medium">
                            +{dayItems.length - 2} más
                          </div>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-bold text-gray-800 mb-4">
                {selectedDate
                  ? new Date(selectedDate + 'T00:00:00').toLocaleDateString('es-ES', {
                      weekday: 'long',
                      day: 'numeric',
                      month: 'long',
                    })
                  : 'Selecciona un día'}
              </h2>

              {selectedItems.length === 0 ? (
                <div className="text-center py-8">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-gray-100 rounded-full mb-3">
                    <CalendarIcon className="w-6 h-6 text-gray-400" />
                  </div>
                  <p className="text-gray-500 text-sm">
                    {selectedDate ? 'No hay eventos ni tareas este día' : 'Haz clic en un día del calendario para ver sus eventos y tareas'}
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {selectedItems.map((item) => (
                    <div
                      key={item.id}
                      className="p-3 rounded-lg border border-gray-100 hover:border-gray-200 transition-colors"
                    >
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${eventTypeStyles[item.type]?.badge || 'bg-gray-100 text-gray-700'}`}>
                            {eventTypeStyles[item.type]?.label || 'General'}
                          </span>
                          {item.time && (
                            <span className="text-xs text-gray-500">{item.time}</span>
                          )}
                        </div>
                        {item.kind === 'event' ? (
                          <button
                            onClick={() => handleDeleteEvent(item.id)}
                            className="p-1 text-gray-400 hover:bg-red-50 hover:text-red-600 rounded transition-colors flex-shrink-0"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        ) : (
                          <button
                            onClick={() => handleToggleTask(item.id)}
                            className={`p-1 rounded transition-colors flex-shrink-0 ${
                              item.isCompleted
                                ? 'text-green-600 hover:bg-green-50'
                                : 'text-gray-400 hover:bg-gray-100'
                            }`}
                            title={item.isCompleted ? 'Marcar como pendiente' : 'Marcar como completada'}
                          >
                            <CheckCircle2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                      <h3 className={`font-semibold text-gray-800 text-sm ${item.isCompleted ? 'line-through text-gray-400' : ''}`}>
                        {item.title}
                      </h3>
                      {item.subjectName && (
                        <p className="text-xs text-amber-600 mt-0.5">{item.subjectName}</p>
                      )}
                      {item.description && (
                        <p className="text-xs text-gray-500 mt-1">{item.description}</p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {showForm && (
        <EventForm
          subjects={subjects}
          onSubmit={handleAddEvent}
          onCancel={() => setShowForm(false)}
        />
      )}
    </div>
  );
};
