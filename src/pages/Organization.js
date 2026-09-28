import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useCallback, useEffect, useMemo, useState } from 'react';
import { CalendarDays, ChevronLeft, ChevronRight, Clock3, Coffee, Edit3, Plus, Play, Trash2, TrendingUp, X, Pause } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { OrganizationBlockForm } from '../components/OrganizationBlockForm';
import { OrganizationPeriodForm } from '../components/OrganizationPeriodForm';
const typeLabels = {
    study: 'Estudio', work: 'Trabajo', task: 'Tareas', tutoring: 'Clase',
    review: 'Repaso', break: 'Descanso', meal: 'Comida', commute: 'Desplazamiento',
    personal: 'Personal', sleep: 'Dormir',
};
const typeColors = {
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
const toDate = (date) => date.toISOString().slice(0, 10);
const dateFromString = (value) => new Date(`${value}T00:00:00`);
const minutes = (value) => {
    const [h, m] = value.slice(0, 5).split(':').map(Number);
    return h * 60 + m;
};
const duration = (block) => Math.max(0, minutes(block.end_time) - minutes(block.start_time));
const sourceBlockId = (id) => id.length > 36 && id[36] === '-' ? id.slice(0, 36) : id;
const mondayOf = (date) => {
    const copy = new Date(date);
    const day = copy.getDay() || 7;
    copy.setDate(copy.getDate() - day + 1);
    return copy;
};
const isRecurringOn = (block, date) => {
    const base = dateFromString(block.block_date);
    const dow = date.getDay();
    const dayMatch = base.getDay() === dow;
    if (block.recurrence === 'daily')
        return date >= base;
    if (block.recurrence === 'weekdays')
        return date >= base && dow >= 1 && dow <= 5;
    if (block.recurrence === 'tue-fri')
        return date >= base && dow >= 2 && dow <= 5;
    if (block.recurrence === 'weekends')
        return date >= base && (dow === 0 || dow === 6);
    if (block.recurrence === 'weekly')
        return date >= base && dayMatch;
    return toDate(date) === block.block_date;
};
export const Organization = ({ onStartPomodoro, focusMinutes, breakMinutes, pomodoroState }) => {
    const [periods, setPeriods] = useState([]);
    const [periodIndex, setPeriodIndex] = useState(0);
    const [blocks, setBlocks] = useState([]);
    const [subjects, setSubjects] = useState([]);
    const [tasks, setTasks] = useState([]);
    const [view, setView] = useState('week');
    const [weekStart, setWeekStart] = useState(mondayOf(new Date()));
    const [selectedDate, setSelectedDate] = useState(toDate(new Date()));
    const [showBlockForm, setShowBlockForm] = useState(false);
    const [editingBlock, setEditingBlock] = useState(null);
    const [showPeriodForm, setShowPeriodForm] = useState(false);
    const [focusBlock, setFocusBlock] = useState(null);
    const [error, setError] = useState(null);
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
        if (!period)
            return [];
        const result = [];
        const current = dateFromString(period.start_date);
        const end = dateFromString(period.end_date);
        blocks.forEach((block) => {
            const day = dateFromString(block.block_date);
            if (block.recurrence === 'none' || !block.recurrence) {
                if (day >= current && day <= end)
                    result.push(block);
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
    const weekDates = useMemo(() => Array.from({ length: 7 }, (_, i) => {
        const d = new Date(weekStart);
        d.setDate(d.getDate() + i);
        return d;
    }), [weekStart]);
    const dayBlocks = visibleBlocks
        .filter((b) => b.block_date === selectedDate)
        .sort((a, b) => minutes(a.start_time) - minutes(b.start_time));
    const weekBlocks = (date) => visibleBlocks.filter((b) => b.block_date === toDate(date)).sort((a, b) => minutes(a.start_time) - minutes(b.start_time));
    const subjectName = (id) => subjects.find((s) => s.id === id)?.name;
    const taskName = (id) => tasks.find((t) => t.id === id)?.title;
    const totals = useMemo(() => {
        const relevant = visibleBlocks.filter((b) => b.block_date >= toDate(weekStart) && b.block_date <= toDate(weekDates[6]));
        const study = relevant.filter((b) => b.block_type === 'study' || b.block_type === 'review').reduce((s, b) => s + duration(b), 0);
        const work = relevant.filter((b) => b.block_type === 'work').reduce((s, b) => s + duration(b), 0);
        const occupied = relevant.reduce((s, b) => s + duration(b), 0);
        const pomodoros = relevant.reduce((s, b) => s + b.pomodoros_estimated, 0);
        return { study, work, free: Math.max(0, 24 * 60 * 7 - occupied), pomodoros };
    }, [visibleBlocks, weekDates, weekStart]);
    const dailyLoad = (date) => visibleBlocks.filter((b) => b.block_date === date).reduce((s, b) => s + duration(b), 0);
    const loadLabel = (value) => value >= 660
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
    const saveBlock = async (data) => {
        const payload = { ...data, recurrence: data.recurrence || 'none' };
        const query = editingBlock
            ? supabase.from('org_blocks').update(payload).eq('id', sourceBlockId(editingBlock.id))
            : supabase.from('org_blocks').insert(payload);
        const { error: saveError } = await query;
        if (saveError)
            setError('No se pudo guardar el bloque');
        else {
            setShowBlockForm(false);
            setEditingBlock(null);
            loadData();
        }
    };
    const deleteBlock = async (block) => {
        const { error: deleteError } = await supabase.from('org_blocks').delete().eq('id', sourceBlockId(block.id));
        if (deleteError)
            setError('No se pudo eliminar el bloque');
        else
            loadData();
    };
    const savePeriod = async (data) => {
        const { error: saveError } = await supabase.from('org_periods').insert({ ...data, is_active: true });
        if (saveError)
            setError('No se pudo crear el periodo');
        else {
            setShowPeriodForm(false);
            loadData();
        }
    };
    const deletePeriod = async (id) => {
        const { error: deleteError } = await supabase.from('org_periods').delete().eq('id', id);
        if (deleteError)
            setError('No se pudo eliminar el periodo');
        else
            loadData();
    };
    const moveWeek = (amount) => {
        const next = new Date(weekStart);
        next.setDate(next.getDate() + amount * 7);
        setWeekStart(next);
    };
    const startFocusForBlock = (block) => {
        setFocusBlock(block);
        onStartPomodoro();
    };
    const closeFocus = () => {
        setFocusBlock(null);
        pomodoroState.reset();
    };
    const defaultBlockDate = (() => {
        if (!period)
            return toDate(new Date());
        const today = toDate(new Date());
        if (today >= period.start_date && today <= period.end_date)
            return today;
        return period.start_date;
    })();
    const openNewBlock = (date = defaultBlockDate) => {
        setSelectedDate(date);
        setEditingBlock(null);
        setShowBlockForm(true);
    };
    // --- No period state ---
    if (!period) {
        return (_jsxs("div", { className: "p-8", children: [_jsxs("div", { className: "mb-8", children: [_jsx("h1", { className: "text-3xl font-bold text-gray-800", children: "Organizaci\u00F3n" }), _jsx("p", { className: "mt-1 text-gray-600", children: "Planifica tu tiempo, bloques de estudio y descanso." })] }), _jsxs("div", { className: "rounded-xl border border-gray-200 bg-white p-12 text-center", children: [_jsx(CalendarDays, { className: "mx-auto mb-4 h-12 w-12 text-amber-500" }), _jsx("h2", { className: "mb-2 text-xl font-bold text-gray-800", children: "Crea tu primer periodo" }), _jsx("button", { onClick: () => setShowPeriodForm(true), className: "rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 px-5 py-3 font-semibold text-white", children: "Nuevo periodo" })] }), showPeriodForm && _jsx(OrganizationPeriodForm, { onSubmit: savePeriod, onCancel: () => setShowPeriodForm(false) })] }));
    }
    return (_jsxs("div", { className: "p-8", children: [_jsxs("div", { className: "mb-6 flex flex-col justify-between gap-4 lg:flex-row lg:items-center", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-3xl font-bold text-gray-800", children: "Organizaci\u00F3n" }), _jsx("p", { className: "mt-1 text-gray-600", children: "Planifica tu tiempo, bloques de estudio y descanso." })] }), _jsxs("div", { className: "flex gap-2", children: [_jsx("button", { onClick: () => setShowPeriodForm(true), className: "rounded-lg border border-gray-300 bg-white px-4 py-2 font-medium text-gray-700 hover:bg-gray-50", children: "Crear periodo" }), _jsxs("button", { onClick: () => openNewBlock(), className: "flex items-center gap-2 rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 px-4 py-2 font-semibold text-white", children: [_jsx(Plus, { className: "h-4 w-4" }), "A\u00F1adir bloque"] })] })] }), error && _jsx("div", { className: "mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700", children: error }), _jsx("div", { className: "mb-6 rounded-xl border border-amber-200 bg-gradient-to-r from-amber-50 to-orange-50 p-5", children: _jsxs("div", { className: "flex flex-col justify-between gap-3 md:flex-row md:items-center", children: [_jsxs("div", { className: "flex items-center gap-3", children: [periods.length > 1 && (_jsx("button", { onClick: () => setPeriodIndex((i) => (i - 1 + periods.length) % periods.length), className: "rounded-lg bg-white/80 p-2 hover:bg-white", children: _jsx(ChevronLeft, { className: "h-5 w-5 text-gray-600" }) })), _jsxs("div", { children: [_jsxs("p", { className: "text-sm font-medium text-amber-700", children: ["Periodo actual ", periods.length > 1 && `(${periodIndex + 1}/${periods.length})`] }), _jsx("h2", { className: "text-xl font-bold text-gray-800", children: period.name }), _jsxs("p", { className: "text-sm text-gray-600", children: [dateFromString(period.start_date).toLocaleDateString('es-ES'), " \u2013 ", dateFromString(period.end_date).toLocaleDateString('es-ES')] })] }), periods.length > 1 && (_jsx("button", { onClick: () => setPeriodIndex((i) => (i + 1) % periods.length), className: "rounded-lg bg-white/80 p-2 hover:bg-white", children: _jsx(ChevronRight, { className: "h-5 w-5 text-gray-600" }) }))] }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsxs("button", { onClick: () => deletePeriod(period.id), className: "flex items-center gap-1 rounded-lg bg-white/80 px-3 py-2 text-sm font-medium text-red-600 hover:bg-white", children: [_jsx(Trash2, { className: "h-4 w-4" }), "Eliminar periodo"] }), _jsxs("div", { className: "flex items-center gap-2 rounded-lg bg-white/80 p-1", children: [_jsx("button", { onClick: () => setView('week'), className: `rounded-md px-3 py-2 text-sm font-semibold ${view === 'week' ? 'bg-amber-500 text-white' : 'text-gray-600'}`, children: "Semana" }), _jsx("button", { onClick: () => setView('day'), className: `rounded-md px-3 py-2 text-sm font-semibold ${view === 'day' ? 'bg-amber-500 text-white' : 'text-gray-600'}`, children: "Hoy" })] })] })] }) }), _jsxs("div", { className: "mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4", children: [_jsx(Stat, { icon: _jsx(Clock3, {}), label: "Estudio", value: `${Math.floor(totals.study / 60)}h ${totals.study % 60}m`, color: "text-amber-600" }), _jsx(Stat, { icon: _jsx(TrendingUp, {}), label: "Trabajo", value: `${Math.floor(totals.work / 60)}h ${totals.work % 60}m`, color: "text-blue-600" }), _jsx(Stat, { icon: _jsx(Coffee, {}), label: "Tiempo libre", value: `${Math.floor(totals.free / 60)}h`, color: "text-green-600" }), _jsx(Stat, { icon: _jsx("span", { className: "text-lg font-bold", children: "P" }), label: "Pomodoros", value: `${totals.pomodoros} planificados`, color: "text-orange-600" })] }), view === 'week' ? (
            /* Weekly view */
            _jsxs("div", { className: "rounded-xl border border-gray-200 bg-white p-4", children: [_jsxs("div", { className: "mb-4 flex items-center justify-between", children: [_jsx("button", { onClick: () => moveWeek(-1), className: "rounded-lg p-2 hover:bg-gray-100", children: _jsx(ChevronLeft, { className: "h-5 w-5" }) }), _jsxs("h2", { className: "font-bold text-gray-800", children: [weekDates[0].toLocaleDateString('es-ES', { day: 'numeric', month: 'long' }), " \u2013 ", weekDates[6].toLocaleDateString('es-ES', { day: 'numeric', month: 'long' })] }), _jsx("button", { onClick: () => moveWeek(1), className: "rounded-lg p-2 hover:bg-gray-100", children: _jsx(ChevronRight, { className: "h-5 w-5" }) })] }), _jsx("div", { className: "grid grid-cols-1 gap-3 md:grid-cols-7", children: weekDates.map((date, i) => {
                            const items = weekBlocks(date);
                            const load = loadLabel(dailyLoad(toDate(date)));
                            return (_jsxs("div", { onClick: () => { setSelectedDate(toDate(date)); setView('day'); }, className: "min-h-48 cursor-pointer rounded-lg border border-gray-200 bg-gray-50 p-3 hover:border-amber-300", children: [_jsxs("div", { className: "mb-2 flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("p", { className: "text-xs font-semibold uppercase text-gray-500", children: dayNames[i] }), _jsx("p", { className: "font-bold text-gray-800", children: date.getDate() })] }), _jsx("span", { className: `h-2.5 w-2.5 rounded-full ${load.dot}`, title: load.label })] }), _jsxs("div", { className: "space-y-2", children: [items.slice(0, 5).map((block) => (_jsxs("div", { className: `rounded-md border p-2 text-xs ${typeColors[block.block_type]}`, children: [_jsxs("p", { className: "font-bold", children: [block.start_time.slice(0, 5), "\u2013", block.end_time.slice(0, 5)] }), _jsx("p", { className: "truncate", children: block.name })] }, block.id))), items.length > 5 && _jsxs("p", { className: "text-xs text-gray-500", children: ["+", items.length - 5, " m\u00E1s"] })] }), _jsx("p", { className: `mt-3 text-xs font-medium ${load.color}`, children: load.label })] }, toDate(date)));
                        }) })] })) : (
            /* Daily view */
            _jsxs("div", { className: "grid grid-cols-1 gap-6 lg:grid-cols-3", children: [_jsx("div", { className: "lg:col-span-2", children: _jsxs("div", { className: "rounded-xl border border-gray-200 bg-white p-5", children: [_jsxs("div", { className: "mb-5 flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("p", { className: "text-sm text-gray-500", children: "Vista de hoy" }), _jsx("h2", { className: "text-xl font-bold text-gray-800", children: dateFromString(selectedDate).toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' }) })] }), _jsx("button", { onClick: () => openNewBlock(), className: "rounded-lg bg-amber-100 p-2 text-amber-700 hover:bg-amber-200", children: _jsx(Plus, { className: "h-5 w-5" }) })] }), dayBlocks.length === 0 ? (_jsx("p", { className: "py-12 text-center text-gray-500", children: "No hay bloques planificados para este d\u00EDa." })) : (_jsx("div", { className: "space-y-3", children: dayBlocks.map((block) => (_jsx(BlockRow, { block: block, subjectName: subjectName(block.subject_id), taskName: taskName(block.task_id), onEdit: () => {
                                            const srcId = sourceBlockId(block.id);
                                            const original = blocks.find((b) => b.id === srcId);
                                            setEditingBlock(original || block);
                                            setShowBlockForm(true);
                                        }, onDelete: () => deleteBlock(block), onStartPomodoro: () => startFocusForBlock(block) }, block.id))) }))] }) }), _jsxs("div", { className: "space-y-4", children: [_jsxs("div", { className: "rounded-xl border border-gray-200 bg-white p-5", children: [_jsx("h3", { className: "mb-4 font-bold text-gray-800", children: "Carga diaria" }), _jsxs("p", { className: "text-3xl font-bold text-gray-800", children: [Math.floor(dailyLoad(selectedDate) / 60), "h ", dailyLoad(selectedDate) % 60, "m"] }), _jsx("p", { className: `mt-1 text-sm font-semibold ${loadLabel(dailyLoad(selectedDate)).color}`, children: loadLabel(dailyLoad(selectedDate)).label }), dailyLoad(selectedDate) >= 660 && (_jsxs("p", { className: "mt-4 rounded-lg bg-orange-50 p-3 text-sm text-orange-800", children: ["Hoy tienes ", Math.round(dailyLoad(selectedDate) / 60), " horas de actividades planificadas. Se recomienda dejar tiempo de descanso."] })), _jsxs("div", { className: "mt-5 space-y-2 text-sm text-gray-600", children: [_jsxs("p", { children: ["Ocupado: ", Math.floor(dailyLoad(selectedDate) / 60), "h ", dailyLoad(selectedDate) % 60, "m"] }), _jsxs("p", { children: ["Pomodoros: ", dayBlocks.reduce((s, b) => s + b.pomodoros_estimated, 0), " planificados"] }), _jsxs("p", { children: ["Completados: ", dayBlocks.reduce((s, b) => s + b.pomodoros_completed, 0)] })] })] }), _jsxs("div", { className: "rounded-xl border border-amber-200 bg-amber-50 p-5", children: [_jsx("h3", { className: "mb-3 font-bold text-gray-800", children: "Siguiente actividad de hoy" }), nextActivityToday ? (_jsxs("div", { children: [_jsx("div", { className: `mb-2 inline-block rounded-md border px-3 py-1 text-xs font-bold ${typeColors[nextActivityToday.block_type]}`, children: typeLabels[nextActivityToday.block_type] }), _jsx("p", { className: "text-lg font-bold text-gray-800", children: nextActivityToday.name }), _jsxs("p", { className: "text-sm text-gray-600", children: [nextActivityToday.start_time.slice(0, 5), "\u2013", nextActivityToday.end_time.slice(0, 5)] }), nextActivityToday.pomodoros_estimated > 0 && (_jsxs("p", { className: "mt-1 text-xs text-amber-700 font-medium", children: [nextActivityToday.pomodoros_estimated, " Pomodoros estimados"] }))] })) : (_jsx("p", { className: "text-sm text-gray-500", children: "No quedan actividades pendientes para hoy." }))] }), _jsxs("div", { className: "rounded-xl border border-gray-200 bg-white p-5", children: [_jsx("h3", { className: "mb-3 font-bold text-gray-800", children: "Pr\u00F3ximas actividades" }), visibleBlocks
                                        .filter((b) => b.block_date >= toDate(new Date()))
                                        .slice(0, 5)
                                        .map((block) => (_jsxs("p", { className: "border-b border-gray-100 py-2 text-sm text-gray-600", children: [_jsx("span", { className: "font-semibold text-gray-800", children: block.name }), _jsx("br", {}), dateFromString(block.block_date).toLocaleDateString('es-ES'), " \u00B7 ", block.start_time.slice(0, 5)] }, block.id)))] })] })] })), focusBlock && (_jsxs("div", { className: "fixed bottom-6 right-6 z-50 w-80 rounded-2xl border border-amber-300 bg-white shadow-2xl", children: [_jsxs("div", { className: "flex items-center justify-between border-b border-amber-200 bg-gradient-to-r from-amber-50 to-orange-50 px-5 py-3", children: [_jsxs("div", { children: [_jsx("p", { className: "text-xs font-semibold uppercase text-amber-700", children: "Modo Enfoque" }), _jsx("p", { className: "text-sm font-bold text-gray-800 truncate max-w-48", children: focusBlock.name })] }), _jsx("button", { onClick: closeFocus, className: "rounded-lg p-1.5 hover:bg-white", children: _jsx(X, { className: "h-4 w-4 text-gray-500" }) })] }), _jsxs("div", { className: "px-5 py-6 text-center", children: [_jsx("p", { className: "text-5xl font-bold text-gray-800", children: pomodoroState.formatTime(pomodoroState.timeLeft) }), _jsx("p", { className: "mt-2 text-sm font-medium text-amber-600", children: pomodoroState.isFocusMode ? 'Concéntrate en tu tarea actual' : 'Descanso' }), _jsxs("div", { className: "mt-4 flex justify-center gap-2", children: [!pomodoroState.isActive ? (_jsx("button", { onClick: pomodoroState.start, className: "rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 px-4 py-2 text-sm font-semibold text-white", children: "Iniciar" })) : pomodoroState.isPaused ? (_jsx("button", { onClick: pomodoroState.resume, className: "rounded-lg bg-amber-500 px-4 py-2 text-sm font-semibold text-white", children: "Continuar" })) : (_jsxs("button", { onClick: pomodoroState.pause, className: "rounded-lg bg-gray-200 px-4 py-2 text-sm font-semibold text-gray-700", children: [_jsx(Pause, { className: "inline h-4 w-4" }), " Pausar"] })), _jsx("button", { onClick: pomodoroState.skip, className: "rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-600", children: "Saltar" })] })] })] })), showBlockForm && (_jsx(OrganizationBlockForm, { block: editingBlock, selectedDate: selectedDate, subjects: subjects, tasks: tasks, focusMinutes: focusMinutes, breakMinutes: breakMinutes, onSubmit: saveBlock, onCancel: () => { setShowBlockForm(false); setEditingBlock(null); } })), showPeriodForm && (_jsx(OrganizationPeriodForm, { onSubmit: savePeriod, onCancel: () => setShowPeriodForm(false) }))] }));
};
const Stat = ({ icon, label, value, color }) => (_jsxs("div", { className: "rounded-xl border border-gray-200 bg-white p-4", children: [_jsxs("div", { className: `mb-2 flex items-center gap-2 ${color}`, children: [icon, _jsx("span", { className: "text-sm font-medium text-gray-600", children: label })] }), _jsx("p", { className: "text-xl font-bold text-gray-800", children: value })] }));
const BlockRow = ({ block, subjectName, taskName, onEdit, onDelete, onStartPomodoro, }) => (_jsxs("div", { className: `flex flex-col gap-3 rounded-lg border-l-4 p-4 sm:flex-row sm:items-center sm:justify-between ${typeColors[block.block_type]}`, children: [_jsxs("div", { className: "flex items-start gap-3", children: [_jsxs("div", { className: "min-w-28 text-sm font-bold", children: [block.start_time.slice(0, 5), "\u2013", block.end_time.slice(0, 5)] }), _jsxs("div", { children: [_jsx("p", { className: "font-bold", children: block.name }), _jsxs("p", { className: "text-xs opacity-80", children: [typeLabels[block.block_type], subjectName ? ` · ${subjectName}` : '', taskName ? ` · ${taskName}` : '', " \u00B7 ", duration(block), " min \u00B7 ", block.pomodoros_estimated, " Pomodoros"] })] })] }), _jsxs("div", { className: "flex gap-1", children: [_jsxs("button", { onClick: onStartPomodoro, className: "flex items-center gap-1 rounded-md bg-white/70 px-2 py-1 text-xs font-semibold hover:bg-white", children: [_jsx(Play, { className: "h-3 w-3" }), "Iniciar Pomodoro"] }), _jsx("button", { onClick: onEdit, className: "rounded-md bg-white/70 p-2 hover:bg-white", children: _jsx(Edit3, { className: "h-4 w-4" }) }), _jsx("button", { onClick: onDelete, className: "rounded-md bg-white/70 p-2 text-red-600 hover:bg-white", children: _jsx(Trash2, { className: "h-4 w-4" }) })] })] }));
