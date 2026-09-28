import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { BlockType, OrgBlock, Subject, Task } from '../types';

interface OrganizationBlockFormProps {
  block?: OrgBlock | null;
  selectedDate: string;
  subjects: Subject[];
  tasks: Task[];
  focusMinutes: number;
  breakMinutes: number;
  onSubmit: (data: {
    name: string;
    block_date: string;
    start_time: string;
    end_time: string;
    block_type: BlockType;
    subject_id: string | null;
    task_id: string | null;
    recurrence: string;
    notes: string;
    pomodoros_estimated: number;
  }) => void;
  onCancel: () => void;
}

const blockTypes: { value: BlockType; label: string }[] = [
  { value: 'study', label: 'Estudio' },
  { value: 'work', label: 'Trabajo' },
  { value: 'task', label: 'Tareas' },
  { value: 'tutoring', label: 'Clase particular' },
  { value: 'review', label: 'Repaso' },
  { value: 'break', label: 'Descanso' },
  { value: 'meal', label: 'Comida' },
  { value: 'commute', label: 'Desplazamiento' },
  { value: 'personal', label: 'Tiempo personal' },
  { value: 'sleep', label: 'Dormir' },
];

const getMinutes = (time: string) => {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
};

const getPomodoros = (start: string, end: string, focusMinutes: number, breakMinutes: number) => {
  const duration = getMinutes(end) - getMinutes(start);
  if (duration <= 0 || focusMinutes <= 0) return 0;
  return Math.floor(duration / (focusMinutes + breakMinutes));
};

export const OrganizationBlockForm = ({
  block,
  selectedDate,
  subjects,
  tasks,
  focusMinutes,
  breakMinutes,
  onSubmit,
  onCancel,
}: OrganizationBlockFormProps) => {
  const [name, setName] = useState(block?.name || '');
  const [date, setDate] = useState(block?.block_date || selectedDate);
  const [startTime, setStartTime] = useState(block?.start_time?.slice(0, 5) || '08:15');
  const [endTime, setEndTime] = useState(block?.end_time?.slice(0, 5) || '09:15');
  const [blockType, setBlockType] = useState<BlockType>(block?.block_type || 'study');
  const [subjectId, setSubjectId] = useState(block?.subject_id || '');
  const [taskId, setTaskId] = useState(block?.task_id || '');
  const [recurrence, setRecurrence] = useState(block?.recurrence || 'none');
  const [notes, setNotes] = useState(block?.notes || '');

  useEffect(() => {
    if (blockType !== 'study' && blockType !== 'review') {
      setSubjectId('');
    }
  }, [blockType]);

  const estimatedPomodoros = getPomodoros(startTime, endTime, focusMinutes, breakMinutes);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!name.trim() || getMinutes(endTime) <= getMinutes(startTime)) return;
    onSubmit({
      name: name.trim(),
      block_date: date,
      start_time: startTime,
      end_time: endTime,
      block_type: blockType,
      subject_id: subjectId || null,
      task_id: taskId || null,
      recurrence,
      notes: notes.trim(),
      pomodoros_estimated: estimatedPomodoros,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-gray-200 p-6">
          <h3 className="text-xl font-bold text-gray-800">{block ? 'Editar bloque' : 'Nuevo bloque'}</h3>
          <button onClick={onCancel} className="rounded-lg p-2 transition-colors hover:bg-gray-100">
            <X className="h-5 w-5 text-gray-600" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 p-6">
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">Nombre</label>
            <input value={name} onChange={(event) => setName(event.target.value)} required autoFocus placeholder="Ej: Estudiar programación" className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-transparent focus:ring-2 focus:ring-amber-500" />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">Fecha</label>
              <input type="date" value={date} onChange={(event) => setDate(event.target.value)} required className="w-full rounded-lg border border-gray-300 px-3 py-3 focus:border-transparent focus:ring-2 focus:ring-amber-500" />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">Inicio</label>
              <input type="time" value={startTime} onChange={(event) => setStartTime(event.target.value)} required className="w-full rounded-lg border border-gray-300 px-3 py-3 focus:border-transparent focus:ring-2 focus:ring-amber-500" />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">Fin</label>
              <input type="time" value={endTime} onChange={(event) => setEndTime(event.target.value)} required className="w-full rounded-lg border border-gray-300 px-3 py-3 focus:border-transparent focus:ring-2 focus:ring-amber-500" />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">Tipo de bloque</label>
            <select value={blockType} onChange={(event) => setBlockType(event.target.value as BlockType)} className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-transparent focus:ring-2 focus:ring-amber-500">
              {blockTypes.map((type) => <option key={type.value} value={type.value}>{type.label}</option>)}
            </select>
          </div>

          {(blockType === 'study' || blockType === 'review') && (
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">Materia (opcional)</label>
              <select value={subjectId} onChange={(event) => setSubjectId(event.target.value)} className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-transparent focus:ring-2 focus:ring-amber-500">
                <option value="">Sin materia</option>
                {subjects.map((subject) => <option key={subject.id} value={subject.id}>{subject.name}</option>)}
              </select>
            </div>
          )}

          {(blockType === 'task' || blockType === 'study' || blockType === 'review') && (
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">Tarea relacionada (opcional)</label>
              <select value={taskId} onChange={(event) => setTaskId(event.target.value)} className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-transparent focus:ring-2 focus:ring-amber-500">
                <option value="">Sin tarea</option>
                {tasks.filter((task) => !task.is_completed).map((task) => <option key={task.id} value={task.id}>{task.title}</option>)}
              </select>
            </div>
          )}

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">Repetición</label>
            <select value={recurrence} onChange={(event) => setRecurrence(event.target.value)} className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-transparent focus:ring-2 focus:ring-amber-500">
              <option value="none">No repetir</option>
              <option value="daily">Cada día</option>
              <option value="weekdays">De lunes a viernes</option>
              <option value="tue-fri">De martes a viernes</option>
              <option value="weekends">Sábado y domingo</option>
              <option value="weekly">Cada semana</option>
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">Notas</label>
            <textarea value={notes} onChange={(event) => setNotes(event.target.value)} rows={2} placeholder="Detalles adicionales..." className="w-full resize-none rounded-lg border border-gray-300 px-4 py-3 focus:border-transparent focus:ring-2 focus:ring-amber-500" />
          </div>

          <div className="rounded-lg bg-amber-50 p-3 text-sm text-amber-800">
            {getMinutes(endTime) > getMinutes(startTime)
              ? `${getMinutes(endTime) - getMinutes(startTime)} minutos · ${estimatedPomodoros} Pomodoros posibles (${focusMinutes}/${breakMinutes} min)`
              : 'La hora de finalización debe ser posterior a la de inicio.'}
          </div>

          <div className="flex gap-3 pt-2">
            <button type="submit" className="flex-1 rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 px-6 py-3 font-semibold text-white shadow-md transition-all hover:from-amber-600 hover:to-orange-600">{block ? 'Guardar cambios' : 'Crear bloque'}</button>
            <button type="button" onClick={onCancel} className="flex-1 rounded-lg bg-gray-200 px-6 py-3 font-semibold text-gray-700 transition-all hover:bg-gray-300">Cancelar</button>
          </div>
        </form>
      </div>
    </div>
  );
};
