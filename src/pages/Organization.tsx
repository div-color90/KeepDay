import { useCallback, useEffect, useMemo, useState } from 'react';
import { CalendarDays, ChevronLeft, ChevronRight, Clock3, Coffee, Edit3, Plus, Play, Trash2, TrendingUp, X, Pause } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { BlockType, OrgBlock, OrgPeriod, Subject, Task } from '../types';
import { OrganizationBlockForm } from '../components/OrganizationBlockForm';
import { OrganizationPeriodForm } from '../components/OrganizationPeriodForm';

interface OrganizationProps {
  onStartPomodoro: () => void;
  focusMinutes: number;
  breakMinutes: number;
  pomodoroState: {
    timeLeft: number;
    isActive: boolean;
    isPaused: boolean;
    isFocusMode: boolean;
    formatTime: (s: number) => string;
    start: () => void;
    pause: () => void;
    resume: () => void;
    reset: () => void;
    skip: () => void;
  };
}

type ViewMode = 'week' | 'day';

const typeLabels: Record<BlockType, string> = {
  study: 'Estudio', work: 'Trabajo', task: 'Tareas', tutoring: 'Clase',
  review: 'Repaso', break: 'Descanso', meal: 'Comida', commute: 'Desplazamiento',
  personal: 'Personal', sleep: 'Dormir',
};
const typeColors: Record<BlockType, string> = {
  study: 'bg-amber-100 border-amber-300 text-amber-900',
  work: 'bg-blue-100 border-blue-300 text-blue-900',
  task: 'bg-green-100 border-green-300 text-green-900',
  tutoring: 'bg-orange-100 border-orange-300 text-orange-900',
  review: 'bg-yellow-100 border-yellow-300 text-yellow-900',
  break: 'bg-slate-100 border-slate-300 text-slate-800',
  meal: 'bg-lime-100 border-lime-300 text-lime-900',
  commute: 'bg-cyan-100 border-cyan-300 text-cyan-900',
  personal: 'bg-pink-100 border-pink-300 text-pink-900',
  sleep: 'bg-gray-200 border-gray-400 text-gray-800',
};
const dayNames = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
const toDate = (date: Date) => date.toISOString().slice(0, 10);
const dateFromString = (value: string) => new Date(`${value}T00:00:00`);
const minutes = (value: string) => {
  const [h, m] = value.slice(0, 5).split(':').map(Number);
  return h * 60 + m;
};
const duration = (block: OrgBlock) => Math.max(0, minutes(block.end_time) - minutes(block.start_time));
const sourceBlockId = (id: string) => id.length > 36 && id[36] === '-' ? id.slice(0, 36) : id;
const mondayOf = (date: Date) => {
  const copy = new Date(date);
  const day = copy.getDay() || 7;
  copy.setDate(copy.getDate() - day + 1);
  return copy;
};
const isRecurringOn = (block: OrgBlock, date: Date) => {
  const base = dateFromString(block.block_date);
  const dow = date.getDay();
  const dayMatch = base.getDay() === dow;
  if (block.recurrence === 'daily') return date >= base;
  if (block.recurrence === 'weekdays') return date >= base && dow >= 1 && dow <= 5;
  if (block.recurrence === 'tue-fri') return date >= base && dow >= 2 && dow <= 5;
  if (block.recurrence === 'weekends') return date >= base && (dow === 0 || dow === 6);
  if (block.recurrence === 'weekly') return date >= base && dayMatch;
  return toDate(date) === block.block_date;
};

export const Organization = ({ onStartPomodoro, focusMinutes, breakMinutes, pomodoroState }: OrganizationProps) => {
  const [periods, setPeriods] = useState<OrgPeriod[]>([]);
  const [periodIndex, setPeriodIndex] = useState(0);
  const [blocks, setBlocks] = useState<OrgBlock[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [view, setView] = useState<ViewMode>('week');
  const [weekStart, setWeekStart] = useState(mondayOf(new Date()));
  const [selectedDate, setSelectedDate] = useState(toDate(new Date()));
  const [showBlockForm, setShowBlockForm] = useState(false);
  const [editingBlock, setEditingBlock] = useState<OrgBlock | null>(null);
  const [showPeriodForm, setShowPeriodForm] = useState(false);
  const [focusBlock, setFocusBlock] = useState<OrgBlock | null>(null);
  const [error, setError] = useState<string | null>(null);

  const period = periods[periodIndex] || null;

  const loadData = useCallback(async () => {
    const [periodsRes, blocksRes, subjectsRes, tasksRes] = await Promise.all([
      supabase.from('org_periods').select('*').order('start_date', { ascending: false }),
      supabase.from('org_blocks').select('*').order('block_date').order('start_time'),
      supabase.from('subjects').select('*').order('name'),
      supabase.from('tasks').select('*').order('created_at', { ascending: false }),
    ]);
    if (periodsRes.error || blocksRes.error) {
      setError('No se pudo cargar la organización');
      return;
    }
    const loadedPeriods = periodsRes.data || [];
    const activeIdx = loadedPeriods.findIndex((p) => p.is_active);
    setPeriods(loadedPeriods);
    setPeriodIndex(activeIdx >= 0 ? activeIdx : 0);
    setBlocks(blocksRes.data || []);
    setSubjects(subjectsRes.data || []);
    setTasks(tasksRes.data || []);
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  const visibleBlocks = useMemo(() => {
    if (!period) return [];
    const result: OrgBlock[] = [];
    const current = dateFromString(period.start_date);
    const end = dateFromString(period.end_date);
    blocks.forEach((block) => {
      const day = dateFromString(block.block_date);
      if (block.recurrence === 'none' || !block.recurrence) {
        if (day >= current && day <= end) result.push(block);
        return;
      }
      for (const cursor = new Date(current); cursor <= end; cursor.setDate(cursor.getDate() + 1)) {
        if (isRecurringOn(block, cursor)) {
          result.push({ ...block, id: `${block.id}-${toDate(cursor)}`, block_date: toDate(cursor) });
        }
      }
    });
    return result;
  }, [blocks, period]);

  const weekDates = useMemo(
    () => Array.from({ length: 7 }, (_, i) => {
      const d = new Date(weekStart);
      d.setDate(d.getDate() + i);
      return d;
    }),
    [weekStart]
  );

  const dayBlocks = visibleBlocks
    .filter((b) => b.block_date === selectedDate)
    .sort((a, b) => minutes(a.start_time) - minutes(b.start_time));

  const weekBlocks = (date: Date) =>
    visibleBlocks.filter((b) => b.block_date === toDate(date)).sort((a, b) => minutes(a.start_time) - minutes(b.start_time));

  const subjectName = (id: string | null) => subjects.find((s) => s.id === id)?.name;
  const taskName = (id: string | null) => tasks.find((t) => t.id === id)?.title;

  const totals = useMemo(() => {
    const relevant = visibleBlocks.filter(
      (b) => b.block_date >= toDate(weekStart) && b.block_date <= toDate(weekDates[6])
    );
    const study = relevant.filter((b) => b.block_type === 'study' || b.block_type === 'review').reduce((s, b) => s + duration(b), 0);
    const work = relevant.filter((b) => b.block_type === 'work').reduce((s, b) => s + duration(b), 0);
    const occupied = relevant.reduce((s, b) => s + duration(b), 0);
    const pomodoros = relevant.reduce((s, b) => s + b.pomodoros_estimated, 0);
    return { study, work, free: Math.max(0, 24 * 60 * 7 - occupied), pomodoros };
  }, [visibleBlocks, weekDates, weekStart]);

  const dailyLoad = (date: string) =>
    visibleBlocks.filter((b) => b.block_date === date).reduce((s, b) => s + duration(b), 0);

  const loadLabel = (value: number) =>
    value >= 660
      ? { label: 'Carga muy alta', color: 'text-red-600', dot: 'bg-red-500' }
      : value >= 480
        ? { label: 'Carga alta', color: 'text-orange-600', dot: 'bg-orange-500' }
        : { label: 'Carga normal', color: 'text-green-600', dot: 'bg-green-500' };

  // Next activity today: first block today whose start time hasn't passed
  const nowMinutes = (() => {
    const now = new Date();
    return now.getHours() * 60 + now.getMinutes();
  })();

  const nextActivityToday = useMemo(() => {
    const today = toDate(new Date());
    const todayBlocks = visibleBlocks
      .filter((b) => b.block_date === today)
      .sort((a, b) => minutes(a.start_time) - minutes(b.start_time));
    return todayBlocks.find((b) => minutes(b.start_time) > nowMinutes) || null;
  }, [visibleBlocks, nowMinutes]);

  const saveBlock = async (data: {
    name: string; block_date: string; start_time: string; end_time: string;
    block_type: BlockType; subject_id: string | null; task_id: string | null;
    recurrence: string; notes: string; pomodoros_estimated: number;
  }) => {
    const payload = { ...data, recurrence: data.recurrence || 'none' };
    const query = editingBlock
      ? supabase.from('org_blocks').update(payload).eq('id', sourceBlockId(editingBlock.id))
      : supabase.from('org_blocks').insert(payload);
    const { error: saveError } = await query;
    if (saveError) setError('No se pudo guardar el bloque');
    else { setShowBlockForm(false); setEditingBlock(null); loadData(); }
  };

  const deleteBlock = async (block: OrgBlock) => {
    const { error: deleteError } = await supabase.from('org_blocks').delete().eq('id', sourceBlockId(block.id));
    if (deleteError) setError('No se pudo eliminar el bloque');
    else loadData();
  };

  const savePeriod = async (data: { name: string; start_date: string; end_date: string }) => {
    const { error: saveError } = await supabase.from('org_periods').insert({ ...data, is_active: true });
    if (saveError) setError('No se pudo crear el periodo');
    else { setShowPeriodForm(false); loadData(); }
  };

  const deletePeriod = async (id: string) => {
    const { error: deleteError } = await supabase.from('org_periods').delete().eq('id', id);
    if (deleteError) setError('No se pudo eliminar el periodo');
    else loadData();
  };

  const moveWeek = (amount: number) => {
    const next = new Date(weekStart);
    next.setDate(next.getDate() + amount * 7);
    setWeekStart(next);
  };



  const startFocusForBlock = (block: OrgBlock) => {
    setFocusBlock(block);
    onStartPomodoro();
  };

  const closeFocus = () => {
    setFocusBlock(null);
    pomodoroState.reset();
  };

  const defaultBlockDate = (() => {
    if (!period) return toDate(new Date());
    const today = toDate(new Date());
    if (today >= period.start_date && today <= period.end_date) return today;
    return period.start_date;
  })();

  const openNewBlock = (date = defaultBlockDate) => {
    setSelectedDate(date);
    setEditingBlock(null);
    setShowBlockForm(true);
  };

  // --- No period state ---
  if (!period) {
    return (
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Organización</h1>
          <p className="mt-1 text-gray-600">Planifica tu tiempo, bloques de estudio y descanso.</p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-12 text-center">
          <CalendarDays className="mx-auto mb-4 h-12 w-12 text-amber-500" />
          <h2 className="mb-2 text-xl font-bold text-gray-800">Crea tu primer periodo</h2>
          <button onClick={() => setShowPeriodForm(true)} className="rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 px-5 py-3 font-semibold text-white">
            Nuevo periodo
          </button>
        </div>
        {showPeriodForm && <OrganizationPeriodForm onSubmit={savePeriod} onCancel={() => setShowPeriodForm(false)} />}
      </div>
    );
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-6 flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Organización</h1>
          <p className="mt-1 text-gray-600">Planifica tu tiempo, bloques de estudio y descanso.</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setShowPeriodForm(true)} className="rounded-lg border border-gray-300 bg-white px-4 py-2 font-medium text-gray-700 hover:bg-gray-50">
            Crear periodo
          </button>
          <button onClick={() => openNewBlock()} className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 px-4 py-2 font-semibold text-white">
            <Plus className="h-4 w-4" />Añadir bloque
          </button>
        </div>
      </div>

      {error && <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div>}

      {/* Period carousel */}
      <div className="mb-6 rounded-xl border border-amber-200 bg-gradient-to-r from-amber-50 to-orange-50 p-5">
        <div className="flex flex-col justify-between gap-3 md:flex-row md:items-center">
          <div className="flex items-center gap-3">
            {periods.length > 1 && (
              <button
                onClick={() => setPeriodIndex((i) => (i - 1 + periods.length) % periods.length)}
                className="rounded-lg bg-white/80 p-2 hover:bg-white"
              >
                <ChevronLeft className="h-5 w-5 text-gray-600" />
              </button>
            )}
            <div>
              <p className="text-sm font-medium text-amber-700">
                Periodo actual {periods.length > 1 && `(${periodIndex + 1}/${periods.length})`}
              </p>
              <h2 className="text-xl font-bold text-gray-800">{period.name}</h2>
              <p className="text-sm text-gray-600">
                {dateFromString(period.start_date).toLocaleDateString('es-ES')} – {dateFromString(period.end_date).toLocaleDateString('es-ES')}
              </p>
            </div>
            {periods.length > 1 && (
              <button
                onClick={() => setPeriodIndex((i) => (i + 1) % periods.length)}
                className="rounded-lg bg-white/80 p-2 hover:bg-white"
              >
                <ChevronRight className="h-5 w-5 text-gray-600" />
              </button>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => deletePeriod(period.id)}
              className="flex items-center gap-1 rounded-lg bg-white/80 px-3 py-2 text-sm font-medium text-red-600 hover:bg-white"
            >
              <Trash2 className="h-4 w-4" />Eliminar periodo
            </button>
            <div className="flex items-center gap-2 rounded-lg bg-white/80 p-1">
              <button onClick={() => setView('week')} className={`rounded-md px-3 py-2 text-sm font-semibold ${view === 'week' ? 'bg-amber-500 text-white' : 'text-gray-600'}`}>Semana</button>
              <button onClick={() => setView('day')} className={`rounded-md px-3 py-2 text-sm font-semibold ${view === 'day' ? 'bg-amber-500 text-white' : 'text-gray-600'}`}>Hoy</button>
            </div>
          </div>
        </div>
      </div>

      {/* Summary stats */}
      <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Stat icon={<Clock3 />} label="Estudio" value={`${Math.floor(totals.study / 60)}h ${totals.study % 60}m`} color="text-amber-600" />
        <Stat icon={<TrendingUp />} label="Trabajo" value={`${Math.floor(totals.work / 60)}h ${totals.work % 60}m`} color="text-blue-600" />
        <Stat icon={<Coffee />} label="Tiempo libre" value={`${Math.floor(totals.free / 60)}h`} color="text-green-600" />
        <Stat icon={<span className="text-lg font-bold">P</span>} label="Pomodoros" value={`${totals.pomodoros} planificados`} color="text-orange-600" />
      </div>

      {view === 'week' ? (
        /* Weekly view */
        <div className="rounded-xl border border-gray-200 bg-white p-4">
          <div className="mb-4 flex items-center justify-between">
            <button onClick={() => moveWeek(-1)} className="rounded-lg p-2 hover:bg-gray-100"><ChevronLeft className="h-5 w-5" /></button>
            <h2 className="font-bold text-gray-800">
              {weekDates[0].toLocaleDateString('es-ES', { day: 'numeric', month: 'long' })} – {weekDates[6].toLocaleDateString('es-ES', { day: 'numeric', month: 'long' })}
            </h2>
            <button onClick={() => moveWeek(1)} className="rounded-lg p-2 hover:bg-gray-100"><ChevronRight className="h-5 w-5" /></button>
          </div>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-7">
            {weekDates.map((date, i) => {
              const items = weekBlocks(date);
              const load = loadLabel(dailyLoad(toDate(date)));
              return (
                <div
                  key={toDate(date)}
                  onClick={() => { setSelectedDate(toDate(date)); setView('day'); }}
                  className="min-h-48 cursor-pointer rounded-lg border border-gray-200 bg-gray-50 p-3 hover:border-amber-300"
                >
                  <div className="mb-2 flex items-center justify-between">
                    <div>
                      <p className="text-xs font-semibold uppercase text-gray-500">{dayNames[i]}</p>
                      <p className="font-bold text-gray-800">{date.getDate()}</p>
                    </div>
                    <span className={`h-2.5 w-2.5 rounded-full ${load.dot}`} title={load.label} />
                  </div>
                  <div className="space-y-2">
                    {items.slice(0, 5).map((block) => (
                      <div key={block.id} className={`rounded-md border p-2 text-xs ${typeColors[block.block_type]}`}>
                        <p className="font-bold">{block.start_time.slice(0, 5)}–{block.end_time.slice(0, 5)}</p>
                        <p className="truncate">{block.name}</p>
                      </div>
                    ))}
                    {items.length > 5 && <p className="text-xs text-gray-500">+{items.length - 5} más</p>}
                  </div>
                  <p className={`mt-3 text-xs font-medium ${load.color}`}>{load.label}</p>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* Daily view */
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <div className="rounded-xl border border-gray-200 bg-white p-5">
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Vista de hoy</p>
                  <h2 className="text-xl font-bold text-gray-800">
                    {dateFromString(selectedDate).toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })}
                  </h2>
                </div>
                <button onClick={() => openNewBlock()} className="rounded-lg bg-amber-100 p-2 text-amber-700 hover:bg-amber-200">
                  <Plus className="h-5 w-5" />
                </button>
              </div>
              {dayBlocks.length === 0 ? (
                <p className="py-12 text-center text-gray-500">No hay bloques planificados para este día.</p>
              ) : (
                <div className="space-y-3">
                  {dayBlocks.map((block) => (
                    <BlockRow
                      key={block.id}
                      block={block}
                      subjectName={subjectName(block.subject_id)}
                      taskName={taskName(block.task_id)}
                      onEdit={() => {
                        const srcId = sourceBlockId(block.id);
                        const original = blocks.find((b) => b.id === srcId);
                        setEditingBlock(original || block);
                        setShowBlockForm(true);
                      }}
                      onDelete={() => deleteBlock(block)}
                      onStartPomodoro={() => startFocusForBlock(block)}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="space-y-4">
            {/* Daily load */}
            <div className="rounded-xl border border-gray-200 bg-white p-5">
              <h3 className="mb-4 font-bold text-gray-800">Carga diaria</h3>
              <p className="text-3xl font-bold text-gray-800">
                {Math.floor(dailyLoad(selectedDate) / 60)}h {dailyLoad(selectedDate) % 60}m
              </p>
              <p className={`mt-1 text-sm font-semibold ${loadLabel(dailyLoad(selectedDate)).color}`}>
                {loadLabel(dailyLoad(selectedDate)).label}
              </p>
              {dailyLoad(selectedDate) >= 660 && (
                <p className="mt-4 rounded-lg bg-orange-50 p-3 text-sm text-orange-800">
                  Hoy tienes {Math.round(dailyLoad(selectedDate) / 60)} horas de actividades planificadas. Se recomienda dejar tiempo de descanso.
                </p>
              )}
              <div className="mt-5 space-y-2 text-sm text-gray-600">
                <p>Ocupado: {Math.floor(dailyLoad(selectedDate) / 60)}h {dailyLoad(selectedDate) % 60}m</p>
                <p>Pomodoros: {dayBlocks.reduce((s, b) => s + b.pomodoros_estimated, 0)} planificados</p>
                <p>Completados: {dayBlocks.reduce((s, b) => s + b.pomodoros_completed, 0)}</p>
              </div>
            </div>

            {/* Next activity today */}
            <div className="rounded-xl border border-amber-200 bg-amber-50 p-5">
              <h3 className="mb-3 font-bold text-gray-800">Siguiente actividad de hoy</h3>
              {nextActivityToday ? (
                <div>
                  <div className={`mb-2 inline-block rounded-md border px-3 py-1 text-xs font-bold ${typeColors[nextActivityToday.block_type]}`}>
                    {typeLabels[nextActivityToday.block_type]}
                  </div>
                  <p className="text-lg font-bold text-gray-800">{nextActivityToday.name}</p>
                  <p className="text-sm text-gray-600">
                    {nextActivityToday.start_time.slice(0, 5)}–{nextActivityToday.end_time.slice(0, 5)}
                  </p>
                  {nextActivityToday.pomodoros_estimated > 0 && (
                    <p className="mt-1 text-xs text-amber-700 font-medium">
                      {nextActivityToday.pomodoros_estimated} Pomodoros estimados
                    </p>
                  )}
                </div>
              ) : (
                <p className="text-sm text-gray-500">No quedan actividades pendientes para hoy.</p>
              )}
            </div>

            {/* Upcoming activities */}
            <div className="rounded-xl border border-gray-200 bg-white p-5">
              <h3 className="mb-3 font-bold text-gray-800">Próximas actividades</h3>
              {visibleBlocks
                .filter((b) => b.block_date >= toDate(new Date()))
                .slice(0, 5)
                .map((block) => (
                  <p key={block.id} className="border-b border-gray-100 py-2 text-sm text-gray-600">
                    <span className="font-semibold text-gray-800">{block.name}</span>
                    <br />
                    {dateFromString(block.block_date).toLocaleDateString('es-ES')} · {block.start_time.slice(0, 5)}
                  </p>
                ))}
            </div>
          </div>
        </div>
      )}

      {/* Focus mode mini-window */}
      {focusBlock && (
        <div className="fixed bottom-6 right-6 z-50 w-80 rounded-2xl border border-amber-300 bg-white shadow-2xl">
          <div className="flex items-center justify-between border-b border-amber-200 bg-gradient-to-r from-amber-50 to-orange-50 px-5 py-3">
            <div>
              <p className="text-xs font-semibold uppercase text-amber-700">Modo Enfoque</p>
              <p className="text-sm font-bold text-gray-800 truncate max-w-48">{focusBlock.name}</p>
            </div>
            <button
              onClick={closeFocus}
              className="rounded-lg p-1.5 hover:bg-white"
            >
              <X className="h-4 w-4 text-gray-500" />
            </button>
          </div>
          <div className="px-5 py-6 text-center">
            <p className="text-5xl font-bold text-gray-800">{pomodoroState.formatTime(pomodoroState.timeLeft)}</p>
            <p className="mt-2 text-sm font-medium text-amber-600">
              {pomodoroState.isFocusMode ? 'Concéntrate en tu tarea actual' : 'Descanso'}
            </p>
            <div className="mt-4 flex justify-center gap-2">
              {!pomodoroState.isActive ? (
                <button onClick={pomodoroState.start} className="rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 px-4 py-2 text-sm font-semibold text-white">
                  Iniciar
                </button>
              ) : pomodoroState.isPaused ? (
                <button onClick={pomodoroState.resume} className="rounded-lg bg-amber-500 px-4 py-2 text-sm font-semibold text-white">
                  Continuar
                </button>
              ) : (
                <button onClick={pomodoroState.pause} className="rounded-lg bg-gray-200 px-4 py-2 text-sm font-semibold text-gray-700">
                  <Pause className="inline h-4 w-4" /> Pausar
                </button>
              )}
              <button onClick={pomodoroState.skip} className="rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-600">
                Saltar
              </button>
            </div>
          </div>
        </div>
      )}

      {showBlockForm && (
        <OrganizationBlockForm
          block={editingBlock}
          selectedDate={selectedDate}
          subjects={subjects}
          tasks={tasks}
          focusMinutes={focusMinutes}
          breakMinutes={breakMinutes}
          onSubmit={saveBlock}
          onCancel={() => { setShowBlockForm(false); setEditingBlock(null); }}
        />
      )}
      {showPeriodForm && (
        <OrganizationPeriodForm onSubmit={savePeriod} onCancel={() => setShowPeriodForm(false)} />
      )}
    </div>
  );
};

const Stat = ({ icon, label, value, color }: { icon: React.ReactNode; label: string; value: string; color: string }) => (
  <div className="rounded-xl border border-gray-200 bg-white p-4">
    <div className={`mb-2 flex items-center gap-2 ${color}`}>
      {icon}
      <span className="text-sm font-medium text-gray-600">{label}</span>
    </div>
    <p className="text-xl font-bold text-gray-800">{value}</p>
  </div>
);

const BlockRow = ({
  block, subjectName, taskName, onEdit, onDelete, onStartPomodoro,
}: {
  block: OrgBlock;
  subjectName?: string;
  taskName?: string;
  onEdit: () => void;
  onDelete: () => void;
  onStartPomodoro: () => void;
}) => (
  <div className={`flex flex-col gap-3 rounded-lg border-l-4 p-4 sm:flex-row sm:items-center sm:justify-between ${typeColors[block.block_type]}`}>
    <div className="flex items-start gap-3">
      <div className="min-w-28 text-sm font-bold">{block.start_time.slice(0, 5)}–{block.end_time.slice(0, 5)}</div>
      <div>
        <p className="font-bold">{block.name}</p>
        <p className="text-xs opacity-80">
          {typeLabels[block.block_type]}{subjectName ? ` · ${subjectName}` : ''}{taskName ? ` · ${taskName}` : ''} · {duration(block)} min · {block.pomodoros_estimated} Pomodoros
        </p>
      </div>
    </div>
    <div className="flex gap-1">
      <button onClick={onStartPomodoro} className="flex items-center gap-1 rounded-md bg-white/70 px-2 py-1 text-xs font-semibold hover:bg-white">
        <Play className="h-3 w-3" />Iniciar Pomodoro
      </button>
      <button onClick={onEdit} className="rounded-md bg-white/70 p-2 hover:bg-white">
        <Edit3 className="h-4 w-4" />
      </button>
      <button onClick={onDelete} className="rounded-md bg-white/70 p-2 text-red-600 hover:bg-white">
        <Trash2 className="h-4 w-4" />
      </button>
    </div>
  </div>
);
