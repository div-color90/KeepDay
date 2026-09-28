import { Play, Pause, RotateCcw, SkipForward, Settings } from 'lucide-react';
import { useState } from 'react';

interface PomodoroTimerProps {
  timeLeft: number;
  isActive: boolean;
  isPaused: boolean;
  isFocusMode: boolean;
  focusTime: number;
  breakTime: number;
  formatTime: (seconds: number) => string;
  onStart: () => void;
  onPause: () => void;
  onResume: () => void;
  onReset: () => void;
  onSkip: () => void;
  onFocusTimeChange: (time: number) => void;
  onBreakTimeChange: (time: number) => void;
}

export const PomodoroTimer = ({
  timeLeft,
  isActive,
  isPaused,
  isFocusMode,
  focusTime,
  breakTime,
  formatTime,
  onStart,
  onPause,
  onResume,
  onReset,
  onSkip,
  onFocusTimeChange,
  onBreakTimeChange,
}: PomodoroTimerProps) => {
  const [showSettings, setShowSettings] = useState(false);
  const [tempFocusTime, setTempFocusTime] = useState(focusTime);
  const [tempBreakTime, setTempBreakTime] = useState(breakTime);

  const progress = isFocusMode
    ? ((focusTime * 60 - timeLeft) / (focusTime * 60)) * 100
    : ((breakTime * 60 - timeLeft) / (breakTime * 60)) * 100;

  const handleSaveSettings = () => {
    onFocusTimeChange(tempFocusTime);
    onBreakTimeChange(tempBreakTime);
    setShowSettings(false);
  };

  return (
    <div className="relative">
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">
              {isFocusMode ? 'Modo Enfoque' : 'Descanso'}
            </h2>
            <p className="text-gray-500 text-sm mt-1">
              {isFocusMode
                ? 'Concéntrate en tu tarea actual'
                : 'Toma un descanso, lo mereces'}
            </p>
          </div>
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Settings className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        <div className="flex flex-col items-center justify-center py-12">
          <div className="relative w-64 h-64 mb-8">
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="128"
                cy="128"
                r="120"
                stroke="#f3f4f6"
                strokeWidth="12"
                fill="none"
              />
              <circle
                cx="128"
                cy="128"
                r="120"
                stroke={isFocusMode ? 'url(#gradient)' : '#10b981'}
                strokeWidth="12"
                fill="none"
                strokeDasharray={`${2 * Math.PI * 120}`}
                strokeDashoffset={`${2 * Math.PI * 120 * (1 - progress / 100)}`}
                strokeLinecap="round"
                className="transition-all duration-1000"
              />
              <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#f59e0b" />
                  <stop offset="100%" stopColor="#f97316" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="text-6xl font-bold text-gray-800 mb-2">
                  {formatTime(timeLeft)}
                </div>
                <div className="text-sm text-gray-500">
                  {!isActive && !isPaused && 'Haz clic para iniciar enfoque'}
                  {isActive && !isPaused && 'En progreso...'}
                  {isPaused && 'Pausado'}
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-4">
            {!isActive && !isPaused && (
              <button
                onClick={onStart}
                className="px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl font-semibold hover:from-amber-600 hover:to-orange-600 transition-all shadow-lg hover:shadow-xl flex items-center gap-2"
              >
                <Play className="w-5 h-5" />
                Iniciar
              </button>
            )}
            {isActive && !isPaused && (
              <button
                onClick={onPause}
                className="px-8 py-4 bg-gray-700 text-white rounded-xl font-semibold hover:bg-gray-800 transition-all shadow-lg hover:shadow-xl flex items-center gap-2"
              >
                <Pause className="w-5 h-5" />
                Pausar
              </button>
            )}
            {isPaused && (
              <button
                onClick={onResume}
                className="px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl font-semibold hover:from-amber-600 hover:to-orange-600 transition-all shadow-lg hover:shadow-xl flex items-center gap-2"
              >
                <Play className="w-5 h-5" />
                Reanudar
              </button>
            )}
            {(isActive || isPaused) && (
              <>
                <button
                  onClick={onReset}
                  className="px-6 py-4 bg-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-300 transition-all flex items-center gap-2"
                >
                  <RotateCcw className="w-5 h-5" />
                  Reiniciar
                </button>
                <button
                  onClick={onSkip}
                  className="px-6 py-4 bg-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-300 transition-all flex items-center gap-2"
                >
                  <SkipForward className="w-5 h-5" />
                  Saltar
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {showSettings && (
        <div className="absolute top-0 left-0 right-0 bg-white rounded-2xl shadow-xl p-6 z-10 border border-gray-200">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Configuración</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tiempo de enfoque (minutos)
              </label>
              <input
                type="number"
                min="1"
                max="60"
                value={tempFocusTime}
                onChange={(e) => setTempFocusTime(parseInt(e.target.value))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tiempo de descanso (minutos)
              </label>
              <input
                type="number"
                min="1"
                max="30"
                value={tempBreakTime}
                onChange={(e) => setTempBreakTime(parseInt(e.target.value))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleSaveSettings}
                className="flex-1 px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-lg font-semibold hover:from-amber-600 hover:to-orange-600 transition-all"
              >
                Guardar
              </button>
              <button
                onClick={() => setShowSettings(false)}
                className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-all"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
