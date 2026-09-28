import { useState } from 'react';
import { X } from 'lucide-react';

interface OrganizationPeriodFormProps {
  onSubmit: (data: { name: string; start_date: string; end_date: string }) => void;
  onCancel: () => void;
}

export const OrganizationPeriodForm = ({ onSubmit, onCancel }: OrganizationPeriodFormProps) => {
  const [name, setName] = useState('');
  const [startDate, setStartDate] = useState('2026-09-15');
  const [endDate, setEndDate] = useState('2026-10-22');

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (name.trim() && startDate <= endDate) onSubmit({ name: name.trim(), start_date: startDate, end_date: endDate });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-gray-200 p-6">
          <h3 className="text-xl font-bold text-gray-800">Nuevo periodo</h3>
          <button onClick={onCancel} className="rounded-lg p-2 hover:bg-gray-100"><X className="h-5 w-5 text-gray-600" /></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4 p-6">
          <div><label className="mb-2 block text-sm font-medium text-gray-700">Nombre</label><input value={name} onChange={(event) => setName(event.target.value)} required placeholder="Ej: Periodo de alta carga" className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-amber-500" /></div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="mb-2 block text-sm font-medium text-gray-700">Inicio</label><input type="date" value={startDate} onChange={(event) => setStartDate(event.target.value)} required className="w-full rounded-lg border border-gray-300 px-3 py-3 focus:ring-2 focus:ring-amber-500" /></div>
            <div><label className="mb-2 block text-sm font-medium text-gray-700">Final</label><input type="date" value={endDate} onChange={(event) => setEndDate(event.target.value)} required className="w-full rounded-lg border border-gray-300 px-3 py-3 focus:ring-2 focus:ring-amber-500" /></div>
          </div>
          <div className="flex gap-3 pt-2"><button type="submit" className="flex-1 rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 px-6 py-3 font-semibold text-white">Crear periodo</button><button type="button" onClick={onCancel} className="flex-1 rounded-lg bg-gray-200 px-6 py-3 font-semibold text-gray-700">Cancelar</button></div>
        </form>
      </div>
    </div>
  );
};
